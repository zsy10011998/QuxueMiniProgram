<template>
  <div class="container">
    <div class="search-bar">
      <img src="/static/images/search.png"/>
      <input v-model="ID" :focus="true" confirm-type="search" :placeholder="placeholder" @confirm="search" @input="handleInput"/>
    </div>

    <view style="padding-top:10px">
      <scroll-view v-if="type==='user'" style="height:400px" scroll-y="true">
        <i-cell-group v-for="(user, index) in userList" :key="index" >
          <i-cell i-class="cell" v-if="user.seen" :title="user.name"
            @click="clickUser(user.name)"></i-cell>
        </i-cell-group>
      </scroll-view>
    </view>

    <view style="padding-top:10px">
      <scroll-view v-if="type==='group'" style="height:400px" scroll-y="true">
        <i-cell-group v-for="(group, index) in groupList" :key="index" >
          <i-cell i-class="cell" v-if="group.seen" :title="group.GroupId" :label="'owner:' + group.Owner_Account" 
          :value="group.Name" @click="clickGroup(group.GroupId)"></i-cell>
        </i-cell-group>
      </scroll-view>
    </view>

    <button @click="handleClick" :loading="loading" v-show="searched" hover-class="clicked">{{buttonText}}</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// 该页面用于：
// 1. 搜索用户>发起会话
// 2. 搜索群组>申请加群
export default {
  data () {
    return {
      type: '', // user / group
      ID: '',
      searchedID: '',
      searched: false,
      loading: false,
      buttonText: '',
      userList: [],
      groupList: []
    }
  },
  onLoad ({ type }) {
    this.type = type
    if (type === 'user') {
      this.buttonText = '发起会话'
      wx.setNavigationBarTitle({ title: '发起会话' })
      this.$WXRequest.get({
        url: '/search_user/'
      }).then(res => {
        this.userList = []
        for (let index in res.data) {
          this.userList.push({name: res.data[index], seen: false})
        }
        console.log(this.userList)
      })
    } else {
      this.buttonText = '申请加群'
      wx.setNavigationBarTitle({ title: '加入群聊' })
      wx.setNavigationBarTitle({ title: '发起会话' })
      this.$WXRequest.get({
        url: '/search_group/'
      }).then(res => {
        this.groupList = []
        for (let index in res.data) {
          let group = res.data[index]
          group.seen = false
          this.groupList.push(group)
        }
        console.log(this.groupList)
      })
    }
  },
  onUnload () {
    this.ID = ''
    this.searched = false
    this.loading = false
    this.type = ''
  },
  computed: {
    ...mapState({
      groupList: state => state.group.groupList
    }),
    placeholder () {
      if (this.type === 'user') {
        return '请输入用户昵称'
      } else {
        return '请输入groupID'
      }
    }
  },
  methods: {
    handleInput () {
      if (this.searchedID === '' || this.ID !== this.searchedID) {
        this.searched = false
      }
      if (this.type === 'user') {
        for (let index in this.userList) {
          let user = this.userList[index]
          let seen = user.name.toLowerCase().includes(this.ID.toLowerCase())
          this.$set(this.userList[index], 'seen', seen)
        }
      } else {
        for (let index in this.groupList) {
          let group = this.groupList[index]
          let seen1 = group.GroupId.toLowerCase().includes(this.ID.toLowerCase())
          let seen2 = group.Owner_Account.toLowerCase().includes(this.ID.toLowerCase())
          let seen = seen1 || seen2
          this.$set(this.groupList[index], 'seen', seen)
        }
      }
    },
    search () {
      if (this.ID === '') {
        return
      }
      wx.showLoading({ title: '正在搜索' })
      if (this.type === 'user') {
        this.searchUser()
      } else {
        this.searchGroup()
      }
    },
    searchUser () {
      wx.$app.getUserProfile({ userIDList: [this.ID] })
        .then(({ data }) => {
          wx.hideLoading()
          if (data.length === 0) {
            wx.showToast({ title: '未找到该用户', duration: 1000, icon: 'none' })
            return
          }
          this.searched = true
          this.searchedID = this.ID
        }).catch((error) => {
          wx.hideLoading()
          wx.showToast({ title: error.message, duration: 1000, icon: 'none' })
        })
    },
    searchGroup () {
      wx.$app.searchGroupByID(this.ID)
        .then(({ data }) => {
          wx.hideLoading()
          const isJoined = this.groupList.findIndex((group) => group.groupID === this.ID) >= 0
          if (isJoined || data.group.type === 'AVChatRoom') {
            this.buttonText = '进入群聊'
          } else {
            this.buttonText = '申请加群'
          }
          this.searched = true
          this.searchedID = this.ID
        }).catch((error) => {
          wx.hideLoading()
          if (error.code === 10007) {
            wx.showToast({ title: '讨论组类型群组不允许申请加群', duration: 1000, icon: 'none' })
          } else {
            wx.showToast({ title: '未找到该群组', duration: 1000, icon: 'none' })
          }
        })
    },
    handleClick () {
      if (this.type === 'user') {
        this.createConversation()
      } else {
        this.joinGroup()
      }
    },
    // 发起会话
    createConversation () {
      this.loading = true
      this.$store.dispatch('checkoutConversation', `C2C${this.ID}`)
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 申请加群
    joinGroup () {
      this.loading = true
      wx.$app.joinGroup({ groupID: this.ID, applyMessage: '我想申请加入贵群，望批准！' })
        .then(() => {
          this.loading = false
          this.$store.dispatch('checkoutConversation', `GROUP${this.ID}`)
        })
        .catch(() => {
          this.loading = false
        })
    },
    clickUser (ID) {
      this.ID = ID
      for (let index in this.userList) {
        let user = this.userList[index]
        let seen = user.name.toLowerCase().includes(this.ID.toLowerCase())
        this.$set(this.userList[index], 'seen', seen)
      }
    },
    clickGroup (ID) {
      this.ID = ID
      for (let index in this.groupList) {
        let group = this.groupList[index]
        let seen1 = group.GroupId.toLowerCase().includes(this.ID.toLowerCase())
        let seen2 = group.Owner_Account.toLowerCase().includes(this.ID.toLowerCase())
        let seen = seen1 || seen2
        this.$set(this.groupList[index], 'seen', seen)
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
.container
  height 100vh
  padding 16px
  background-color $background
  .search-bar 
    display flex
    align-items center
    background-color $white
    border-radius 16px
    padding 5px 16px
    font-size 14px
    input
      width 100%
    img 
      width 14px
      height 14px
      margin-right 10px
  button 
    background-color $primary
    color $white
    width 80vw
    position absolute
    left 50%
    bottom 24px
    margin-left -40vw
  .clicked
    background-color $dark-primary

>>> .cell
  background-color #efefef
</style>
