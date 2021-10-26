<template>
  <div class="counter-warp">
    <div class="header">
      <div class="header-content">
        <img src="../../../static/images/quxue-logo-white.png"
             class="icon">
        <div class="text">
          <div class="text-header">计算机导论与伦理学</div>
          <div class="text-content">2021年秋季学期</div>
        </div>
      </div>
    </div>

    <i-panel i-class="login-table">
      <i-input type="text"
               title="姓名"
               placeholder="请输入姓名"
               maxlength=20
               i-class="input"
               @change="updateUsername" />

      <i-input type="text"
               title="学号"
               placeholder="请输入学号"
               maxlength=10
               i-class="input"
               @change="updateStudentNo" />

    </i-panel>

    <button hover-class="clicked"
            :loading="loading"
            class="login-button"
            @click="signUp()">注册</button>
    <button hover-class="clicked"
            class="login-button"
            @click="back()">返回</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { genTestUserSig } from '../../../static/utils/GenerateTestUserSig'
// import md5 from 'js-md5'
export default {
  data () {
    return {
      signUpForm: {
        username: '',
        studentNo: ''
      },
      avatarUrl: '',
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
    signUp () {

      if (!this.signUpForm.username) {
        wx.showToast({
          title: '请输入用户名',
          icon: 'none',
          duration: 1500
        })
        return
      } else if (this.signUpForm.studentNo.length != 8) {
        wx.showToast({
          title: '学号格式错误',
          icon: 'none',
          duration: 1500
        })
        return
      } else{
        wx.getUserProfile({
          desc: '用于获取您的微信头像', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            this.$set(this,'avatarUrl',res.userInfo.avatarUrl)
            this.$WXRequest.post({
              url: '/register/',
              data: {
                openid: this.openid,
                name: this.signUpForm.username,
                studentNo: this.signUpForm.studentNo
              }
            }).then(res => {
              if (res.repCode === 200) {
                wx.store.commit('setName', this.name)
                wx.store.commit('setStudentNo', this.studentNo)
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 1500
                }).then(() => {
                  wx.store.commit('setAvatarUrl', this.avatarUrl)
                  console.log(this.avatarUrl)
                  this.$WXRequest.post({
                    url: '/changeInfo/',
                    data: {
                      openid: this.openid,
                      avatarUrl: this.avatarUrl
                    }
                  })
                  wx.switchTab({ url: '../other-function/main' })
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
        })
      }
    },
    updateUsername (event) {
      console.log(event)
      let title = event.mp.detail.detail.value
      this.$set(this.signUpForm, 'username', title)
    },
    updateStudentNo (event) {
      let studentNo = event.mp.detail.detail.value
      this.$set(this.signUpForm, 'studentNo', studentNo)
    },
    back () {
      wx.navigateBack()
    }
  }
}
</script>

<style lang="stylus" scoped>
.counter-warp
  height 100%
  background $white
  text-align center
  .header
    padding 30px 40px
    background-color $theme-blue
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
  background-color $theme-blue
  color white
  font-size 16px
  margin 10px auto 10px
  &::before
    width 20px
    height 20px
    margin 0 6px 2px 0
.clicked
  background-color $dark-blue
</style>
