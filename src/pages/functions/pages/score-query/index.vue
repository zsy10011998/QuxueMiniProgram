<template>
  <view class="main-container">
    <view v-for="(assessment, index) in assessments" :key=index>
        <view class="function-card" hover-class="hover">
            <view class="order-container">
                <view class="order-icon">{{assessment.time}}</view>
            </view>
            <view class="content">

                <view v-if="assessment.pureNum" class="score">{{assessment.grade}}分</view>
                <view v-else class="score-lost">{{assessment.grade}}</view>

                <view class="percent">Theme About: {{assessment.theme}}</view>
            </view>
        </view>
    </view>
  </view>
</template>


<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      assessments: [
            ]
        }
    },

  computed: {
    ...mapState({
      openid: state => state.student.openid,
      studentNo: state => state.student.studentNo
    })
  },

  onShow: function () {
    this.loadAllScores ()
  },

  methods: {
    loadAllScores () {
      let id = wx.store.state.user.studentNo
      this.$WXRequest.post({
        url: '/getGrades/' ,
        data: {
          studentNo:this.studentNo
        }
      }).then(data => {
        this.$set(this,'assessments',data)
        this.assessments.forEach((item, index) => {
          item.pureNum = this.isNum(item.grade)
        })
      })
    },

    isNum (str) {
      var numReg = /^[0-9]*$/
      var numRe = new RegExp(numReg)
      if (numRe.test(str)) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>
  .main-container {
    min-height: 100vh;
    background-image: url(https://cs.zhouyc.cc/images/homeEvaluate.png);
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: 100%;
    background-attachment: fixed;
  }
  .function-card {
    padding: 36rpx 15rpx;
    margin: 30rpx 0;
    display: flex;
    position: relative;
    background-color: rgba(246, 247, 251, 0.8);
    box-shadow: rgb(225, 227, 230) 0rpx 0rpx 10rpx 5rpx;
    transition: box-shadow 0.5s, background-color 0.5s;
  }

    .function-card.hover {
        box-shadow: rgb(225, 227, 230) 0rpx 0rpx 20rpx 10rpx;
        background-color: rgba(246, 247, 251);
    }
    .function-card .order-container {
    width: 120rpx;
    height: 120rpx;
    background: #bbdced;
    border-radius: 50%;
    position: relative;
  }
  .function-card .order-container>.order-icon {
    height: 70rpx;
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    font-size: 54rpx;
    display: block;
    padding-bottom: 24rpx;
    font-family: "Microsoft YaHei";
    font-weight: bolder;
    box-sizing: border-box;
    color: white;
  }
  .function-card>.content {
    width: 500rpx;
    padding-left: 32rpx;
    box-sizing: border-box;
  }
  .function-card>.content>.score {
    font-size: 58rpx;
    color: #666;
    line-height: 1.6;
    height: 50rpx;
    position: absolute;
    right: 36rpx;
    top: 48rpx;
  }
  .function-card>.content>.score-lost {
    font-size: 58rpx;
    color:lightgray;
    line-height: 1.6;
    height: 50rpx;
    position: absolute;
    right: 36rpx;
    top: 48rpx;
  }
  .function-card>.content>.percent {
    font-size: 28rpx;
    font-weight: bold;
    color: #666;
    line-height: 1.6;
    position: absolute;
    top: 75rpx;
  }
</style>