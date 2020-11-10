<template>
  <div class="main-container">
    <div class="information">
      <h1 class="menu-title">课程信息
      </h1>
      <div class="item">
        <div class="title">课程教室</div>
        <div class="value">{{classroom}}</div>
      </div>
      <div class="item">
        <div class="title">讨论课时间</div>
        <div class="value">{{classTime}}</div>
      </div>
      <div class="item">
        <div class="title">授课教师</div>
        <div class="value">{{teacher}}</div>
      </div>
      <div class="item">
        <div class="title">课程助教</div>
        <div class="value">{{assistant}}</div>
      </div>
      <div class="item">
        <div class="title">小组编号</div>
        <div class="value">{{groupNo}}</div>
      </div>
      <h1 class="menu-title">当前选题
      </h1>
      <div class="item" style="text-align: center">
        {{myTopic}}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { showToast, showModal } from '../../../../utils/wx-components'
import { TIMESPAN_MAP } from '../group/const'

import { GetSelfDiscussCourseInfoAPI } from './api'

export default {
  data () {
    return {
      classroom: '',
      classTime: '',
      teacher: '',
      assistant: '',
      groupNo: '',
      myTopic: ''
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
    this.getDiscussCourseInfo()
  },
  methods: {
    getDiscussCourseInfo () {
      const { openid } = this
      const param = { openid }
      GetSelfDiscussCourseInfoAPI(param).then(res => {
        const { classroom, classTime, teacher, assistant, groupNo, myTopic } = res
        this.$set(this, 'classroom', classroom)
        this.$set(this, 'classTime', TIMESPAN_MAP[classTime])
        this.$set(this, 'teacher', teacher)
        this.$set(this, 'assistant', assistant)
        this.$set(this, 'groupNo', groupNo)
        this.$set(this, 'myTopic', myTopic)
      })
    }
  }

}
</script>

<style lang="stylus" scoped>
.main-container {
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  background-image: url('https://cs.zhouyc.cc/images/discussion.png');
  background-position: center 120%;
  background-repeat: no-repeat;
  background-size: 100%;
  background-attachment: fixed;
}

.menu-title {
  color: #1c85b9;
  letter-spacing: 3rpx;
  font-size: 40rpx;
  font-weight: bolder;
  margin: 30rpx 0 30rpx 10rpx;
  float: left;
}

.information {
  margin: 60rpx 40rpx;
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.8);
  float: left;
}

.item {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  float: left;
  position: relative;
  width: 100%;
}

.title {
  float: left;
  width: 40%;
  text-align: right;
  box-sizing: border-box;
  padding-right: 20rpx;
}

.value {
  float: left;
  width: 60%;
  box-sizing: border-box;
  padding-left: 20rpx;
  color: #888;
}
</style>
