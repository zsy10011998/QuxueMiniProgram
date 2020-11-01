<template>
  <view>
    <view style="background-color: ghostwhite">
      <view class='top'>
        <view :wx:for="['周一','周二','周三','周四','周五','周六','周日']" class="top-text">{{item}}</view>
      </view>
    </view>
    <scroll-view scroll-y="true" class="scroll">
      <view style="height:1450rpx;width:730rpx;display:flex;">
        <view style="color:#8e968c">
          <view :wx:for="[1,2,3,4,5,6,7,8,9,10,11,12,13,14]" class="left">{{item}}</view>
        </view>
        <view :wx:for="[1,2,3,4,5,6,7,8,9,11,12,13,14]">
          <view :style="{width: '750rpx', 'margin-top': (index+1)*100 +'rpx', position: 'absolute', 
            'border-bottom-style': 'solid',
            'border-bottom-width': (index)%3 == 1?'0.7px':'0.5px',
            'border-bottom-color': '#C0C0C0',
            }">
          </view>
        </view>
        <!--课s表-->        
        <view v-for="(lesson, index) in lessons" wx:key="id">
          <view class="flex-item kcb-item" id='0' data-statu="open" :data-index="index" 
            :style="{'margin-left': (lesson.weekDay-1)*100+'rpx', 
            'margin-top': (lesson.time-1)*100+'rpx', 
            height:  lesson.skcd * 100 + 'rpx',
            'background-color': colors[index%7]}"
            @click='showDetail(lesson.detail)'>
          <!-- weekDay代表星期几上课，time是上课时间，skcd上课长度，information课程名 ,detail课程具体信息-->
            <view class="smalltext" 
              :style="{'display': '-webkit-box',
              '-webkit-box-orient': 'vertical',
              '-webkit-line-clamp': lesson.skcd > 2? 8:6,
              'overflow':'hidden'}">
              {{lesson.information}}</view>
          </view>
        </view>
        <!-- <i-button @click="refresh()" style="margin-top:1200rpx;margin-left:auto;margin-right:auto" 
          type="success" size="small" shape="circle" >刷新课表</i-button> -->
        <!-- <button @click="refresh()" style="margin-top:1200rpx;margin-left:auto;margin-right:auto" >刷新课表</button> -->
      </view>
    </scroll-view>
  </view>
</template>

<!--<script>
export default {
  data () {
    return {
      lessons: [
        {weekDay: 1, time: 1, information: '计算机工程中最优化的方法\n冷 彪[1-17]周(一)201 第1，2节', skcd: 2},
        {weekDay: 3, time: 1, information: '数据库系统原理\n郎 波[1-13]周(一)304 第1，2节', skcd: 2},
        {weekDay: 4, time: 1, information: 'MATLAB基础及其应用\n张永飞[1-13]周主南305 第1，2节', skcd: 2},
        {weekDay: 5, time: 1, information: '信号处理与信息推断\n刘雪峰[1-17]周(一)204 第1，2节', skcd: 2},
        {weekDay: 7, time: 1, information: '芭蕾艺术鉴赏\n李爱华[6-13]周 第1，2节', skcd: 2},
        {weekDay: 2, time: 3, information: '编译技术\n史晓华[2]周\n主M302 第3，4，5节，史晓华[3-17]周\n机房 第3，4，5节，杨海燕[2]周\n主M302 第3，4，5节，杨海燕[3-17]周\n机房 第3，4，5节', skcd: 3},
        {weekDay: 3, time: 3, information: '具体数学\n赵启阳[1-13]周(一)301 第3，4节', skcd: 3},
        {weekDay: 4, time: 3, information: '编译技术\n史晓华[1-13]周E207 第3，4节', skcd: 3},
        {weekDay: 5, time: 3, information: '数据库系统原理\n郎 波[1-13]周(一)304 第3，4节', skcd: 3},
        {weekDay: 7, time: 3, information: '芭蕾艺术鉴赏\n李爱华[6-13]周 第3，4节', skcd: 3},
        {weekDay: 1, time: 6, information: '算法设计与分析\n童咏昕[1-17]周主南210 第6，7节', skcd: 2},
        {weekDay: 2, time: 6, information: '编译技术\n史晓华[1-13]周E207 第6，7节', skcd: 2},
        {weekDay: 5, time: 6, information: '体育（5）(散打1)\n张立臣[1-17]周 第6节', skcd: 2},
        {weekDay: 1, time: 8, information: '数学建模入门\n郑 锦[1-13]周(一)212 第8，9节', skcd: 3},
        {weekDay: 2, time: 8, information: 'MATLAB 应用\n杨继平[10-14]周（五）203 第8，9，10节\nMATLAB 应用\n杨继平[15]周（五）203 第8，9节', skcd: 3},
        {weekDay: 4, time: 8, information: 'MATLAB 应用\n杨继平[10-14]周（五）203 第8，9，10节', skcd: 3},
        {weekDay: 5, time: 8, information: '诗歌与中国文化\n罗 旻[3-17]周（五）303 第8，9节', skcd: 3},
        {weekDay: 7, time: 13, information: '探索心理学的奥秘\n智慧树[6-14]周 第13，14节', skcd: 2}],
      setUp: true,
      colors: ['#ff7772', '#99CC33', '#6ca6ff', '#deb887', '#dda0dd', '#ff8c00', '#708090']
    }
  },
  methods: {
    showDetail (information) {
      wx.showModal({  
        title: '课程详细信息',  
        content: information,  
        success: function(res) {  
          if (res.confirm) {  
            console.log('用户点击确定')  
          } else if (res.cancel) {  
            console.log('用户点击取消')  
          }  
        }  
      })
    }
  }
}
</script>-->

<script>
export default {
  data () {
    return {
      lessons: [],
      setUp: true,
      colors: ['#ff7772', '#99CC33', '#6ca6ff', '#deb887', '#dda0dd', '#ff8c00', '#708090']
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
    },
    showDetail (detail) {
      wx.showModal({  
        title: '课程详细信息',  
        content: detail  
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
  color:rgb(28, 133, 185);
  background-color:ghostwhite;
}
.top-text{
  width: 100rpx;
  height: 100rpx;
  font-size: 9pt;
  font-weight: bold;
  justify-content: center;
  display: flex;
  align-items: center;
}
.left{
  width: 35rpx;
  height: 100rpx;
  font-size: 10pt;
  font-weight: bold;
  color:rgb(28, 133, 185);
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
  padding-left: 4px;
}

.scroll {
  height: 1120rpx;
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