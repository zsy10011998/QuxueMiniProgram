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

    <button :class="{'button-disabled' : disabled}"
            :disabled="disabled"
            @click="handleClick()">确认修改</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

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
      case 'studentNo':
        title = '修改学号'
        this.value = this.studentNo
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