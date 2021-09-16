<template>
  <div class="counter-warp">
    <div class="header">
      <div class="header-content">
        <img src="../../../static/images/quxue-logo-white.png"
             class="icon" />
        <div class="text">
          <div class="text-header fadable" :class="fading ? 'transparent': ''">
            {{ isAuthenticate ? '欢迎使用' : '计算机导论与伦理学' }}
          </div>
          <div class="text-content fadable" :class="fading ? 'transparent': ''">
            {{ isAuthenticate ? '初次见面' : '2021年秋季学期'}}
          </div>
          <div class="text-content fadable lower" :class="fading ? 'transparent': ''">
            {{ isAuthenticate ? '我们需要授权以关联您的信息' : ''}}
          </div>
        </div>
      </div>
    </div>
    <div class="buttondiv">
      <button hover-class="clicked"
        :open-type="isAuthenticate ? 'getUserInfo' : ''"
        :loading="loading"
        class="login-button"
        @click="login">
          <span class="fadable" :class="fading ? 'transparent': ''">{{ isAuthenticate ? '确认授权' : '微信登录'}}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { genTestUserSig } from '../../../static/utils/GenerateTestUserSig'
// import md5 from 'js-md5'
export default {
  data () {
    return {
      isAuthenticate: false,
      loginForm: {
        username: '',
        password: ''
      },
      loading: false,
      fading: false
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
  mounted () {
    // this.login()
  },
  methods: {
    login () {
      wx.getSetting({
        success: (res) => {
          console.log('res', res)
          console.log('scope.userinfo', res.authSetting['scope.userInfo'])
          if (res.authSetting['scope.userInfo']) {
            wx.login({
              success: (res) => {
                console.log('success:', res)
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
                          success: (res) => {
                            console.log('获得头像')
                            wx.store.commit('setAvatarUrl', res.userInfo.avatarUrl)
                            console.log(1)
                            this.$WXRequest.post({
                              url: '/changeInfo/',
                              data: {
                                openid: this.openid,
                                avatarUrl: res.userInfo.avatarUrl
                              }
                            })
                            wx.switchTab({ url: '../other-function/main' })
                          }
                        })
                      }
                    } else {
                      console.log('登录失败！' + res.errMsg)
                    }
                  })
                } else {
                  wx.showToast({
                    title: '请重试',
                    icon: 'none',
                    duration: 1500
                  })
                }
              }
            })
          } else {
            if (!this.isAuthenticate) {
              this.fadeText(true)
            } else {
              this.fadeText(false)
            }
          }
        }
      })
    },
    fadeText (isAuthenticate) {
      if (this.isAuthenticate === isAuthenticate) return
      this.$set(this, 'fading', true)
      setTimeout(() => {
        this.$set(this, 'isAuthenticate', isAuthenticate)
        this.$set(this, 'fading', false)
      }, 500)
    }
  }
}
// 1
</script>
<style lang = "wxss">
page{
  height: 100%;
}
</style>
<style lang="stylus" scoped>
.counter-warp
  height 100%
  background $white
  text-align center
  .header
    height 70%
    padding 30px 40px
    background-color $theme-blue
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
        .text-content.lower
          margin-top  10px
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
.buttondiv
  height 30%
.login-button
  width 80vw
  background-color $theme-blue
  color white
  font-size 16px
  margin 30px auto 30px
  transition all 0.5s
.clicked
  background-color $dark-blue
.transparent
  opacity 0
.fadable
  transition all 0.5s
</style>
