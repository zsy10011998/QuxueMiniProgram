<template>
  <i-panel>
    <i-input mode="wrapped" placeholder="搜索-日程名称关键字"
      maxlength="20" @change="updateSearch" />
    <i-cell-group v-for="(schedule, index) in schedules" :key="index" >
      <i-cell v-if="schedule.seen" :title="schedule.title" :label="timeArray[index]" 
        is-link :url="'../schedule-update/main?id=' + schedule.id"></i-cell>
    </i-cell-group>

    <i-tab-bar :current="current" color="#3cc16e" @change="change" fixed="true">
      <i-tab-bar-item key="calendar" icon="homepage" current-icon="homepage_fill" title="日历"></i-tab-bar-item>
      <i-tab-bar-item key="schedule" icon="activity" current-icon="activity_fill" title="日程"></i-tab-bar-item>
    </i-tab-bar>
  </i-panel>
</template>
 
<script>

export default {
  data () {
    return {
      schedules: [],
      current: 'schedule',
      search: ''
    }
  },
  onShow: function () {
    this.loadAllSchedules()
  },
  methods: {
    loadAllSchedules () {
      var _this = this
      this.$WXRequest.get({
        url: '/todos/',
        data: {}
      }).then(res => {
        _this.schedules = res.data
        for (var i = 0; i < _this.schedules.length; i++) {
          let schedule = _this.schedules[i]
          schedule.startTime = _this.initDateForm(schedule.startTime)
          schedule.endTime = _this.initDateForm(schedule.endTime)
          schedule.seen = true
        }
      })
    },
    demonstrateTime (date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      let day = date.getDate()
      day = day < 10 ? '0' + day : day
      return year + '-' + month + '-' + day
    },
    change (event) {
      switch (event.mp.detail.key) {
        case 'calendar':
          wx.navigateBack()
          break
      }
    },
    updateSearch (event) {
      let search = event.mp.detail.detail.value
      this.search = search
      for (var i = 0; i < this.schedules.length; i++) {
        let schedule = this.schedules[i]
        let seen = schedule.title.includes(search)
        this.$set(this.schedules[i], 'seen', seen)
      }
      console.log(this.schedules[0].title.includes(search))
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
    timeArray () {
      let index
      let timeArray = []
      let schedules = this.$data.schedules
      for (index = 0; index < schedules.length; index++) {
        timeArray[index] = this.demonstrateTime(schedules[index].startTime)
      }
      return timeArray
    }
  }
}
</script>

<style scoped>
</style>