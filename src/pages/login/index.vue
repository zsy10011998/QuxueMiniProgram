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

    <i-panel i-class="login-table">
      <i-input type="text"
               v-model="loginForm.username"
               title="昵称"
               placeholder="请输入昵称"
               maxlength="20"
               i-class="input"
               @change="updateUsername" />

      <i-input type="password"
               v-model="loginForm.password"
               title="密码"
               placeholder="请输入密码"
               maxlength="20"
               i-class="input"
               @change="updatePassword" />
    </i-panel>

    <button hover-class="clicked"
            :loading="loading"
            class="login-button"
            @click="login">登录</button>
    <button hover-class="clicked"
            class="login-button"
            @click="signUp()">还未注册？点击这里</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { genTestUserSig } from '../../../static/utils/GenerateTestUserSig'
import md5 from 'js-md5'
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
      myInfo: state => state.user.myInfo
    })
  },
  onUnload () {
    this.loading = false
  },
  methods: {
    login () {
      let passwordDigest = md5(this.loginForm.password)
      this.$WXRequest.post({
        url: '/sessions/',
        data: {
          username: this.loginForm.username,
          password_digest: passwordDigest
        }

      }).then(res => {
        if (res.repCode === 200 || res.repCode === 300) {
          this.$WXRequest.saveSession(res.data.sessionId)
          wx.store.commit('setStudentNo', res.data.studentNo)
          wx.store.commit('setUserId', res.data.userId)
          console.log('Login')
          console.log(res)
          console.log(wx.store.state.user)
          let userID = this.loginForm.username
          wx.$app.login({
            userID,
            userSig: genTestUserSig(userID).userSig
          }).then(() => {
            console.log('login success')
            wx.switchTab({ url: '../index/main' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 1500
          })
          this.loading = false
        }
      })
    },
    signUp () {
      wx.navigateTo({ url: '../signUp/main' })
    },
    updateUsername (event) {
      let title = event.mp.detail.detail.value
      this.$set(this.loginForm, 'username', title)
    },
    updatePassword (event) {
      let title = event.mp.detail.detail.value
      this.$set(this.loginForm, 'password', title)
    }
  }
}
// 1
</script>

<style lang="stylus" scoped>
.counter-warp
  height 100%
  background $white
  text-align center
  .header
    padding 30px 40px
    background-color $theme-green
    color white
    .header-content
      display flex
      flex-direction column
      align-items center
      .icon
        width 110px
        height 100px
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
  margin 10px auto 10px
  &::before
    width 20px
    height 20px
    margin 0 6px 2px 0
.clicked
  background-color $dark-green
</style>
