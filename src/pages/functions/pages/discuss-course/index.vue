<template>
  <div class="main-container">
    <div class="information">
      <h1 class="menu-title">课程信息
      </h1>
      <div>
        <div class="title">课程教室</div>
        <div class="value">主M301</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { showToast, showModal } from '../../../../utils/wx-components'

import { GetSelfDiscussCourseInfoAPI } from './api'

export default {
  data () {
    return {
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
        console.log(res)
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
  background-image: url('https://cs.zhouyc.cc/images/homeProbe.png');
  background-position: center 80%;
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
.information {
  margin: 60rpx 40rpx
  padding: 30rpx
  background: rgba(255, 255, 255, 0.8); 
}

.title {
  float: left;
  width: 40%;
  text-align: right;
}
.value {
  float: left;
  width: 60%;
}
</style>
