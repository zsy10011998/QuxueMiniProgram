<template>
  <view>
    <view class="video">
      <video :src="videourl"></video>
    </view>
    <view class="title">
      <text>{{videoname}}</text>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      videourl: '',
      videoname: ''
    }
  },
  onLoad: function (options) {
    this.videoname = options.videoname
    this.videourl = options.videourl
  }
}
</script>

<style>
.title {
  text-align: center;
  height: 40rpx;
  font-size: 40rpx;
}
.video {
  padding: 30rpx;
  text-align: center;
}
</style>