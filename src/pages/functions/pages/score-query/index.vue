<template>
  <view class="main-container">
    <view v-for="(assessment, index) in assessments" wx:key="id">
        <view class="function-card" hover-class="hover">
            <view class="order-container">
                <view class="order-icon">{{assessment.order}}</view>
            </view>
            <view class="content">
                <view class="score">{{assessment.score}}分</view>
                <view class="percent">Wow! {{assessment.percent}} Defeated!</view>
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
    })
  },

  onShow: function () {
    this.loadAllScores ()
  },

  methods: {
    loadAllScores () {
      let id = wx.store.state.user.userId
      this.$WXRequest.get({
        url: '/scores/' + id + '/',
        data: {
        }
      }).then(res => {
        if (res.repCode === 200) {
          this.$set(this, 'assessments', res.data.assessments)
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 1500
          })
        }
      })
        // var that=this
        // wx.request({
        //   url: 'https://run.mocky.io/v3/6cc138e0-7076-4477-8934-24e83f158041',
        //   data: {},
        //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //   // header: {}, // 设置请求的 header
        //   success: function(res){
        //     console.log(that)
        //     console.log(res)
        //     //that.$set(that, 'assessments', res.data.assessments)                  //这样子可以渲染出来
        //     that.assessments = res.data.assessments
        //     //console.log(that.assessments)
        //   },
        //   fail: function() {
        //     // fail
        //   },
        //   complete: function() {
        //     // complete
        //   }
        // })
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
  .function-card>.content>.percent {
    font-size: 28rpx;
    font-weight: bold;
    color: #666;
    line-height: 1.6;
    position: absolute;
    top: 75rpx;
  }
</style>