<template>
  <div>
    <div class="blo"
         v-for="(item1, index1) in videoList"
         :key="index1">
      <view class="
         title1"
            @click="changeshow(index1)">>{{item1.type}}</view>
      <div>
        <div v-for="(item2, index2) in item1.videos"
             :key="index2">
          <view class="title2"
                @click="hidleclick(item2.videoname,item2.videourl)">{{index2+1}}.{{item2.videoname}} </view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      videoList: [{
        videourl: '',
        videoname: ''

      }],
      tag: []
    }
  },
  onLoad: function () {
    this.$WXRequest.get({
      url: '/vedios/',
      data: {
      }
    }).then(res => {
      console.log(res)
      this.videoList = res
      for (var i = 0; i < res.length; i++) {
        this.tag[i] = false
      }
      this.tag[0] = true
      console.log(this.tag)
    })
  },
  methods: {
    hidleclick (videoname, videourl) {
      console.log('dianji')
      wx.navigateTo({
        url: '../onevideo/main?videoname=' + videoname + '&videourl=' + videourl
      })
    },
    changeshow (index1) {
      this.tag[index1] = !this.tag[index1]
      console.log(this.tag)
    }
  }

}
</script>

<style scoped>
.blo {
  padding: 10rpx;
}
.title1 {
  font-size: 50rpx;
  padding: 10rpx;
  flex: 1;
  line-height: 1.6;
  padding: 4px 0;
  min-height: 22px;
  height: auto;
}
.title2 {
  font-size: 35rpx;
  padding: 10rpx;
  flex: 1;
  line-height: 1.6;
  padding: 4px 0;
  min-height: 22px;
  height: auto;
}
</style>