<template>
  <view class="main-container">
    <!-- <view class="header">
      <i-avatar slot="footer"
                i-class="avatar"
                shape="square"
                :src="avatarUrl || '/static/images/avatar.png'" />
    </view>-->

    <h1 class="menu-title">课程工具</h1>
    <view class="function-card-list">
      <entry picSrc="/static/utils/work.png"
             entryName="分组管理"
             entryText="道同气合志相感，虽旷百世如同僚。"
             @click="openGroup()" />
      <entry picSrc="/static/utils/grade.png"
             entryName="成绩查询"
             entryText="春风得意马蹄疾，一日看尽长安花。"
             @click="openScoreQuery()" />
      <entry picSrc="/static/utils/schedule.png"
             entryName="我的讨论课"
             entryText="教育开始的方向，将决定一个人未来的生活。"
             @click="openDiscussCourse()" />
      <!-- <entry picSrc="/static/utils/file.png"
             entryName="自动评分"
             entryText="结果仅供参考，实际得分以助教评判为准。"
             @click="openScoreJudge()" /> -->

    </view>
    <h1 class="menu-title">应用功能</h1>
    <view class="function-card-list">
      <entry picSrc="/static/utils/customer-service.png"
             entryName="吐槽区"
             entryText="虽无丝竹管弦之盛，一觞一咏，亦足以畅叙幽情。"
             label="Robot"
             @click="openBot()" />
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
    openGroup () {
      wx.navigateTo({ url: '../functions/pages/group/main' })
    },
    openScoreQuery () {
      wx.navigateTo({ url: '../functions/pages/score-query/main' })
    },
    openCourseSchedule () {
      wx.navigateTo({ url: '../functions/pages/course-schedule/main' })
    },
    openDiscussCourse () {
      wx.navigateTo({ url: '../functions/pages/discuss-course/main' })
    },
    openScoreJudge () {
      wx.navigateTo({ url: '../uploadfile/main' })
    }
  }
}
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  position: absolute;
  background-image: url(https://cs.zhouyc.cc/images/homeEvaluate.png);
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: 100%;
  background-attachment: fixed;
}
.menu-title {
  color: rgb(28, 133, 185);
  letter-spacing: 1px;
  font-size: 30rpx;
  font-weight: bolder;
  margin: 30rpx 0 30rpx 10rpx;
}
.function-card-list {
  box-sizing: border-box;
  width: 100vw;
  padding: 0 15px;
}
</style>