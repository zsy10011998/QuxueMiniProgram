<template>
  <i-panel>
    <i-cell-group >
      <i-input i-class="necessary1" :value="schedule.title" title="标题" placeholder="请输入日程标题" maxlength="100" 
        @change="updateTitle" />
      <i-input :value="schedule.content" title="内容" type="textarea"
        placeholder="给日程添加些内容吧" @change="updateContent" />

      <i-cell i-class="necessary2" title="开始日期:" >
        <picker mode="date" :value="startDate" @change="setStartDate">
          {{startDate || '请选择'}}
        </picker>
      </i-cell>

      <i-cell title="开始时间:" >
        <picker mode="time" :value="startTime" @change="setStartTime">
          {{startTime || '请选择'}}
        </picker>
      </i-cell>

      <i-cell title="结束日期:" >
        <picker mode="date" :value="endDate" @change="setEndDate">
          {{endDate || '请选择'}}
        </picker>
      </i-cell>

      <i-cell title="结束时间:" >
        <picker mode="time" :value="endTime" @change="setEndTime">
          {{endTime || '请选择'}}
        </picker>
      </i-cell>

      <!-- <i-cell title="全天">
        <switch slot="footer" :value="schedule.allDay" change="setAllDay()" />
      </i-cell> -->
    </i-cell-group>
    
    <view class="update">
      <i-button :wx:if="update" type="success" shape="circle" size="small"
        @click="handleUpdate()" >保存</i-button>
      <i-button :wx:if="update" type="error" shape="circle" size="small"
        @click="handleDelete()" >删除</i-button>
      <i-button :wx:if="!update" type="success" shape="circle" size="small"
        @click="handleNew()" >新建</i-button>
    </view>
  </i-panel>
</template>
 
<script>
export default {
  data () {
    return {
      schedule: {
        id: '',
        title: '',
        content: '',
        startTime: '',
        allDay: '',
        user: ''
      },
      update: false
    }
  },
  onLoad ({id}) {
    if (id !== '-1') {
      this.update = true
      this.$WXRequest.get({
        url: '/todos/' + id + '/',
        data: {}
      }).then(res => {
        console.log(res)
        this.schedule = res.data
        this.schedule.startTime = this.initDateForm(this.schedule.startTime)
        this.schedule.endTime = this.initDateForm(this.schedule.endTime)
      })
    } else {
      this.schedule = {
        id: '',
        title: '',
        content: '',
        startTime: '',
        allDay: '',
        user: ''
      }
      this.update = false
    }
  },
  methods: {
    setAllDay () {
      this.schedule.allDay = !this.schedule.allDay
    },
    setStartDate (event) {
      let time = event.mp.detail.value
      let date = new Date(this.schedule.startTime)
      date.setFullYear(parseInt(time.slice(0, 4)))
      date.setMonth(parseInt(time.slice(5, 7)) - 1)
      date.setDate(parseInt(time.slice(8, 10)))
      this.$set(this.schedule, 'startTime', date)
    },
    setEndDate (event) {
      let time = event.mp.detail.value
      let date = new Date(this.schedule.endTime)
      date.setFullYear(parseInt(time.slice(0, 4)))
      date.setMonth(parseInt(time.slice(5, 7)) - 1)
      date.setDate(parseInt(time.slice(8, 10)))
      this.$set(this.schedule, 'endTime', date)
    },
    setStartTime (event) {
      let time = event.mp.detail.value
      let date = new Date(this.schedule.startTime)
      date.setHours(parseInt(time.slice(0, 2)))
      date.setMinutes(parseInt(time.slice(3, 5)))
      date.setSeconds(0)
      this.$set(this.schedule, 'startTime', date)
    },
    setEndTime (event) {
      let time = event.mp.detail.value
      let date
      if (this.schedule.endTime) {
        date = new Date(this.schedule.endTime)
      } else {
        date = new Date()
      }
      date.setHours(parseInt(time.slice(0, 2)))
      date.setMinutes(parseInt(time.slice(3, 5)))
      date.setSeconds(0)
      this.$set(this.schedule, 'endTime', date)
    },
    updateTitle (event) {
      let title = event.mp.detail.detail.value
      this.$set(this.schedule, 'title', title)
    },
    updateContent (event) {
      let content = event.mp.detail.detail.value
      this.$set(this.schedule, 'content', content)
    },
    handleUpdate () {
      var _this = this
      wx.showModal({
        title: '提示',
        content: '您确定要保存当前的修改吗',
        conformText: '修改',
        confirmColor: '#2d8cf0',
        success (res) {
          if (res.confirm) {
            _this.updateConfirm()
            console.log('修改')
          } else {
            console.log('取消')
          }
        }
      })
    },
    handleDelete () {
      var _this = this
      wx.showModal({
        title: '提示',
        content: '您确定要删除这个日程吗',
        conformText: '删除',
        confirmColor: '#ed3f14',
        success (res) {
          if (res.confirm) {
            _this.deleteConfirm()
            console.log('删除')
          } else {
            console.log('取消')
          }
        }
      })
    },
    handleNew () {
      var _this = this
      wx.showModal({
        title: '提示',
        content: '您确定要创建这个新日程吗',
        conformText: '创建',
        confirmColor: '#2d8cf0',
        success (res) {
          if (res.confirm) {
            _this.newConfirm()
            console.log('删除')
          } else {
            console.log('取消')
          }
        }
      })
    },
    updateConfirm () {
      if (!this.schedule.title) {
        wx.showToast({
          title: '请输入日程标题',
          icon: 'none',
          duration: 2000
        })
        return
      } else if (this.schedule.endTime && this.schedule.endTime < this.schedule.startTime) {
        wx.showToast({
          title: '结束时间需要在开始时间之后',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let mySchedule = JSON.parse(JSON.stringify(this.schedule))
      mySchedule.startTime = this.calDateForm(this.schedule.startTime)
      mySchedule.endTime = this.calDateForm(this.schedule.endTime)
      this.$WXRequest.put({
        url: '/todos/' + this.schedule.id + '/',
        data: mySchedule
      }).then(res => {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
      })
      wx.navigateBack()
    },
    newConfirm () {
      if (!this.schedule.title) {
        wx.showToast({
          title: '请输入日程标题',
          icon: 'none',
          duration: 2000
        })
        return
      } else if (!this.schedule.startTime) {
        wx.showToast({
          title: '请输入开始时间',
          icon: 'none',
          duration: 2000
        })
        return
      } else if (this.schedule.endTime && this.schedule.endTime < this.schedule.startTime) {
        wx.showToast({
          title: '结束时间需要在开始时间之后',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let mySchedule = JSON.parse(JSON.stringify(this.schedule))
      mySchedule.startTime = this.calDateForm(this.schedule.startTime)
      mySchedule.endTime = this.calDateForm(this.schedule.endTime)
      this.$WXRequest.post({
        url: '/todos/',
        data: mySchedule
      }).then(res => {
        wx.showToast({
          title: '新建成功',
          icon: 'success',
          duration: 2000
        })
      })
      wx.navigateBack()
    },
    deleteConfirm () {
      console.log(this.schedule)
      this.$WXRequest.deleteRequest({
        url: '/todos/' + this.schedule.id + '/'
      }).then(res => {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
      })
      wx.navigateBack()
    },
    calDateForm (date) {
      console.log(date)
      if (!date) {
        return ''
      }
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      let day = date.getDate()
      day = day < 10 ? '0' + day : day
      let hour = date.getHours()
      hour = hour < 10 ? '0' + hour : hour
      let minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    },
    initDateForm (date) {
      if (!date) {
        return ''
      }
      let year = parseInt(date.slice(0, 4))
      let month = parseInt(date.slice(5, 7)) - 1
      let day = parseInt(date.slice(8, 10))
      let hour = parseInt(date.slice(11, 13))
      let minute = parseInt(date.slice(14, 16))
      return new Date(year, month, day, hour, minute)
    }
  },
  computed: {
    startDate: function () {
      let startTime = this.$data.schedule.startTime
      if (!startTime) {
        return ''
      }
      let year = startTime.getFullYear()
      let month = startTime.getMonth() + 1
      month = month < 10 ? '0' + month : month
      let day = startTime.getDate()
      day = day < 10 ? '0' + day : day
      return year + '-' + month + '-' + day
    },
    startTime: function () {
      let startTime = this.$data.schedule.startTime
      if (!startTime) {
        return ''
      }
      let hour = startTime.getHours()
      hour = hour < 10 ? '0' + hour : hour
      let minute = startTime.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      return hour + ':' + minute
    },
    endDate: function () {
      let endTime = this.$data.schedule.endTime
      if (!endTime) {
        return ''
      }
      let year = endTime.getFullYear()
      let month = endTime.getMonth() + 1
      month = month < 10 ? '0' + month : month
      let day = endTime.getDate()
      day = day < 10 ? '0' + day : day
      return year + '-' + month + '-' + day
    },
    endTime: function () {
      let endTime = this.$data.schedule.endTime
      if (!endTime) {
        return ''
      }
      let hour = endTime.getHours()
      hour = hour < 10 ? '0' + hour : hour
      let minute = endTime.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      return hour + ':' + minute
    }
  }
}
</script>

<style lang="stylus" scoped>
  .update 
    padding-top: 40px

  >>> .necessary1::before
    content: '*'
    color: red
    position absolute
    left 10px

  >>> .necessary2::before
    content: '*'
    color: red
    position absolute
    left 8px
    top 13px

</style>