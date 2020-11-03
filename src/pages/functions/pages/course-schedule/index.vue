<template>
  <view v-if="checksyllabus">

    <view style="background-color: ghostwhite">
      <view class='top'>
        <view :wx:for="['周一','周二','周三','周四','周五','周六','周日']" wx:key="key" class="top-text">{{item}}</view>
      </view>
    </view>
    <scroll-view scroll-y="true" class="scroll">
      <view style="height:1400;width:730rpx;display:flex;">
        <view style="color:#8e968c">
          <view :wx:for="[1,2,3,4,5,6,7,8,9,10,11,12,13,14]" wx:key="key" class="left">{{item}}</view>
        </view>
        <view :wx:for="[1,2,3,4,5,6,7,8,9,11,12,13,14]" wx:key="key">
          <view :style="{width: '750rpx', 'margin-top': (index+1)*100 +'rpx', position: 'absolute', 
            'border-bottom-style': 'solid',
            'border-bottom-width': (index)%3 == 1?'0.7px':'0.5px',
            'border-bottom-color': '#C0C0C0',
            }">
          </view>
        </view>
        <!--课s表-->        
        <view v-for="(lesson, index) in lessons" :key=index>
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
        <!-- <i-button @click="refresh()" style="margin-top:1400rpx;margin-left:auto;margin-right:auto;backgroundcolor:gray" 
          type="success" size="big" shape="square" long=true>刷新课表</i-button> -->
      </view>
      <button @click="refresh()" class="syllabus-button">刷新课表</button>
    </scroll-view>
  </view>

  <view v-else class="counter-warp">
    <div class="header">
      <div class="header-content">
        <div class="text">
          <div class="text-header">统一账号登录</div>
          <div class="text-content">请输入你的教务网站北航统一账号和密码，该信息不会被保留记录，仅仅作为课程表的获取使用</div>
        </div>
      </div>
    </div>
    <i-panel i-class="login-table">
      <i-input type="text"
               title="统一账户账号"
               placeholder="请输入你的统一账号"
               maxlength=20
               i-class="input"
               @change='fetchAccount'
                />
      <i-input type="password"
               title="统一账户密码"
               placeholder="请输入你的统一账户密码"
               maxlength=15
               i-class="input"
               @change='fetchPassword'
                />
    </i-panel>
    <button hover-class="clicked"
            class="login-button"
            @click='signUp()'
            >登录</button>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      lessons: [],
      checksyllabus: false,
      getsyllabus: {
        account: '',
        password: ''
      },
      colors: ['#ff7772', '#99CC33', '#6ca6ff', '#deb887', '#dda0dd', '#ff8c00', '#708090']
    }
  },

  computed: {
    ...mapState({
      openid: state => state.student.openid, 
    })
  },

  onShow: function () {
    this.loadAllLessons()
    if (this.lessons === []) {
      this.refresh()
    }
  },

  methods: {
    loadAllLessons () {
      this.$WXRequest.post({
        url: '/lessons/',
        data: {
          openid: this.openid ,
          op: 'checksyllabus'
        }
      }).then(res => {
        if (res.repCode === 200) {
          this.$set(this,'lessons',res.syllabus)
          this.$set(this,'checksyllabus',res.hasSyllabus)
          // console.log(res)
        } else {
          this.checksyllabus = false
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 1500
          })
        }
      })
    },

    refresh () {
      this.$set(this, 'checksyllabus', false)
    },
    
    showDetail (detail) {
      wx.showModal({  
        title: '课程详细信息',  
        content: detail
      })
    },

    signUp () {
        if (!this.getsyllabus.account) {
          wx.showToast({
            title: '请输入用户名',
            icon: 'none',
            duration: 1500
          })
          return
        } else if (!this.getsyllabus.password) {
          wx.showToast({
            title: '请输入密码',
            icon: 'none',
            duration: 1500
          })
          return
        }
        // console.log(this.getsyllabus.account)
        this.$WXRequest.post({
        url: '/lessons/',
        data: {
          openid: this.openid,
          account: this.getsyllabus.account,
          password: this.getsyllabus.password,
          op: 'getsyllabus'
        }
      }).then(res => {
        if (res.repCode === 200) {    
          // wx.store.commit('setAccount', this.account)
          // wx.store.commit('setPassword', this.password)
          wx.showToast({
            title: '请稍后，正在获取课表,将会为您自动跳转',
            icon: 'none',
            duration: 1500
          })
          console.log(res)
          //this.$set(this, checksyllabus , true)
          wx.navigateTo({ url: 'main' })
        } else if (res.repCode === 700) {
          wx.showToast({
            title: '请重新提交',
            icon: 'none',
            duration: 1500
          })
        } else if (res.repCode === 701) {
          wx.showToast({
            title: '账号密码错误',
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: 'nothing',
            icon: 'none',
            duration: 1500
          })
        }
      })
    },

    fetchAccount (event) {
      let account = event.mp.detail.detail.value
      this.$set(this.getsyllabus, 'account', account)
    },
    
    fetchPassword (event) {
      let password = event.mp.detail.detail.value
      this.$set(this.getsyllabus, 'password', password)
    }
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

.syllabus-button{
margin-top:auto;
background-color:#6699ff;
width:750rpx;
color:white;
font-size:16px;
}

.counter-warp{
  height:100%;
  background: white;
  text-align: center;
}
.counter-warp .header{
  padding:30px 40px;
  background-color: #6699ff;
  color:white;
}
.counter-warp .header .header-content{
  display:flex;
  flex-direction:column;
  align-items:center;
}
.counter-warp .header .header-content .text{
  text-align: center;
  padding-left: 8px;
}
.counter-warp .header .header-content .text .text-header{
  font-size: 28px;
  font-family: "YouYuan";
}
.counter-warp .header .header-content .text .text-content{
  padding-top: 8px;
  font-size: 16px;
  font-family: "Microsoft YaHei";
}


.counter-warp .login-table{
  margin: 60px auto 45px
}
.counter-warp .login-table .input{
  text-align: center;
  height: 32px;
  width: 250px;
  background-color: #f8f8f9;
  border: #dddee1;
  border-radius: 8px;
  font-size: 32px;
  border: 1px solid border-base;
  margin-bottom: 8px;
  margin-left: auto;
  margin-right: auto;
}

.counter-warp  .login-button{
  width:80vw;
  background-color:#6699ff;
  color:white;
  font-size:16px;
  margin:10px auto 10px;
}

.counter-warp  .clicked{
  background-color:#6699ff
}
</style>

