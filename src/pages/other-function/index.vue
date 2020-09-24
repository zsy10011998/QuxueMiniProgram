<template>
  <view class="main-container">
    <!-- <view class="header">
      <i-avatar slot="footer"
                i-class="avatar"
                shape="square"
                :src="avatarUrl || '/static/images/avatar.png'" />
    </view>-->
    <h1 class="menu-title">应用功能</h1>
    <entry picSrc="/static/utils/customer-service.png"
           entryName="聊天机器人"
           entryText="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
           stateSrc="/static/images/featured.png"
           @click="openBot()"
           />

    <h1 class="menu-title">课程工具</h1>
    <entry picSrc="/static/utils/work.png"
           entryName="分组管理"
           entryText="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
           stateSrc="/static/images/coming.png"
           @click="openGroup()"
           />
  </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {}
  },
  beforeMount: function () {
    this.$WXRequest.post({
      url: '/getInformation/',
      data: {
        openid: this.openid
      }
    }).then((res) => {
      console.log(this.name)
      if (res.name !== this.name) {
        wx.store.commit('setName', res.name)
      }
      if (res.studentNo !== this.studentNo) {
        wx.store.commit('setStudentNo', res.studentNo)
      }
      console.log(this.name)
    })
  },
  computed: {
    ...mapState({
      openid: state => state.student.openid,
      name: state => state.student.name,
      studentNo: state => state.student.studentNo,
      myInfo: state => state.user.myInfo,
      avatarUrl: state => state.student.avatarUrl
    })
  },
  methods: {
    calendar () {
      console.log('in calendar')
      wx.navigateTo({ url: '../calendar/main' })
    },
    openModule () {
      wx.navigateTo({ url: '../functions/pages/module-index/main' })
    },
    openCourse () {
      wx.navigateTo({ url: '../functions/pages/course-schedule/main' })
    },
    openBot () {
      wx.navigateTo({ url: '../functions/pages/chatterbot/main' })
    },
    openvideolist () {
      console.log('videlList')
      wx.navigateTo({ url: '../functions/pages/videos/main' })
    },
    openGroup () {
      wx.navigateTo({ url: '../functions/pages/group/main' })
    }
  }
}
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  position: absolute;
}
.menu-title {
  color: rgb(28, 133, 185);
  letter-spacing: 1px;
  font-size: 30rpx;
  font-weight: bolder;
  margin: 30rpx 0 30rpx 10rpx;
}
</style>