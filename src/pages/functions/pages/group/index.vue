<template>
  <div>
    <button hover-class="clicked"
            class="login-button"
            v-if="hasGroup===false"
            @click="create">创建分组</button>
    <button hover-class="clickedcheck"
            class="login-button"
            v-if="hasGroup==true"
            @click="check">查看分组</button>
    <button hover-class="clicked"
            class="login-button"
            v-if="isInvited==true"
            @click="invite">分组邀请</button>

  </div>

</template>

<script>
import { mapState } from 'vuex'
import { GetSelfGroupInfoAPI, CreateGroupAPI, GetInvitationAPI } from './api'

export default {
  data () {
    return {
      hasGroup: '',
      isInvited: '',
      groupNo: ''
    }
  },
  computed: {
    ...mapState({
      openid: state => state.student.openid,
      name: state => state.student.name,
      studentNo: state => state.student.studentNo
    })
  },
  beforeMount () {
    const param = {openid: this.openid}
    const promiseSelfInfo = GetSelfGroupInfoAPI(param).then(res => {
      this.$set(this, 'hasGroup', res.hasGroup)
    })
    const promiseGroupInfo = GetInvitationAPI(param).then(res => {
      const invitations = res.invitedinf
      if (invitations && invitations.length) {
        this.$set(this, 'isInvited', true)
      }
    })

    Promise.all([promiseSelfInfo, promiseGroupInfo]).then(() => {
      if (this.hasGroup) {
        this.check()
      } else if (this.isInvited) {
        this.invite()
      }
    })
  },
  methods: {
    create () {
      CreateGroupAPI({openid: this.openid}).then(res => {
        if (res.repCode === 200) {
          wx.showToast({
            title: '创建分组成功',
            duration: 1500,
            icon: 'none'
          }).then(res => {
            this.$set(this, 'hasGroup', true)
            wx.redirectTo({ url: '../group/groupmembers/main' })
          }
          )
        } else if (res.repCode === 700) {
          wx.showToast({
            title: res.errMsg,
            duration: 1500,
            icon: 'none'
          })
        }
      })
    },
    check () {
      wx.redirectTo({ url: '../group/groupmembers/main' })
    },
    invite () {
      wx.redirectTo({ url: '../group/invitations/main' })
    },
    showinf (msg) {
      wx.showToast({
        title: msg,
        duration: 1500,
        icon: 'none'
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
button
  width 60vw
  background-color $theme-blue
  color white
  font-size 20px
  margin 50px auto
  padding 30px auto
  // &::before
  // width 20px
  // height 20px
  // margin 0 6px 2px 0
.clicked
  background-color $dark-blue
</style>
