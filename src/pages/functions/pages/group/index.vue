<template>
  <div>
    <!-- <div class="user-id">学号：{{$store.state.studentNo}}</div> -->
    <i-panel i-class="login-table">
      <i-input type="text"
               v-model="groupinformation.studentNo"
               title="学号"
               :placeholder="studentNo"
               maxlength="20"
               i-class="input"
               disabled=true
               @change="updatestudetNo" />
      <i-input type="text"
               v-model="groupinformation.information1"
               title="信息1"
               placeholder="请输入信息1"
               maxlength="20"
               i-class="input"
               @change="updateUsername" />

      <i-input type="text"
               v-model="groupinformation.information2"
               title="信息2"
               placeholder="请输入信息2"
               maxlength="20"
               i-class="input"
               @change="updatePassword" />
    </i-panel>
    <button hover-class="clicked"
            class="login-button"
            @click="login">提交</button>
  </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      groupinformation: {
        studentNo: '',
        information1: '',
        information2: ''

      }
    }
  },
  computed: {
    ...mapState({
      myInfo: state => state.user.myInfo,
      studentNo: state => state.user.studentNo
    })
  },
  mounted () {
    this.studentNo = wx.store.state.user.studentNo
    this.groupinformation.studentNo = wx.store.state.user.studentNo
  },
  methods: {
    updateUsername (event) {
      let title = event.mp.detail.detail.value
      this.$set(this.groupinformation, 'information1', title)
    },
    updatePassword (event) {
      let title = event.mp.detail.detail.value
      this.$set(this.groupinformation, 'information2', title)
      console.log(this.groupinformation)
    },
    login () {
      console.log(this.groupinformation)
      this.$WXRequest.post({
        url: '/groupinf/',
        data: {
          studentNo: this.groupinformation.studentNo,
          groupinformation: this.groupinformation
        }
      }).then(res => {
        if (res.repCode === 700) {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 1500
          })
        }
        // if (res.repCode === 200 || res.repCode === 300) {
        // } else {
        //   wx.switchTab({ url: '../../../other-function/main' })
        //   wx.showToast({
        //     title: res.errMsg,
        //     icon: 'none',
        //     duration: 1500
        //   })
        // }
      })
    }
  }

}
</script>

<style lang="stylus" scoped>
.blo
  padding 10rpx
.title1
  font-size 50rpx
  height 80rpx
  font-weight 500
.title2
  font-size 35rpx
  padding 10rpx
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
