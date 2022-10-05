<!--
<template>
  <view class="main-container">
    <h1 class="menu-title">
      分组功能未开启，请耐心等待~~
    </h1>
  </view>
</template>
-->

<template>
  <div>
    <loop-banner
      :texts="allowTimeBanner"
      :v-if="allowTimeBanner.length"
      :theme="timeAvailable ? 'blue': ''"
      :hidable="false"
    />
    
    <view>
      <h1 class="menu-title" style="display: inline-block; font-size: 32rpx;">我登记的时段:</h1>
      <span v-for="timespan in myTimes" :key="timespan" style="display: inline-block">
        <color-tag
          :text="timespanMap[timespan]"
          theme="purple"
          fontSize="28rpx"
        />
      </span>
    </view>
    <button hover-class="clicked"
            class="login-button"
            v-if="hasGroup===false"
            @click="create()">创建分组</button>
    <button hover-class="clickedcheck"
            class="login-button"
            v-if="hasGroup===true"
            @click="check">查看分组</button>
    <button hover-class="clicked"
            class="login-button"
            :class="hasInvitation ? 'red-dot' : ''"
            @click="invite">分组邀请</button>

  </div>

</template>


<script>
import { mapState } from 'vuex'
import { showToast, showModal } from '../../../../utils/wx-components'
import { GetSelfGroupInfoAPI, CreateGroupAPI, GetInvitationAPI } from './api'
import { TIMESPAN_MAP, TIMESPAN_SHORT_MAP } from './const'

export default {
  data () {
    return {
      hasGroup: '',
      groupNo: '',
      allowTime: null,
      myTimes: [],
      allowTimeBanner: [],
      timeAvailable: true,
      timespanMap: TIMESPAN_SHORT_MAP,
      hasInvitation: false
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
    GetSelfGroupInfoAPI(param).then(res => {
      const { hasGroup, allowTime, myTimes, groupNo } = res
      this.$set(this, 'hasGroup', hasGroup)
      this.$set(this, 'groupNo', groupNo)
      this.$set(this, 'allowTime', allowTime)
      this.$set(this, 'myTimes', myTimes)
      this.$set(this, 'timeAvailable', allowTime && myTimes.indexOf(allowTime) >= 0)
      this.$set(this, 'allowTimeBanner', [`当前分组环节所属课时: ${TIMESPAN_MAP[allowTime]}`])
    })
    GetInvitationAPI(param).then(res => {
      console.log(res, res.invitedinf)
      if (res.invitedinf && res.invitedinf.length) {
        this.$set(this, 'hasInvitation', true)
      }
    })
  },
  methods: {
    create () {
      const param = {openid: this.openid}
      showModal('是否创建分组', '成为组长后将不能被邀请, 且现有邀请会清空', () => {
        CreateGroupAPI(param).then(res => {
          wx.showToast('创建分组成功').then(res => {
            this.$set(this, 'hasGroup', true)
            wx.redirectTo({ url: '../group/groupmembers/main' })
          })
        }).catch(res => {
          showToast(res.errMsg)
        })
      })
    },
    check () {
      wx.redirectTo({ url: '../group/groupmembers/main' })
    },
    invite () {
      const param = {openid: this.openid}
      const promiseGroupInfo = GetInvitationAPI(param).then(res => {
        wx.redirectTo({ url: '../group/invitations/main' })
      }).catch(res => {
        showToast(res.errMsg)
        if (!res.invitedinf || !res.invitedinf.length) {
          this.$set(this, 'hasInvitation', false)
        }
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
.clicked
  background-color $dark-blue 
.menu-title {
  color: rgb(28, 133, 185);
  letter-spacing: 1px;
  font-size: 30rpx;
  font-weight: bolder;
  margin: 30rpx 0 30rpx 10rpx;
}
.red-dot::before {
  content: "";
  position: absolute;
  right: 10%;
  top: 20rpx;
  background: #dc4040;
  border-radius: 50%;
  height: 15rpx;
  width: 15rpx;
}
</style>
