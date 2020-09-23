<template>
  <div class="counter-warp">
    <div class="image">
      <img mode='aspectFit'
           :src='image'>
    </div>
    <view class="int">{{text}}</view>
    <view class="int">{{url}}</view>

    <button hover-class="clicked"
            class="login-button"
            @click="copyurl">复制网址</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      image: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
      text: '  这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本这是一段介绍文本',
      url: 'https://shipinlianjie.com'

    }
  },
  computed: {
    ...mapState({
      myInfo: state => state.user.myInfo,
      openid: state => state.student.openid
    })
  },
  methods: {
    copyurl () {
      wx.setClipboardData({
        data: this.url,
        success (res) {
          wx.getClipboardData({
            success (res) {
              console.log(res.data) // data
            }
          })
        }
      })
    }
  }

}
// 1
</script>


<style lang="stylus" scoped>
.image
  width 90%
.int
  text-align center
.login-button
  width 80vw
  background-color $theme-blue
  color white
  font-size 16px
  margin 10px auto 10px
  &::before
    width 20px
    height 20px
    margin 0 6px 2px 0
.clicked
  background-color $dark-blue
</style>
