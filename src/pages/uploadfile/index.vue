<template>
  <div class="counter-warp">

    <button hover-class="clicked"
            class="login-button"
            @click="upload">上传文件</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {

      loginForm: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  computed: {
    ...mapState({
      myInfo: state => state.user.myInfo,
      openid: state => state.student.openid
    })
  },
  onUnload () {
    this.loading = false
  },
  methods: {
    upload () {
      // wx.request({
      //   url: 'http://127.0.0.1:8000/upload/', // 仅为示例，并非真实的接口地址
      //   data: {
      //     x: '',
      //     y: ''
      //   },
      //   header: {
      //     'content-type': 'application/json' // 默认值
      //   },
      //   success (res) {
      //     console.log(res.data)
      //   }
      // })
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success (res) {
          const tempFile = res.tempFiles
          wx.uploadFile({
            url: 'http://127.0.0.1:8000/upload/', // 仅为示例，非真实的接口地址
            filePath: tempFile[0].path,
            name: 'file',
            formData: {
              'user': 'test',
              'filename': tempFile[0].name
            },
            success (res) {
              console.log(res)
              wx.showToast({
                title: res.data,
                icon: 'none',
                duration: 1500
              })

              console.log('success')
            },
            fail (res) {
              console.log('fail')
            },
            complete (res) {
              console.log('complete')
            }
          })
        }
      })

      // wx.chooseMessageFile({
      //   count: 1,
      //   type: 'file',
      //   success (res) {
      //     const tempFilePaths = res.tempFiles
      //     console.log(res.tempFiles)
      //     wx.uploadFile({
      //       url: 'https://cs.zhouyc.cc/upload/', // 仅为示例，非真实的接口地址
      //       filePath: tempFilePaths[0],
      //       name: 'file',
      //       formData: {
      //         'user': 'test'
      //       },
      //       success (res) {
      //         console.log('success')
      //       },
      //       fail (res) {
      //         console.log('fail')
      //       },
      //       complete (res) {
      //         console.log('complete')
      //       }
      //     })
      //   }
      // })
    }
  }
}
// 1
</script>

<style lang="stylus" scoped>
.counter-warp
  height 100%
  background $white
  text-align center
  .header
    padding 30px 40px
    background-color $theme-green
    color white
    .header-content
      display flex
      flex-direction column
      align-items center
      .icon
        width 110px
        height 100px
      .text
        text-align center
        padding-left 8px
        .text-header
          font-size 28px
          font-family YouYuan
        .text-content
          padding-top 8px
          font-size 16px
          font-family Microsoft YaHei
  >>> .login-table
    margin 60px auto 45px
>>> .input
  text-align center
  height 32px
  width 250px
  background-color #f8f8f9
  border-block-color #dddee1
  border-radius 8px
  font-size 16px
  border 1px solid $border-base
  margin-bottom 8px
  margin-left auto
  margin-right auto
.login-button
  width 80vw
  background-color $theme-green
  color white
  font-size 16px
  margin 10px auto 10px
  &::before
    width 20px
    height 20px
    margin 0 6px 2px 0
.clicked
  background-color $dark-green
</style>
