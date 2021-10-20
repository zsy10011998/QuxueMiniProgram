<template>
  <div class="main-container">
    <div class="information">
      <h1 class="menu-title">您的作业</h1>

      <div class="item">
        <button hover-class="clicked"
                class="login-button"
                @click="showMulLinkageTwoPicker">请选择您的题目</button>
        <mp-picker ref="mpPicker"
                   :mode="mode"
                   :deepLength="deepLength"
                   :pickerValueDefault="pickerValueDefault"
                   :pickerValueArray="pickerValueArray"
                   @onChange="onChange"
                   @onConfirm="onConfirm"
                   @onCancel="onCancel"></mp-picker>

        <div class="value">{{fileForm.themeMessage}}</div>
      </div>

      <div class="item">
        <button hover-class="clicked"
                class="login-button"
                @click="uploadFile">上传作业</button>
        <div class="value">{{fileForm.fileMessage}}</div>
      </div>

      <div class="item">
        <button hover-class="clicked"
                class="login-button"
                @click="submitFile">提交作业</button>
      </div>

      <h1 class="menu-title">您的成绩</h1>
      <div class="item">
        <div class="value">{{fileForm.score}}</div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import mpPicker from 'mpvue-weui/src/picker'

export default {
  data () {
    return {
      fileForm: {
        themeMessage: '您未选择作业题目',
        themeCode: '',
        fileMessage: '您未提交作业文件(仅支持docx和txt文件)',
        fileName: '',
        filePath: '',
        score: '未提交作业'
      },
      mode: 'multiLinkageSelector',
      deepLength: 2,
      pickerValueDefault: [0, 0],
      pickerValueArray: '',
      timelock: true,
    }
  },
  components: {
    mpPicker,
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
  onShow: function () {
    this.$WXRequest.get({
      url: '/getHomeWork/',
    }).then(res => {
      this.$set(this, 'pickerValueArray', res)
    })
  },

  methods: {
    showMulLinkageTwoPicker () {
      this.$refs.mpPicker.show()
    },
    onConfirm (e) {
      //console.log(e.value)
      this.$set(this.fileForm, 'themeMessage', '您选择提交: ' + e.label)
      this.$set(this.fileForm, 'themeCode', e.value[1])
      //console.log(this.fileForm.themeCode)
    },
    onChange (e) {
      //console.log(e)
    },
    onCancel (e) {
      //console.log(e)
      this.$set(this.fileForm, 'themMessage', '您已取消选择作业题目')
    },
    uploadFile () {
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success: (res) => {
          const tempFile = res.tempFiles
          var fileType = (function (filename) {
            var index = filename.lastIndexOf('.')
            return index === -1 ? false : filename.substr(index + 1)
          })(tempFile[0].name)

          if (fileType == 'docx' || fileType == 'txt') {
            this.$set(this.fileForm, 'filePath', tempFile[0].path)
            this.$set(this.fileForm, 'fileName', tempFile[0].name)
            this.$set(this.fileForm, 'fileMessage', '您选择提交: ' + tempFile[0].name)
          }
          else {
            wx.showToast({
              title: '请提交docx或txt格式的文件',
              icon: 'none',
              duration: 1000
            })
          }
        }
      })
    },
    submitFile () {
      if (! this.timelock){
        wx.showToast({
          title: '频繁提交，请稍后再次尝试',
          icon: 'none',
          duration: 1500
        })
        return
      } else {this.$set(this,'timelock',false)}

      if (this.fileForm.fileName != '' && this.fileForm.themeCode != '') {  // 作业题目不为空且作业文件不为空
        wx.showLoading({
          title: '加载中',
        })
        this.$set(this.fileForm,'score','AI计算中...')
        
        this.$WXRequest.uploadFile({
          url: '/judgeScore/',
          filePath: this.fileForm.filePath,
          name: this.fileForm.fileName,
          openid: this.openid,
          themeCode: this.fileForm.themeCode,
          onOk: (res) => {
            console.log(res.data)
            this.$set(this.fileForm, 'score', res.data)
          },
          onError: (res) => {
            wx.showToast({
              title: '服务器维护',
              icon: 'none',
              duration: 1500
            })
          }
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: '请选择您的作业题目和作业文件',
          icon: 'none',
          duration: 1500
        })
      }
      setTimeout(() =>{
        this.$set(this,'timelock',true)
      }, 60 * 1000)
    }
  }

}
</script>

<style lang='stylus' scoped>
.main-container
  width 100vw
  min-height 100vh
  position absolute
  background-image url('https://cs.zhouyc.cc/images/homeEvaluate.png')
  background-position center 90%
  background-repeat no-repeat
  background-size 100%
  background-attachment fixed
.menu-title
  color #1c85b9
  letter-spacing 3rpx
  font-size 40rpx
  font-weight bolder
  margin 30rpx 0 30rpx 10rpx
  float left
.information
  margin 60rpx 40rpx
  padding 30rpx
  background rgba(255, 255, 255, 0.8)
  float left
.item
  font-size 32rpx
  font-weight bold
  margin-bottom 20rpx
  float left
  position relative
  width 100%
.title
  float left
  width 40%
  text-align right
  box-sizing border-box
  padding-right 20rpx
.value
  box-sizing border-box
  padding-left 20rpx
  color #888
  text-align center
button
  width 60vw
  background-color $theme-blue
  color white
  font-size 20px
  margin 2px auto
  padding 2px auto
</style>
