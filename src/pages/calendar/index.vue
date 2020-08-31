<template>
  <i-panel>
    <calendar :months="months"
              :weeks="weeks"
              :events="events"
              lunar
              :completion=true
              :clean=true
              ref="calendar"
              @select="select" />
    <i-row>
      <i-col span="12">
        <i-icon type="add"
                size="50"
                color="grey"
                @click="addSchedule" />
      </i-col>
      <i-col span="12">

      </i-col>
    </i-row>

    <!-- <view class="right" >
      <i-button i-class="button" @click="back" type="info" size="small" >返回</i-button>
    </view> -->

    <i-tab-bar :current="current"
               color="#3cc16e"
               @change="change"
               fixed="true">
      <i-tab-bar-item key="calendar"
                      icon="homepage"
                      current-icon="homepage_fill"
                      title="日历"></i-tab-bar-item>
      <i-tab-bar-item key="schedule"
                      icon="activity"
                      current-icon="activity_fill"
                      title="日程"></i-tab-bar-item>
    </i-tab-bar>
  </i-panel>
</template>
 
<script>
import calendar from 'mpvue-calendar'
import 'mpvue-calendar/src/style.css'

export default {
  data () {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weeks: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      value: [2020, 3, 26],
      events: { '2020-3-19': 'My Birthday' },
      current: 'calendar'
    }
  },
  components: {
    calendar
  },
  methods: {
    select (val, val2) {
      console.log(val)
      console.log(val2)
    },
    addSchedule () {
      console.log('add schedule!')
      wx.navigateTo({ url: '../functions/pages/schedule-update/main?id=-1' })
    },
    change (event) {
      switch (event.mp.detail.key) {
        case 'schedule':
          wx.navigateTo({ url: '../functions/pages/schedule-index/main' })
          break
      }
    },
    back () {
      wx.switchTab({ url: '../other-function/main' })
    }
  }
}
</script>

<style lang="stylus" scoped>
.right
  text-align right
>>> .button
  width 80px
  height 40px
  vertical-align middle
  float right
</style>