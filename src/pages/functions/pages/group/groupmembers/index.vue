<template>
  <div class="main-container">
    <loop-banner
      :texts="submitBanner"
      :v-if="submitBanner.length"
    />
    <loop-banner
      v-if="allowTimeBanner.length"
      :texts="allowTimeBanner"
      backgroundColor="#e6f7ff"
      borderColor="#91d5ff"
      color="#1890ff"
      :hidable="false"
    />
    <div class="member-list">
      <i-swipeout
        v-for="(item, index) in membersinf"
        :operateWidth="!groupSubmitted && isCaptain && item.status !== 'leader' ? 120 : 0"
        :key="index"
        class="member-item"
      >
        <div class="member-card" slot="content">
          <div class="image-container">
            <image v-if="item.avatarUrl" :src="item.avatarUrl" />
            <image v-else src="/static/images/avatar.png" />
          </div>
          <div class="text-container">
            <div class="student-name">
              <span>{{ item.name }}</span>
              <color-tag :text="item.text" :theme="item.theme" />
            </div>
            <div class="student-id">
              <span>{{ item.studentNo }}</span>
              <span v-for="(timespan, _) in item.myTimes" :key="timespan">
                <color-tag :text="timespanMap[timespan]" theme="purple" />
              </span>
            </div>
          </div>
        </div>
        <view slot="button" class="i-swipeout-demo-button-group">
          <view class="i-swipeout-demo-button delete-button" @click="deleteMember(item)">
            <i-icon size="32" type="delete_fill"></i-icon>
          </view>
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
    <div v-if="isCaptain && !addblock && !groupSubmitted">
      <button
        hover-class="clicked"
        class="login-button"
        @click="displayAddBlock"
      >添加新成员</button>
      <button
        hover-class="clicked"
        class="login-button"
        v-if="groupSubmitted === false"
        @click="beforeSubmitGroup"
      >提交分组</button>
      <button
        hover-class="clicked"
        class="login-button"
        @click="beforeDisGroup"
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
import {
  GetGroupMembersAPI,
  AddGroupMemberAPI,
  ExitGroupAPI,
  RemoveMemberAPI,
  GetSelfGroupInfoAPI,
  DisGroupAPI,
  SubmitGroupAPI
} from '../api'
import { STATUS_LEADER, STATUS_MEMBER, STATUS_INVITED, TIMESPAN_MAP, TIMESPAN_SHORT_MAP } from '../const'

const statusCodeOrder = {
  [STATUS_LEADER]: 3,
  [STATUS_MEMBER]: 2,
  [STATUS_INVITED]: 1
}

const sortMemberFn = (a, b) => {
  const oa = statusCodeOrder[a.status] || 0
  const ob = statusCodeOrder[b.status] || 0
  return ob - oa
}

const minimumMembers = 4
const maximumMembers = 5

const statusMap = {
  leader: ['green', '组长'],
  member: ['blue', '成员'],
  invited: ['yellow', '邀请中']
}

export default {
  data () {
    return {
      isCaptain: '',
      groupNo: '',
      membersinf: [],
      studentNo: '',
      addblock: false,
      groupSubmitted: undefined,
      allowTime: null,
      allowTimeBanner: [],
      submitBanner: [],
      timespanMap: TIMESPAN_SHORT_MAP
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
    const { submitBanner, openid } = this
    const param = { openid }
    GetSelfGroupInfoAPI(param).then(res => {
      const { isCaptain, isSubmit, allowTime } = res
      this.$set(this, 'isCaptain', isCaptain)
      this.$set(this, 'groupSubmitted', isSubmit || false)
      this.$set(this, 'allowTime', allowTime)

      if (!isSubmit) submitBanner.push('组长尚未提交当前分组')
      if (isCaptain) submitBanner.push('组长可左划管理成员')

      const allowTimeBanner = [`当前分组环节所属课时: ${TIMESPAN_MAP[allowTime]}`]
      this.$set(this, 'allowTimeBanner', allowTimeBanner)
    })
    this.getGroupMembers()
  },
  methods: {
    getGroupMembers () {
      const param = { openid: this.openid }
      GetGroupMembersAPI(param).then(res => {
        if (res.members) {
          const membersSorted = res.members.sort(sortMemberFn)
          membersSorted.forEach(item => {
            const { studentNo, status } = item
            if (studentNo) item.studentNo = studentNo.toUpperCase()
            if (status in statusMap) {
              const [theme, text] = statusMap[status]
              item.theme = theme
              item.text = text
            }
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
      const { openid, studentNo } = this
      if (!studentNo) return
      if (this.membersinf.length >= 5) {
        wx.showToast({
          title: '最多只能五个成员',
          during: 1500,
          icon: 'none'
        })
        return
      }
      const params = { openid, studentNo }
      AddGroupMemberAPI(params).then(res => {
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
    beforeSubmitGroup () {
      // Check whether the group is valid
      const members = this.membersinf
      let errorMessage = ''
      if (members.length < minimumMembers) errorMessage = `成员数不能少于${minimumMembers}人`
      if (members.length > maximumMembers) errorMessage = `成员数不能多于${maximumMembers}人`
      if (members.filter(item => item.status === STATUS_INVITED).length > 0) errorMessage = '还有成员没有接受邀请'
      if (errorMessage) {
        wx.showToast({
          title: errorMessage,
          during: 1500,
          icon: 'none'
        })
        return
      }
      const $this = this
      wx.showModal({
        title: '确定提交分组',
        content: '提交分组后将不能修改',
        success (res) {
          if (res.confirm) {
            $this.submitGroup()
          }
        }
      })
    },
    async submitGroup () {
      const param = { openid: this.openid }
      SubmitGroupAPI(param).then(res => {
        const { repCode, errMsg } = res
        if (repCode === 200) {
          this.$set(this, 'groupSubmitted', true)
          wx.showToast({
            title: '提交成功',
            during: 1500
          })
        } else {
          wx.showToast({
            title: errMsg,
            during: 1500,
            icon: 'none'
          })
        }
      })
    },
    exitgroup () {
      const param = { openid: this.openid}
      ExitGroupAPI(param).then(res => {
        if (res.repCode === 200) {
          wx.showToast({
            title: '退出成功',
            during: 1500,
            icon: 'none'
          }).then(
            wx.redirectTo({ url: '../main' })
          )
        }
      })
    },
    beforeDisGroup () {
      const $this = this
      wx.showModal({
        title: '解散分组',
        content: '是否解散分组',
        success: function (result) {
          if (result.confirm)
          $this.disGroup()
        }
      })
    },
    disGroup () {
      const param = { openid: this.openid }
      DisGroupAPI(param).then(res => {
        if (res.repCode === 200) {
          wx.showToast({
            title: '解散成功',
            during: 1500
          })
          setTimeout(() => {
            wx.redirectTo({ url: '../main' })
          }, 1500)
        }
      })
    },
    deleteMember (item) {
      const $this = this
      let errorMessage = ''
      if (item.status === STATUS_LEADER) errorMessage = '无法移除组长'
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
            const params = {
              openid: $this.openid,
              removeopenid: item.openid
            }
            RemoveMemberAPI(params).then(_ => {
              $this.getGroupMembers()
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

.delete-button {
  background: #ff5252;
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
