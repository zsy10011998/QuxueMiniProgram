<template>
  <div class="main-container">
    <div class="member-list">
      <i-swipeout v-for="(item, index) in membersinf" :operateWidth="isCaptain && item.status !== 'leader' ? 60 : 0" :key="index">
        <div class="member-card" slot="content">
          <div class="image-container">
            <image v-if="item.avatarUrl" :src="item.avatarUrl" />
            <image v-else src="/static/images/avatar.png" />
          </div>
          <div class="text-container">
            <div class="student-name">
              <span>{{ item.name }}</span>
              <span class="status-icon" :class="item.status"></span>
            </div>
            <div class="student-id">{{ item.studentNo }}</div>
          </div>
        </div>
        <view slot="button" class="i-swipeout-demo-button-group">
            <view class="i-swipeout-demo-button delete-button" @click="deleteMember(item)">删除</view>
        </view>
      </i-swipeout>
    </div>

    <i-input
      type="text"
      title="学号"
      placeholder="新成员学号"
      maxlength="20"
      i-class="input"
      @change="updatestudetNo"
      v-if="addblock"
    />

    <!-- 队长操作button：添加 & 解散 & Submit -->
    <div v-if="isCaptain && !addblock">
      <button
        hover-class="clicked"
        class="login-button"
        @click="displayAddBlock"
      >添加新成员</button>

      <button
        hover-class="clicked"
        class="login-button"
        @click="disgroup"
      >解散分组</button>
    </div>
    <!-- 添加组员操作：确认添加 & 取消 -->
    <div v-if="isCaptain && addblock">
      <button
        hover-class="clicked"
        class="login-button"
        @click="addnew">确认添加</button>
      <button
        hover-class="clicked"
        class="login-button"
        @click="hideAddBlock">取消</button>

    </div>
    <button
      hover-class="clicked"
      class="login-button"
      @click="exitgroup"
      v-if="isCaptain==false"
    >退出分组</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      hasGroup: '',
      isCaptain: '',
      isInvited: '',
      groupNo: '',
      membersinf: [],
      studentNo: '',
      addblock: false,
      visible2: true
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
    console.log(this)
    this.$set(this, 'addblock', false)
    this.$WXRequest.post({
      url: '/groupinf/',
      data: {
        openid: this.openid,
        op: 'getselfinfo'
      }
    }).then(res => {
      console.log(res)
      this.$set(this, 'hasGroup', res.hasGroup)
      this.$set(this, 'isCaptain', res.isCaptain)
      this.$set(this, 'isInvited', res.isInvited)
    })
    this.getGroupMembers()
  },
  methods: {
    getGroupMembers () {
      this.$WXRequest.post({
        url: '/groupinf/',
        data: {
          openid: this.openid,
          op: 'getmembersinfo'
        }
      }).then(res => {
        if (res.members) {
          const statusCodeOrder = {
            leader: 3,
            member: 2,
            invited: 1
          }
          const membersSorted = res.members.sort((a, b) => {
            const oa = statusCodeOrder[a.status] || 0
            const ob = statusCodeOrder[b.status] || 0
            return ob - oa
          })
          this.$set(this, 'membersinf', membersSorted)
        }
      })
    },
    displayAddBlock () {
      this.$set(this, 'addblock', true)
    },
    hideAddBlock () {
      this.$set(this, 'studentNo', '')
      this.$set(this, 'addblock', false)
    },
    addnew () {
      if (this.membersinf.length >= 5) {
        wx.showToast({
          title: '最多只能五个成员',
          during: 1500,
          icon: 'none'
        })
        return
      }
      this.$WXRequest.post({
        url: '/groupinf/',
        data: {
          openid: this.openid,
          op: 'addmember',
          studentNo: this.studentNo
        }
      }).then(res => {
        console.log(res)
        if (res.repCode === 200) {
          this.getGroupMembers()
          this.hideAddBlock()
          wx.showToast({
            title: '等待学生确认',
            duration: 1500,
            icon: 'none'
          })
        } else if (res.repCode === 700) {
          wx.showToast({
            title: res.errMsg,
            duration: 1500,
            icon: 'none'
          })
        }
      })
    },
    updatestudetNo (event) {
      let title = event.mp.detail.detail.value
      this.$set(this, 'studentNo', title)
    },
    exitgroup () {
      this.$WXRequest.post({
        url: '/groupinf/',
        data: {
          openid: this.openid,
          op: 'exitgroup'
        }
      }).then(res => {
        if (res.repCode === 200) {
          wx.showToast({
            title: '退出成功',
            during: 1500,
            icon: 'none'
          }).then(
            wx.redirectTo({ url: '../group/main' })
          )
        }
      })
    },
    disgroup () {
      this.$WXRequest.post({
        url: '/groupinf/',
        data: {
          openid: this.openid,
          op: 'disgroup'
        }
      }).then(res => {
        if (res.repCode === 200) {
          wx.showToast({
            title: '解散成功',
            during: 1500,
            icon: 'none'
          }).then(
            wx.redirectTo({ url: '../group/main' })
          )
        }
      })
    },
    deleteMember (item) {
      console.log(item)
      const $this = this
      let errorMessage = ''
      if (item.status === 'leader') errorMessage = '无法移除组长'
      if (!this.isCaptain) errorMessage = '您无权限删除成员'

      if (errorMessage) {
        wx.showToast({
          title: errorMessage,
          during: 1500,
          icon: 'none'
        })
        return
      }
      wx.showModal({
        title: '删除成员',
        content: `确定删除小组成员"${item.name}"吗`,
        success (res) {
          if (res.confirm) {
            $this.$WXRequest.post({
              url: '/groupinf/',
              data: {
                op: 'removemember',
                openid: $this.openid,
                removeopenid: item.openid
              }
            }).then(res => {
              console.log(res)
            })
          }
        }
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
</style>
