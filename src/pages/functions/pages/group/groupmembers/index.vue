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
        v-for="(item, i) in membersinf"
        :operateWidth="!groupSubmitted && isCaptain && item.status !== 'leader' ? 120 : 0"
        :key="i"
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
              <span v-for="timespan in item.myTimes" :key="timespan">
                <color-tag :text="timespanMap[timespan]" :theme="timespan === allowTime ? 'purple': 'grey'" />
              </span>
            </div>
          </div>
        </div>
        <view slot="button" class="i-swipeout-demo-button-group">
          <view class="i-swipeout-demo-button delete-button" @click="beforeRemoveMember(item)">
            <i-icon size="32" type="delete_fill"></i-icon>
          </view>
        </view>
      </i-swipeout>
    </div>
    <div class="quota-list">
      <div>四人组已选: <span class="now">{{now4}}</span>/<span class="max">{{max4}}</span></div>
      <div>五人组已选: <span class="now">{{now5}}</span>/<span class="max">{{max5}}</span></div>
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
      <!-- <button
        hover-class="clicked"
        class="login-button"
        @click="testFunction"
      >测试按钮</button> -->
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
import { showToast, showModal } from '../../../../../utils/wx-components'
import {
  GetGroupMembersAPI,
  AddGroupMemberAPI,
  ExitGroupAPI,
  RemoveMemberAPI,
  GetSelfGroupInfoAPI,
  DisGroupAPI,
  SubmitGroupAPI,
  GetGroupsInfoAPI
} from '../api'
import {
  STATUS_LEADER,
  STATUS_MEMBER,
  STATUS_INVITED,
  TIMESPAN_MAP,
  TIMESPAN_SHORT_MAP,
  FEErrorMsg,
  FENoticeMsg,
  MINIMUM_MEMBERS,
  MAXIMUM_MEMBERS
} from '../const'

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
      allowTime: null,  // 'BC'
      allowTimeBanner: [],
      submitBanner: [],
      timespanMap: TIMESPAN_SHORT_MAP,
      max4: '-',
      max5: '-',
      now4: '-',
      now5: '-'
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
      const { isCaptain, isSubmit} = res
      this.$set(this, 'isCaptain', isCaptain)
      this.$set(this, 'groupSubmitted', isSubmit || false)

      if (!isSubmit) submitBanner.push('组长尚未提交当前分组')
      if (isCaptain) submitBanner.push('组长可左划管理成员')
    })
    GetGroupsInfoAPI({}).then(res => {
      const { Max4, Max5, allowTime, now4, now5 } = res
      this.$set(this, 'allowTime', allowTime)

      const allowTimeBanner = [`当前分组环节所属课时: ${TIMESPAN_MAP[allowTime]}`]
      this.$set(this, 'allowTimeBanner', allowTimeBanner)
      this.$set(this, 'max4', Max4)
      this.$set(this, 'max5', Max5)
      this.$set(this, 'now4', now4)
      this.$set(this, 'now5', now5)
    }).catch(res => {
      console.log(res)
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
            const [theme, text] = statusMap[status]
            item.theme = theme
            item.text = text
          })
          this.$set(this, 'membersinf', membersSorted)
        }
      })
    },
    displayAddBlock () {
      const { membersinf } = this
      let errorMessage
      if (membersinf.length >= 5) errorMessage = FEErrorMsg.CANNOT_MORE_THAN_5_MEMBERS
      if (!this.isAllTimespanValid()) errorMessage = FEErrorMsg.INVALID_TIMESPAN
      if (errorMessage) {
        showToast(errorMessage)
        return
      }
      this.$set(this, 'addblock', true)
    },
    hideAddBlock () {
      this.$set(this, 'studentNo', '')
      this.$set(this, 'addblock', false)
    },
    addnew () {
      const { openid, studentNo } = this
      if (!studentNo) return
      const params = { openid, studentNo }
      AddGroupMemberAPI(params).then(res => {
        this.getGroupMembers()
        this.hideAddBlock()

        showToast('等待学生确认')
      }).catch(res =>{
        showToast(res.errMsg)
      })
    },
    updatestudetNo (event) {
      let title = event.mp.detail.detail.value
      this.$set(this, 'studentNo', title)
    },
    beforeSubmitGroup () {
      // Check whether the group is valid
      const members = this.membersinf
      const errorMessage = !this.isAllTimespanValid()
        ? FEErrorMsg.INVALID_TIMESPAN
        : (members.filter(item => item.status === STATUS_INVITED).length > 0)
        ? FEErrorMsg.EXIST_NOT_ACCEPTED_INVITED
        : members.length > MAXIMUM_MEMBERS
        ? FEErrorMsg.CANNOT_MORE_THAN_5_MEMBERS
        : members.length < MINIMUM_MEMBERS
        ? FEErrorMsg.CANNOT_LESS_THAN_4_MEMBERS
        : undefined
      if (errorMessage) {
        showToast(errorMessage)
        return
      }
      showModal(
        FENoticeMsg.SUBMIT_TITLE,
        FENoticeMsg.SUBMIT_CONTENT,
        this.submitGroup.bind(this)
      )
    },
    async submitGroup () {
      const param = { openid: this.openid }
      SubmitGroupAPI(param).then(res => {
        this.$set(this, 'groupSubmitted', true)
        showToast(FENoticeMsg.SUBMIT_CONTENT, '')
      }).catch(res => {
        showToast(res.errMsg)
      })
    },
    exitgroup () {
      const param = { openid: this.openid}
      ExitGroupAPI(param).then(res => {
        showToast(FENoticeMsg.EXIT_SUCCESS, '').then(
          wx.redirectTo({ url: '../main' })
        )
      })
    },
    beforeDisGroup () {
      if (!this.isAllTimespanValid(true)) return

      showModal(
        FENoticeMsg.DISGROUP_TITLE,
        FENoticeMsg.DISGROUP_CONTENT,
        this.disGroup.bind(this)
      )
    },
    disGroup () {
      const param = { openid: this.openid }
      DisGroupAPI(param).then(res => {
        showToast(FENoticeMsg.DISGROUP_SUCCESS, '')
        setTimeout(() => {
          wx.redirectTo({ url: '../main' })
        }, 1500)
      })
    },
    beforeRemoveMember (item) {
      const errorMessage = !this.isAllTimespanValid()
        ? FEErrorMsg.INVALID_TIMESPAN
        : !this.isCaptain
        ? FEErrorMsg.CANNOT_REMOVE_BY_NON_LEADER
        : item.status === STATUS_LEADER
        ? FEErrorMsg.CANNOT_REMOVE_LEADER
        : undefined

      if (errorMessage) {
        showToast(errorMessage)
        return
      }

      showModal(
        FENoticeMsg.REMOVE_MEMBER_TITLE,
        `确定删除小组成员"${item.name}"吗`,
        this.removeMember.bind(this, item)
      )
    },
    removeMember (item) {
      const params = {
        openid: this.openid,
        removeopenid: item.openid
      }
      RemoveMemberAPI(params).then(_ => {
        this.getGroupMembers()
        showToast(FENoticeMsg.REMOVE_MEMBER_SUCCESS, '')
      })
    },
    isAllTimespanValid(toast = false) {
      const { membersinf, allowTime } = this
      // const ret = false
      const ret = membersinf.every(item => item.myTimes.indexOf(allowTime) >= 0)
      if (!ret && toast) {
        showToast(FEErrorMsg.INVALID_TIMESPAN)
      }
      return ret
    },
    testFunction() {
      console.log(this.isAllTimespanValid())
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

.quota-list {
  margin-left: 70rpx;
  font-size: 28rpx;
  color: #999;
  line-height: 40rpx;
  position: relative;
}
</style>
