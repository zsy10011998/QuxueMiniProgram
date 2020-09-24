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
export default {
  data () {
    return {
      // openid: 'oGiID5Wj7iPUhQ1eQGRZAaNc8jHw',
      hasGroup: '',
      isCaptain: '',
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
    console.log(this.openid)
    this.$WXRequest.post({
      url: '/groupinf/',
      data: {
        openid: this.openid,
        op: 'getselfinfo'
      }
    }).then(res => {
      console.log(res)
      this.$set(this, 'hasGroup', res.hasGroup)
      this.$set(this, 'isCaptain', res.isCaptain)
      this.$set(this, 'isInvited', res.isInvited)
    })
  },
  methods: {
    create () {
      this.$WXRequest.post({
        url: '/groupinf/',
        data: {
          openid: this.openid,
          op: 'creategroup'
        }
      }).then(res => {
        if (res.repCode === 200) {
          wx.showToast({
            title: '创建分组成功',
            duration: 1500,
            icon: 'none'
          }).then(res => {
            this.$set(this, 'hasGroup', true)
            this.$set(this, 'isCaptain', true)
            wx.redirectTo({ url: '../groupmembers/main' })
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
      wx.redirectTo({ url: '../groupmembers/main' })
    },
    invite () {
      this.$WXRequest.post({
        url: '/groupinf/',
        data: {
          openid: this.openid,
          op: 'getinvitation'
        }
      }).then(res => {
        console.log(res)
        if (res.repCode === 700) {
          this.showinf(res.errMsg)
        } else {
          wx.showModal({
            title: '邀请',
            content: '是否接受来自' + res.captainMsg + '的加入小组邀请',
            success: (res) => {
              if (res.confirm) {
                this.$WXRequest.post({
                  url: '/groupinf/',
                  data: {
                    openid: this.openid,
                    op: 'allowinvitation'
                  }
                }).then(res => {
                  if (res.repCode === 200) {
                    this.$set(this, 'hasGroup', true)
                    this.$set(this, 'isInvited', false)
                  }
                })
              } else if (res.cancel) {
                this.$WXRequest.post({
                  url: '/groupinf/',
                  data: {
                    openid: this.openid,
                    op: 'rejectinvitation'
                  }
                }).then(res => {
                  if (res.repCode === 200) {
                    this.$set(this, 'isInvited', false)
                  }
                })
              }
            }
          })
        }
      })
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
