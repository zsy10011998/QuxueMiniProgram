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
  font-size: 35rpx;
  padding: 10rpx;
  flex: 1;
  line-height: 1.6;
  padding: 4px 0;
  min-height: 22px;
  height: auto;
}
.video {
  padding: 30rpx;
  text-align: center;
}
</style>