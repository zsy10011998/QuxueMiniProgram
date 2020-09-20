<template>
  <i-panel>
    <view class="header">
      <i-avatar slot="footer"
                i-class="avatar"
                shape="square"
                :src="avatarUrl || '/static/images/avatar.png'" />
    </view>

    <!-- First Row start -->
    <view class="self-row">
      <view class="self-row-item"
            @click="openBot()">
        <view class="center">
          <i-icon type="customerservice"
                  size="40" />
        </view>
        <view class="self-card">
          <view class="self-card-header">聊天机器人</view>
          <view class="self-card-content">
            天上清光留此夕
            <br />人间和气阁春阴
          </view>
        </view>
      </view>
      <view class="self-row-item">
        <view class="center">
          <i-icon type="editor"
                  size="40" />
        </view>
        <view class="self-card"
              @click="openCourse()">
          <view class="self-card-header">课程表</view>
          <view class="self-card-content">
            课程表可以下拉刷新或在个人资料界面刷新哦~
          </view>
        </view>
      </view>
    </view>
    <!-- First Row end -->
    <!-- Second Row start -->
    <view class="self-row">
      <view class="self-row-item"
            @click="openGroup()">
        <view class="center">
          <i-icon type="createtask"
                  size="40" />
        </view>
        <view class="self-card">
          <view class="self-card-header">报名分组</view>
          <view class="self-card-content">
            报名分组
          </view>
        </view>
      </view>
      <view class="self-row-item">
        <!-- 当某一行只有一个card时，加上这个空元素作为 placeholder -->
      </view>
    </view>
    <!-- Second Row end -->
    <!-- <i-col span="12">
        <view class="center">
          <i-icon type="editor" size="40" />
        </view>
        <i-card title="知识分享" @click="openModule()">
          <view slot="content" class="text">
            正是江南好风景
            <br />落花时节又逢君
          </view>
        </i-card>
      </i-col> -->
    <!-- <i-row> -->
    <!-- <i-col span="12">
        <view class="center">
          <i-icon type="video" size="40" />
        </view>
        <i-card title="视频" @click="openvideolist()">
          <view slot="content" class="text">点击查看学习视频</view>
        </i-card>
      </i-col> -->
    <!-- <i-col span="12">
        <view class="center">
          <i-icon type="createtask"
                  size="40" />
        </view>
        <i-card title="报名分组"
                @click="openGroup()">
          <view slot="content"
                class="text">报名分组</view>
        </i-card>
      </i-col>
    </i-row> -->
    <!-- <i-row> -->
    <!-- <i-col span="12" > -->
    <!-- <view class="center" > -->
    <!-- <i-icon type="customerservice" size=40 /> -->
    <!-- </view> -->
    <!-- <i-card title="聊天机器人"> -->
    <!-- <view slot="content" class="text">快来调戏小趣吧~</view> -->
    <!-- </i-card> -->
    <!-- </i-col> -->
    <!-- </i-row> -->
  </i-panel>
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

<style lang="stylus" scoped>
.header
  text-align center
  margin 45px auto 25px
  >>> .avatar
    width 100px
    height 100px
    border-radius 3px
    margin 0 auto 20px
.center
  text-align center
.text
  color #80848f
  font-size 15px
.item-col
  color red
.self-row
  display flex
  flex-wrap wrap
  justify-content center
  margin-bottom 30rpx
  >>> .self-row-item
    width 50%
    flex 1
    display flex
    flex-flow column
.self-card
  display flex
  flex-flow column
  margin 0 16rpx
  padding 0 10rpx
  background-color #ffffff
  flex 1
  border-radius 10rpx
  border 1rpx solid #dddee1
  >>> .self-card-header
    font-size 28rpx
    padding 0 16rpx
    line-height 60rpx
    border-bottom 1rpx #eee solid
  >>> .self-card-content
    color #80848f
    font-size 30rpx
    padding 16rpx
    padding-bottom 36rpx
</style>