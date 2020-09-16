<template>
  <div class="profile">
    <i-cell-group>
      <i-cell title="姓名"
              :value="name"
              value-class="cell-value"
              is-link
              url="../update-profile/main?type=user&key=name"></i-cell>
      <i-cell title="头像">
        <i-avatar slot="footer"
                  i-class="avatar"
                  :src="avatarUrl" />
      </i-cell>
      <!-- <i-cell title="个性签名"
              value-class="cell-value"
              is-link
              url="../update-profile/main?type=user&key=signature">
        <div slot="footer"
             class="signature">
          {{myInfo.selfSignature || '暂无'}}
        </div>
      </i-cell> -->
      <i-cell title="学号"
              :value="studentNo"
              value-class="cell-value"
              is-link
              url="../update-profile/main?type=user&key=studentNo"></i-cell>
      <!-- <i-cell title="重置密码"
              value-class="cell-value"
              is-link
              url="../update-profile/main?type=user&key=password"></i-cell> -->
      <!-- <i-cell title="统一认证账号"
              value-class="cell-value"
              is-link
              url="../update-profile/main?type=user&key=buaa"></i-cell> -->
    </i-cell-group>
    <view style="margin-top: 50px; text-align: center">
      <!-- <button @click="getInfo()"
              open-type="getUserInfo"
              size="mini"
              type="primary">获取用户头像</button> <br> -->
      <!-- <button @click="refresh()"
              type="primary"
              size="mini"
              style="margin-top: 15px;">刷新课表</button> -->
    </view>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      nick: '',
      gender: false,
      avatar: ''
    }
  },
  computed: {
    ...mapState({
      myInfo: state => state.user.myInfo,
      studentNo: state => state.student.studentNo,
      name: state => state.student.name,
      avatarUrl: state => state.student.avatarUrl
    })
  },
  methods: {
    onChange (e) {
      this.avatar = e.target.value
    },
    getInfo () {
      wx.getUserInfo({
        success: function (res) {
          console.log(res)
          // var avatarUrl = 'userInfo.avatarUrl'
          // var nickName = 'userInfo.nickName'
          // this.avatar = res.userInfo.avatarUrl
          console.log(res.userInfo.avatarUrl)
        }
      })
    },
    getAvatar (event) {
      console.log('In getting avatar')
      let avatar = event.mp.detail.userInfo.avatarUrl
      console.log(avatar)
      wx.$app.updateMyProfile({ avatar: avatar }).then(res => {
        wx.$app.getMyProfile().then(res => {
          wx.store.commit('updateMyInfo', res.data)
          console.log(res.data)
        })
      })
    },
    refresh () {
      console.log('In refresh')
      let id = wx.store.state.user.userId
      console.log('userId=' + id)
      this.$WXRequest.get({
        url: '/newest_classes/' + id + '/',
        data: {
        }
      }).then(res => {
        console.log('In course schedule refresh')
        console.log(res)
        if (res.repCode === 200) {
          this.lessons = res.data
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 1500
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.profile
  background-color $background
  min-height 100vh
.avatar
  width 30px
  height 30px
  border-radius 3px
.signature
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
  max-width 50vw
.cell-value
  color $secondary !important
</style>
