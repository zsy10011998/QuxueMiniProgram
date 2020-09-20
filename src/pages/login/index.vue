<template>
  <div class="counter-warp">
    <div class="header">
      <div class="header-content">
        <img src="../../../static/images/quxue-logo-white.png"
             class="icon" />
        <div class="text">
          <div class="text-header">趣学 FUN</div>
          <div class="text-content">疫情期间 学习相伴</div>
        </div>
      </div>
    </div>

    <button hover-class="clicked"
            open-type="getUserInfo"
            :loading="loading"
            class="login-button"
            @click="login">微信登录</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { genTestUserSig } from '../../../static/utils/GenerateTestUserSig'
// import md5 from 'js-md5'
export default {
  data () {
    return {

      loginForm: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  computed: {
    ...mapState({
      openid: state => state.student.openid
    })
  },
  onUnload () {
    this.loading = false
  },
  methods: {
    login () {
      // let that = this
      wx.getSetting({
        success: (res) => {
          console.log('res', res)
          if (res.authSetting['scope.userInfo']) {
            wx.login({
              success: (res) => {
                if (res.code) {
                  this.$WXRequest.post({
                    url: '/onLogin/',
                    data: {
                      code: res.code
                    }
                  }).then(res => {
                    if (res.repCode === 200) {
                      wx.store.commit('setOpenId', res.openid)
                      console.log(res)
                      if (res.isRegister === false) {
                        wx.navigateTo({ url: '../signUp/main' })
                      } else {
                        wx.getUserInfo({
                          success: function (res) {
                            console.log('获得头像')
                            wx.store.commit('setAvatarUrl', res.userInfo.avatarUrl)
                            console.log(1)
                            wx.switchTab({ url: '../lecture-profile/main' })
                          }
                        }).then(res => {
                          if (res.repCode === 200) {
                            wx.store.commit('setOpenId', res.openid)
                            console.log(res)
                            wx.getUserInfo({
                              success: function (res) {
                                console.log('获得头像')
                                wx.store.commit('setAvatarUrl', res.userInfo.avatarUrl)
                                console.log(1)
                              }
                            })
                            if (res.isRegister === false) {
                              wx.navigateTo({ url: '../signUp/main' })
                            } else {
                              wx.switchTab({ url: '../other-function/main' })
                            }
                          } else {
                            wx.showToast({
                              title: '请重试',
                              icon: 'none',
                              duration: 1500
                            })
                          }
                        })
                      }
                    } else {
                      console.log('登录失败！' + res.errMsg)
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
  }
}
// 1
</script>

<style lang="stylus" scoped>
.counter-warp
  height 800rpx
  background $white
  text-align center
  .header
    height 80%
    padding 30px 40px
    background-color $theme-green
    color white
    .header-content
      display inline-block
      flex-direction column
      align-items center
      vertical-align middle
      .icon
        width 220px
        height 200px
      .text
        text-align center
        padding-left 8px
        .text-header
          font-size 28px
          font-family YouYuan
        .text-content
          padding-top 8px
          font-size 16px
          font-family Microsoft YaHei
  >>> .login-table
    margin 60px auto 45px
>>> .input
  text-align center
  height 32px
  width 250px
  background-color #f8f8f9
  border-block-color #dddee1
  border-radius 8px
  font-size 16px
  border 1px solid $border-base
  margin-bottom 8px
  margin-left auto
  margin-right auto
.login-button
  width 80vw
  background-color $theme-green
  color white
  font-size 16px
  margin 30px auto 30px
  &::before
    width 20px
    height 20px
    margin 0 6px 2px 0
.clicked
  background-color $dark-green
</style>
