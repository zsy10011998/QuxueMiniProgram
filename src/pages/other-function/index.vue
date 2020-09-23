<template>
  <view class="main-container">
    <!-- <view class="header">
      <i-avatar slot="footer"
                i-class="avatar"
                shape="square"
                :src="avatarUrl || '/static/images/avatar.png'" />
    </view>-->

    <h1 class="menu-title">应用功能</h1>
    <view class="function-card-list">

      <view class="function-card" @click="openBot()">
        <view class="image-container">
          <image src="/static/utils/customer-service.png"></image>
        </view>
        <view class="content">
          <h1 class="title">聊天机器人</h1>
          <view class="description">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</view>
        </view>
        <image class="feature-icon" src="/static/images/featured.png" />
      </view>
    </view>

    <h1 class="menu-title">课程工具</h1>
    <view class="function-card-list">
      <view class="function-card" @click="openGroup()">
        <view class="image-container">
          <image src="/static/utils/work.png"></image>
        </view>
        <view class="content">
          <h1 class="title">分组管理</h1>
          <view class="description">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</view>
        </view>
        <image class="feature-icon" src="/static/images/coming.png" />
      </view>
    </view>
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
  /* font-family:  'PingFang SC'; */
}
.function-card-list {
  box-sizing: border-box;
  width: 100vw;
  padding: 0 15px;
}
.function-card {
  padding: 36rpx 15rpx;
  margin: 10rpx 0;
  display: flex;
  position: relative;
  background-color: rgb(246, 247, 251);
}
.function-card:first-of-type {
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  margin-top: 0;
}
.function-card:last-of-type {
  border-bottom-left-radius: 20rpx;
  border-bottom-right-radius: 20rpx;
  margin-bottom: 0;
}
.function-card .image-container {
  width: 120rpx;
  height: 120rpx;
  background: #bbdced;
  border-radius: 50%;
  position: relative;
}
.function-card .image-container>image {
  width: 70rpx;
  height: 70rpx;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
}
.function-card>.content {
  width: 500rpx;
  padding-left: 32rpx;
  box-sizing: border-box;
}
.function-card>.content>.title {
  font-size: 32rpx;
  padding: 12rpx 0;
  font-family: "Microsoft YaHei";
  font-weight: bolder;
  letter-spacing: 0.5px;
}
.function-card>.content>.description {
  font-size: 24rpx;
  color: #666;
}
.function-card .feature-icon {
  width: 180rpx;
  height: 50rpx;
  position: absolute;
  right: 36rpx;
  top: 24rpx;
}
</style>