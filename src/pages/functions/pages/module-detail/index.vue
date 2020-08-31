<template>
  <div class="module_detail">

    <i-notice-bar icon="systemprompt" loop speed="4000" closable>
      {{myModule.notice}}
    </i-notice-bar>

    <i-card :title="myModule.title" :extra="myModule.star + '⭐'" full>

      <view slot="content">{{myModule.introduce}}</view>

      <view slot="footer">
        <i-row>
          <i-col span="12" i-class="col-class">
            <i-button shape="circle" size="small" type="success" @click="handleCreateBlock">
              <i-icon type="add" />创建
            </i-button>
          </i-col>
          <i-col span="12" i-class="col-class">
            <i-button shape="circle" size="small" type="success" :disabled="like" @click="handleLike" >
              <i-icon v-if="like" type="like_fill" />
              <i-icon v-else type="like" />
                喜爱
            </i-button>
          </i-col>
        </i-row>

        <i-button v-if="myModule.owner===user" 
          shape="circle" size="small" type="success" @click="handleEdit">
          <i-icon type="brush" />编辑 
        </i-button>

      </view>

    </i-card>

    <dragSort :list="list" :props="props" @change="onDragSortChange"></dragSort>

  </div>
</template>

<script>
import dragSort from './drag.vue'
export default {
  components: {
    dragSort
  },
  data () {
    return {
      moduleId: -1,
      user: 0,
      props: {
        label: 'label'
      },
      list: [],
      myModule: {},
      blocks: [],
      like: false
    }
  },
  onLoad: function ({id}) {
    this.setModuleId(id)
    this.setUser()
  },
  onShow: function () {
    this.loadModule()
    this.loadAllBlocks()
    console.log('Show module')
  },
  onUnload: function () {
    this.list = []
  },
  methods: {
    onDragSortChange (e) {
      console.log(e)
      const dataJSON = {'blockorder': JSON.stringify(e.data)}
      console.log(dataJSON)
      this.$WXRequest.post({
        url: '/modules/' + this.moduleId + '/users/' + this.user + '/',
        data: dataJSON
      }).then(
        res => { console.log(res) }
      )
    },
    setModuleId (id) {
      this.moduleId = id
    },
    setUser () {
      this.user = wx.store.state.user.userId
    },
    handleCreateBlock () {
      console.log('before', this.myModule)
      wx.navigateTo({
        url: '../block-edit/main?mid=' + this.myModule.id + '&id=0&create=true'
      })
    },
    handleEdit () {
      wx.navigateTo({
        url: '../module-edit/main?id=' + this.myModule.id + '&create=false'
      })
    },
    handleLike () {
      if (this.like) {
        return
      }
      const star = this.myModule.star + 1
      const dataJSON = {user: this.user, moduleid: parseInt(this.moduleId)}
      console.log(dataJSON)
      this.$WXRequest.post({
        url: '/modulelikes/',
        data: dataJSON
      }).then(
        res => {
          wx.showToast({
            title: '收到你的喜爱',
            icon: 'success',
            duration: 2000
          })
          this.$set(this.myModule, 'star', star)
          this.like = true
        }
      )
    },
    loadModule () {
      let id = this.moduleId
      let user = this.user
      console.log('this user', this.user, user)
      this.$WXRequest.get({
        url: '/modules/' + id + '/'
      }).then(
        res => {
          this.myModule = res
        }
      )
      this.$WXRequest.get({
        url: '/modulelikes/?user=' + user + '&moduleid=' + id
      }).then(
        res => {
          this.like = res
        }
      )
    },
    loadAllBlocks () {
      let id = this.moduleId
      let originList = []
      let order = {}
      this.$WXRequest.get({
        url: '/modules/' + id + '/blocks/'
      }).then(
        res => {
          originList = res
          this.$WXRequest.get({
            url: '/modules/' + id + '/users/' + this.user + '/'
          }).then(
            res => {
              order = res
              if (order['detail'] !== undefined) {
                this.list = []
                originList.map(item => this.list.push({label: item}))
              } else {
                order = JSON.parse(order['blockorder'])
                let tmpList = []
                let newList = []
                originList.map(item => {
                  if (order[item.id] === undefined) {
                    newList.push({label: item})
                  } else {
                    tmpList[order[item.id]] = {label: item}
                  }
                })
                tmpList = tmpList.filter(item => item)
                tmpList.push(...newList)
                this.list = tmpList
              }
            }
          )
        }
      )
    }
  }
}
</script>

<style lang="stylus">
</style>