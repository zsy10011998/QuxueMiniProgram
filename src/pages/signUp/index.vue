<template>
  <div class="counter-warp">
    <div class="header">
      <div class="header-content">
        <img src="../../../static/images/quxue-logo-white.png"
             class="icon">
        <div class="text">
          <div class="text-header">趣学 FUN</div>
          <div class="text-content">疫情期间 学习相伴</div>
        </div>
      </div>
    </div>

    <i-panel i-class="login-table">
      <i-input type="text"
               v-model="signUpForm.username"
               title="昵称"
               placeholder="请输入昵称"
               maxlength=20
               i-class="input"
               @change="updateUsername" />

      <i-input type="password"
               v-model="signUpForm.password"
               title="密码"
               placeholder="请输入密码"
               maxlength=20
               i-class="input"
               @change="updatePassword" />

      <i-input type="password"
               v-model="signUpForm.passwordConfirm"
               title="确认密码"
               placeholder="请确认密码"
               maxlength=20
               i-class="input"
               @change="updatePasswordConfirm" />

      <i-input type="text"
               v-model="signUpForm.studentNo"
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
import { genTestUserSig } from '../../../static/utils/GenerateTestUserSig'
import md5 from 'js-md5'
export default {
  data () {
    return {
      signUpForm: {
        username: '',
        password: '',
        passwordConfirm: '',
        studentNo: ''
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
    signUp () {
      if (!this.signUpForm.username) {
        wx.showToast({
          title: '请输入用户名',
          icon: 'none',
          duration: 1500
        })
        return
      } else if (this.signUpForm.password !== this.signUpForm.passwordConfirm) {
        wx.showToast({
          title: '密码不一致',
          icon: 'none',
          duration: 1500
        })
        return
      } else if (this.signUpForm.password.length < 6) {
        wx.showToast({
          title: '密码强度不够，密码长度至少为6位',
          icon: 'none',
          duration: 1500
        })
        return
      } else if (this.signUpForm.studentNo.length < 8) {
        wx.showToast({
          title: '学号格式错误',
          icon: 'none',
          duration: 1500
        })
        return
      }
      this.$WXRequest.post({
        url: '/users/',
        data: {
          username: this.signUpForm.username,
          password_digest: md5(this.signUpForm.password),
          studentNo: this.signUpForm.studentNo
        }
      }).then(res => {
        console.log(res)
        if (res.repCode === 200) {
          this.$WXRequest.saveSession(res.data.sessionId)
          let userID = this.signUpForm.username
          wx.store.commit('setStudentNo', this.signUpForm.studentNo)
          wx.store.commit('setUserId', res.data.userId)
          console.log('Sign Up')
          console.log(wx.store.state.user)
          wx.$app.login({
            userID,
            userSig: genTestUserSig(userID).userSig
          }).then(() => {
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
    updateUsername (event) {
      let title = event.mp.detail.detail.value
      this.$set(this.signUpForm, 'username', title)
    },
    updatePassword (event) {
      let password = event.mp.detail.detail.value
      this.$set(this.signUpForm, 'password', password)
    },
    updatePasswordConfirm (event) {
      let password = event.mp.detail.detail.value
      this.$set(this.signUpForm, 'passwordConfirm', password)
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
.counter-warp {
  height: 100%;
  background: $white;
  text-align: center;

  .header {
    padding: 30px 40px;
    background-color: $theme-green;
    color: white;

    .header-content {
      display: flex;
      flex-direction: column;
      align-items: center;

      .icon {
        width: 110px;
        height: 100px;
      }

      .text {
        text-align: center;
        padding-left: 8px;

        .text-header {
          font-size: 28px;
          font-family: YouYuan;
        }

        .text-content {
          padding-top: 8px;
          font-size: 16px;
          font-family: Microsoft YaHei;
        }
      }
    }
  }

  >>> .login-table {
    margin: 60px auto 45px;
  }
}

>>> .input {
  text-align: center;
  height: 32px;
  width: 250px;
  background-color: #f8f8f9;
  border-block-color: #dddee1;
  border-radius: 8px;
  font-size: 16px;
  border: 1px solid $border-base;
  margin-bottom: 8px;
  margin-left: auto;
  margin-right: auto;
}

.login-button {
  width: 80vw;
  background-color: $theme-green;
  color: white;
  font-size: 16px;
  margin: 10px auto 10px;

  &::before {
    width: 20px;
    height: 20px;
    margin: 0 6px 2px 0;
  }
}

.clicked {
  background-color: $dark-green;
}
</style>
