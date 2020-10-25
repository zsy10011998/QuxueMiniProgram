<template>
  <div class="main-container">
    <div class="banner" v-if="invitations.length">您有{{invitations.length}}条分组邀请</div>
    <div class="member-list">
      <i-swipeout v-for="(item, index) in invitations" :operateWidth="60" :key="index">
        <div class="member-card" slot="content">
          <!-- <div class="image-container">
            <image v-if="item.avatarUrl" :src="item.avatarUrl" />
            <image v-else src="/static/images/avatar.png" />
          </div> -->
          <div class="text-container">
            <div class="student-name">
              <span>{{ item.captainName }}</span>
            </div>
            <div class="student-id">{{ item.captainNo }}</div>
          </div>
        </div>
        <view slot="button" class="i-swipeout-demo-button-group">
            <view class="i-swipeout-demo-button delete-button">删除</view>
        </view>
      </i-swipeout>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { GetInvitation } from '../api'

export default {
  data () {
    return {
      invitations: []
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
    const param = {openid: this.openid}
    GetInvitation(param).then(res => {
      const invitations = res.invitedinf
      this.$set(this, 'invitations', invitations)
    })
  },
  methods: {}
}
</script>

<style lang="stylus" scoped>
.main-container {
  width: 100vw;
  min-height: 100vh;
  position: absolute;
  background-image: url('https://cs.zhouyc.cc/images/homeProbe.png'); // cs.zhouyc.cc/images/homeProbe.png);
  background-position: center 80%;
  background-repeat: no-repeat;
  background-size: 100%;
  background-attachment: fixed;
}

button {
  width: 60vw;
  background-color: $theme-blue;
  color: white;
  font-size: 16px;
  margin: 20px auto;
}

.clicked {
  background-color: $dark-blue;
}

.content {
  margin: 20px 20px;
}

.member-list {
  box-sizing: border-box;
  width: 100%;
  padding: 25rpx;
}

.member-list .member-card {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  float: left;
  padding: 0 10rpx;
  display: flex;
  flex-direction: row;
  background: rgba(255, 255, 255, 0.8);
}

.image-container {
  height: 120rpx;
  width: 120rpx;
  border-radius: 50%;
  overflow: hidden;

  >>>image {
    width: 100%;
    height: 100%;
  }
}

.text-container {
  max-width: 400rpx;
  padding-left: 20rpx;
}

.student-name {
  font-weight: bold;
  font-size: 36rpx;
  position: relative;
}

.student-id {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #555;
}

.status-icon {
  font-weight: normal;
  font-size: 20rpx;
  margin-left: 24rpx;
  display: inline-block;
  bottom: 6rpx;
  position: relative;
  padding: 2rpx 8rpx;
  border: 2rpx #555 solid;
  border-radius: 6rpx;
  display: none;
}

.status-icon.leader {
  display: unset !important;
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;

  &::before {
    content: '组长';
  }
}

.status-icon.member {
  display: unset !important;
  color: #1890ff;
  background: #e6f7ff;
  border-color: #91d5ff;

  &::before {
    content: '成员';
  }
}

.status-icon.invited {
  display: unset !important;
  color: #faad14;
  background: #fffbe6;
  border-color: #ffe58f;

  &::before {
    content: '邀请中';
  }
}

.delete-button {
  background: red;
  color: #ffffff;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner {
  font-size: 24rpx;
  color: #fa541c;
  background-color: #fff2e8;
  text-align: center;
  padding: 8rpx;
  margin: 10rpx;
  border: 2rpx solid #ffbb96;
  border-radius: 14rpx;
}
</style>
