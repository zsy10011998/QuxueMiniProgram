<template>
  <view>
    <view style="background-color: #3cc16e">
      <view class='top'>
        <view :wx:for="['一','二','三','四','五','六','日']" class="top-text">{{item}}</view>
      </view>
    </view>
    <scroll-view scroll-y="true" class="scroll">
      <view style="height:1450rpx;width:730rpx;display:flex;">
        <view style="color:#8e968c">
          <view :wx:for="[1,2,3,4,6,7,8,9,11,12,13,14]" class="left">{{item}}</view>
        </view>
        <view :wx:for="[1,2,3,4,6,7,8,9,11,12,13,14]">
          <view :style="{width: '750rpx', 'margin-top': (index+1)*100 +'rpx', position: 'absolute', 
            'border-bottom': '1rpx solid '+index==4?'red':'lightgray'}">
          </view>
        </view>
        <!--课表-->
        <view :wx:for="lessons" wx:for-item="lesson" wx:for-index="index" wx:key="id">
          <view class="flex-item kcb-item" id='0' data-statu="open" :data-index="index" 
            :style="{'margin-left': (lesson.weekDay-1)*100+'rpx', 
            'margin-top': (lesson.time-1)*200+5+'rpx', 
            height: '195rpx', 
            'background-color': colors[lesson.weekDay%2]}">
          <!-- weekDay代表星期几上课，time是上课时间，skcd上课长度，information课程信息-->
            <view class="smalltext">{{lesson.information}}</view>
          </view>
        </view>
        <!-- <i-button @click="refresh()" style="margin-top:1200rpx;margin-left:auto;margin-right:auto" 
          type="success" size="small" shape="circle" >刷新课表</i-button> -->
        <!-- <button @click="refresh()" style="margin-top:1200rpx;margin-left:auto;margin-right:auto" >刷新课表</button> -->
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      lessons: [],
      setUp: true,
      colors: ['#6ca6ff', '#ff7772']
    }
  },
  onShow: function () {
    this.loadAllLessons()
    if (this.lessons === []) {
      this.refresh()
    }
  },
  methods: {
    loadAllLessons () {
      let id = wx.store.state.user.userId
      console.log('userId=' + id)
      this.$WXRequest.get({
        url: '/get_classes/' + id + '/',
        data: {
        }
      }).then(res => {
        console.log('In couser schedule initial')
        console.log(res)
        if (res.repCode === 200) {
          this.lessons = res.data
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 1500
          })
        }
      })
    },
    refresh () {
      console.log('In refresh')
      let id = wx.store.state.user.userId
      console.log('userId=' + id)
      this.$WXRequest.get({
        url: '/newest_classes/' + id + '/',
        data: {
        }
      }).then(res => {
        console.log('In course schedule refresh')
        console.log(res)
        if (res.repCode === 200) {
          this.lessons = res.data
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 1500
          })
        }
      })
    }
  },
  onPullDownRefresh () {
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 2000
    })
    this.refresh()
    wx.stopPullDownRefresh()
  }
}
</script>

<style scoped>
.top{
  display: flex;
  flex-direction: row;
  margin-left: 35rpx;
  color: white;
  background-color: #3cc16e;
}
.top-text{
  width: 100rpx;
  height: 100rpx;
  font-size: 9pt;
  justify-content: center;
  display: flex;
  align-items: center;
}
.left{
  width: 35rpx;
  height: 100rpx;
  font-size: 10pt;
  justify-content: center;
  display: flex;
  align-items: center;
}
.flex-item {
  width: 95rpx;
  height: 100px;
}

.kcb-item {
  position: absolute;
  justify-content: center;
  display: flex;
  align-items: center;
  border-radius: 5px;
}

.smalltext {
  font-size: 8pt;
  color: #fff;
  padding-left: 2px;
}
.scroll {
  height: 1170rpx;
  z-index: 101;
  position: fixed;
}
.box1 .dateBox{
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  margin-top: 20px;
  font-size: 40rpx;
}

.box1{
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
}

.box1>view{
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 34rpx;
}

.dateOn{
  border-radius: 50%;
  background-color: hotpink;
  color: #fff;
}
.ball {
  box-shadow:2px 2px 10px #AAA;
  border-radius: 20px;
  position: absolute; 
}
.font-color{
  color:#a9a9a9;
}

</style>
