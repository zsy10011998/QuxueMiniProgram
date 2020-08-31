<template>
  <div class="user-id">学号：{{studentNo}}</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      videoList: [{
        videourl: '',
        videoname: ''

      }]
    }
  },
  computed: {
    ...mapState({
      myInfo: state => state.user.myInfo,
      studentNo: state => state.user.studentNo
    })
  },
  mounted () {
    this.studentNo = wx.store.state.user.studentNo
  },
  methods: {
  }

}
</script>

<style scoped>
.blo {
  padding: 10rpx;
}
.title1 {
  font-size: 50rpx;
  height: 80rpx;
  font-weight: 500;
}
.title2 {
  font-size: 35rpx;
  padding: 10rpx;
}
</style>
