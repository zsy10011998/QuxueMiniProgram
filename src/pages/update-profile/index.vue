<template>
  <div class="update-profile-wrapper">
    <input v-if="key!=='password'"
           class="input"
           :class="focus ? 'input-focus' : ''"
           type="text"
           v-model="value"
           :placeholder="placeholder"
           :focus="focus"
           @blur="focus = false"
           @focus="focus = true">
    <!-- <input v-if="key==='buaa'"
           class="input"
           :class="focus2 ? 'input-focus' : ''"
           type="text"
           placeholder="请输入密码"
           password
           v-model="password"
           :focus="focus2"
           @blur="focus2 = false"
           @focus="focus2 = true">
    <input v-if="key==='password'"
           class="input"
           :class="focus3 ? 'input-focus' : ''"
           type="text"
           placeholder="请输入原始密码"
           password
           v-model="originPassword"
           :focus="focus3"
           @blur="focus3 = false"
           @focus="focus3 = true">
    <input v-if="key==='password'"
           class="input"
           :class="focus4 ? 'input-focus' : ''"
           type="text"
           placeholder="请输入新密码"
           password
           v-model="newPassword"
           :focus="focus4"
           @blur="focus4 = false"
           @focus="focus4 = true">
    <input v-if="key==='password'"
           class="input"
           :class="focus5 ? 'input-focus' : ''"
           type="text"
           placeholder="请确认新密码"
           password
           v-model="newPasswordConfirm"
           :focus="focus5"
           @blur="focus5 = false"
           @focus="focus5 = true"> -->
    <button :class="{'button-disabled' : disabled}"
            :disabled="disabled"
            @click="handleClick()">确认修改</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import md5 from 'js-md5'

// 修改资料页，支持修改个人资料和群组相关资料
export default {
  data () {
    return {
      type: 'user', // user / group
      key: '',
      value: '',
      // password: '',
      focus: true,
      focus2: false,
      focus3: true,
      focus4: false,
      focus5: false

    }
  },
  computed: {
    ...mapState({
      myInfo: state => state.user.myInfo,
      groupProfile: state => state.conversation.currentConversation.groupProfile,
      openid: state => state.student.openid,
      name: state => state.student.name,
      stutNo: state => state.student.studentNo
    }),
    disabled () {
      switch (this.key) {
        case 'name':
          if (this.value !== this.name && this.value !== '' && undefined !== this.value) {
            return false
          }
          break
        case 'studentNo':
          if (this.value !== this.stutNo && this.value !== '' && undefined !== this.value) {
            return false
          }
          break
      }
      return true
    },
    placeholder () {
      switch (this.key) {
        case 'nick':
          return '请输入昵称'
        case 'signature':
          return '请输入个性签名'
        case 'nameCard':
          return '请输入群名片'
        case 'buaa':
          return '请输入统一认证账号'
        case 'studentNo':
          return '请输入学号'
        case 'name':
          return '请输入姓名'
      }
    }
  },
  onLoad ({ type, key, groupID }) {
    this.type = type
    this.key = key
    if (groupID) {
      this.groupID = groupID
    }
    let title = ''
    switch (key) {
      case 'nick':
        title = '修改昵称'
        this.value = this.myInfo.nick
        break
      case 'signature':
        title = '修改个性签名'
        this.value = this.myInfo.selfSignature
        break
      case 'nameCard':
        title = '修改群名片'
        this.value = this.groupProfile.selfInfo.nameCard
        break
      // case 'name':
      //   title = '修改群名称'
      //   this.value = this.groupProfile.name
      //   break
      case 'notification':
        title = '修改群公告'
        this.value = this.groupProfile.notification
        break
      case 'buaa':
        title = '修改统一账号'
        this.value = ''
        this.password = ''
        break
      case 'studentNo':
        title = '修改学号'
        this.value = this.studentNo
        break
      case 'password':
        title = '重置密码'
        this.originPassword = ''
        this.newPassword = ''
        break
      case 'name':
        title = '修改姓名'
        break
    }
    wx.setNavigationBarTitle({ title })
  },
  methods: {
    handleClick () {
      if (this.key === 'studentNo') {
        this.updatestudentNo()
      } else if (this.key === 'name') {
        this.updateName()
      }
    },

    updatestudentNo () {
      console.log(this.value)
      console.log(undefined !== this.value)
      if (this.value === '') {
        wx.showToast({
          title: '不能为空',
          icon: 'none',
          duration: 1500
        })
        return
      }
      if (this.value.length < 8) {
        wx.showToast({
          title: '学号格式错误',
          icon: 'none',
          duration: 1500
        })
        return
      }
      if (this.value === this.stutNo) {
        wx.showToast({
          title: '学号未改变',
          icon: 'none',
          duration: 1500
        })
        return
      }
      // wx.store.commit('setStudentNo', this.value)
      this.$WXRequest.post({
        url: '/changeInfo/',
        data: {
          openid: this.openid,
          studentNo: this.value
        }
      }).then(res => {
        if (res.repCode === 200) {
          wx.store.commit('setStudentNo', this.value)
          this.handleResolve()
        } else {
          console.log(res)
          wx.showToast({

            title: res.errMSsg,
            duration: 600
          })
        }
      })
    },
    updateName () {
      if (this.value === '') {
        wx.showToast({
          title: '不能为空',
          icon: 'none',
          duration: 1500
        })
        return
      }
      if (this.value === this.name) {
        wx.showToast({
          title: '姓名未改变',
          icon: 'none',
          duration: 1500
        })
        return
      }
      this.$WXRequest.post({
        url: '/changeInfo/',
        data: {
          openid: this.openid,
          name: this.value
        }
      }).then(res => {
        if (res.repCode === 200) {
          wx.store.commit('setName', this.value)
          this.handleResolve()
        } else {
          wx.showToast({
            title: res.errsmg,
            duration: 600
          })
        }
      })
    },
    resetPassword () {
      if (this.newPassword !== this.newPasswordConfirm) {
        wx.showToast({
          title: '两次密码输入不匹配，请确认密码输入正确',
          icon: 'none',
          duration: 2000
        })
        return
      } else if (this.originPassword === this.newPassword) {
        wx.showToast({
          title: '新密码不能与原始密码相同',
          icon: 'none',
          duration: 1000
        })
        return
      } else if (this.newPassword.length < 6) {
        wx.showToast({
          title: '密码强度不够，密码长度至少为6位',
          icon: 'none',
          duration: 1000
        })
        return
      }
      console.log('In reset password!')
      console.log(this.myInfo.userID)
      console.log(this.originPassword)
      this.$WXRequest.post({
        url: '/passwordcheck/',
        data: {
          username: this.myInfo.userID,
          password_digest: md5(this.originPassword)
        }
      }).then(res => {
        console.log(res)
        if (res.repCode === 200) {
          console.log('原始密码正确！')
          let id = wx.store.state.user.userId
          this.$WXRequest.put({
            url: '/users/' + id + '/',
            data: {
              password_digest: md5(this.newPassword)
            }
          }).then(res => {
            this.handleResolve()
          })
        } else {
          wx.showToast({
            title: '原始密码错误',
            icon: 'none',
            duration: 1000
          })
        }
      })
    },
    handleResolve () {
      wx.showToast({
        title: '修改成功',
        duration: 600
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 600)
    },
    handleReject (error) {
      wx.showToast({ title: error.message, icon: 'none' })
    }
  }
}
</script>

<style lang="stylus" scoped>
.update-profile-wrapper
  height 100vh
  padding 12px
  .input
    padding 12px
    border-bottom 1px solid $light-background
  .input-focus
    border-bottom 1px solid $primary
  button
    margin-top 24px
    color $white
    background-color $primary
</style>