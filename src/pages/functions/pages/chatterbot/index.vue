<template>
  <div class="chat"
       id="chat"
       :style="{ paddingBottom:'70px' }">
    <view id="list"
          @click="loseFocus">
      <li v-for="(message, index) in messageList"
          :key="index">
        <div :class="(message.flow === 'out') ? 'item-right' : 'item-left'">
          <div class="content">
            <div class="name">
              <template v-if="message.flow === 'in'">
                {{isChat ? '菲菲' : '加加'}}
              </template>
              <template v-else>
                {{name}}
              </template>
            </div>
            <div class="wrapper">
              <div class="message">
                <div class="text-message">
                  <span>{{message.content}}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <!-- 自己发的消息头像 -->
            <i-avatar i-class="avatar"
                      v-if="message.flow === 'out'"
                      :src="avatarUrl"
                      shape="square" />
            <!-- 收到的消息头像 -->
            <i-avatar i-class="avatar"
                      v-else
                      shape="square"
                      src='/static/images/avatar.png' />
          </div>
        </div>
      </li>
    </view>
    <!--    输入框及选择框部分-->
    <div class="bottom">
      <div class="bottom-div"
           :style="{marginBottom: isFocus ? '10px' : 0}">
        <div class="switch"
             @click="changeRobot"
             v-if="!isFocus">
          切换
        </div>
        <div style="width: 100%">
          <input type="text"
                 class="input"
                 v-model.lazy:value="messageContent"
                 confirm-type="send"
                 :focus="isFocus"
                 @focus="isFocus = true"
                 @blur="isFocus = false"
                 @confirm='sendMessage' />
        </div>
        <div class="send"
             @click="sendMessage"
             v-if="messageContent.length !== 0">
          发送
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      messageContent: '',
      messageList: [],
      height: 0,
      isFocus: false,
      isChat: true
      // botname: this.isChat ? '菲菲' : '丽丽'
    }
  },
  onLoad (options) {
    wx.setNavigationBarTitle({
      title: 'ChatterBot'
    })
    this.messageList = [
      {
        flow: 'in',
        content: 'Hi! 请问需要什么帮助？'
      }
    ]
  },
  onUnload () {
    this.messageContent = ''
    wx.switchTab({
      url: '../other-function/main'
    })
  },
  computed: {
    // botname: function () { return this.isChat ? '菲菲' : '加加' },

    ...mapState({
      myInfo: state => state.user.myInfo,
      openid: state => state.student.openid,
      name: state => state.student.name,
      avatarUrl: state => state.student.avatarUrl
    })
  },
  methods: {
    scrollbottom () {
      wx.createSelectorQuery().select('#list').boundingClientRect(function (rect) {
        console.log(rect)
        wx.pageScrollTo({
          scrollTop: rect.height
        })
      }).exec()
    },
    isnull (content) {
      if (content === '') {
        return true
      }
      const reg = '^[ ]+$'
      const re = new RegExp(reg)
      return re.test(content)
    },
    // 发送text message 包含 emoji
    sendMessage () {
      if (!this.isnull(this.messageContent)) {
        this.messageList.push({ flow: 'out', content: this.messageContent })
        this.scrollbottom()
        this.$WXRequest.post({
          url: '/chatrobotapi/',
          data: {
            'openid': this.openid,
            'msg': this.messageContent,
            'isChat': this.isChat
          }
        }, false).then(
          res => {
            console.log('answer', res)
            var ans = res.replace('{br}', '。')
            this.messageList.push({ flow: 'in', content: ans })
          }
        ).then(() => {
          this.scrollbottom()
        })
        this.messageContent = ''
      } else {
        this.$store.commit('showToast', { title: '消息不能为空' })
      }
      this.isFocus = false
    },
    changeRobot () {
      // console.log(this.isChat)
      this.isChat = !this.isChat
      this.messageList = this.isChat ? ([
        {
          flow: 'in',
          content: 'Hi! 我可以和你聊天，现在开始吧'
        }
      ]) : ([
        {
          flow: 'in',
          content: 'Hi! 我可以分析你的情感，说一句话试试吧'
        }
      ])
    }
  },

  destory () { }
}
</script>

<style lang="stylus">
.custom-wrapper
  width 100%
  display flex
  flex-direction column
  justify-content center
  padding 0 12px
  box-sizing border-box
  .custom-input
    color $base
    background-color white
    border-radius 8px
    height 30px
    margin 5px 0
    box-sizing border-box
    border-bottom 1px solid $light-background
.loadMore
  font-size 14px
  color #8a8a8a
  box-sizing border-box
  width 100%
  padding 15px
  display flex
  justify-content center
.unload
  font-size 0
  color #fff
  box-sizing border-box
  width 100%
  text-align center
.emoji-open
  height calc(100vh - 262px)
.emoji-close
  height calc(100vh - 82px)
.chat
  background-color white
  box-sizing border-box
.file
  display flex
  text-align left
  width fit-content
  word-break break-all
  font-size 14px
  background-color white
  padding 10px 8px
.bottom
  background-color $background
  position fixed
  bottom 0
  left 0
  width 100%
.bottom-div
  width 100%
  display flex
  align-items center
  border-top 1px solid $border
  padding 10px
  flex-direction row
  box-sizing border-box
  transition all 0.3s
  .send
    font-size 14px
    background-color $primary
    color white
    border-radius 4px
    width 50px
    height fit-content
    padding 6px
    margin-left 12rpx
    text-align center
  .switch
    font-size 14px
    background-color $primary
    color white
    border-radius 4px
    width 50px
    height fit-content
    padding 6px
    margin-right 12rpx
    text-align center
.bottom-emoji
  position relative
  .emojis
    height 150px
    display flex
    flex-direction row
    flex-wrap wrap
    overflow-y scroll
    box-sizing border-box
    .emoji
      height 12.5vw
      width 12.5vw
      padding 8px
      box-sizing border-box
    .bigemoji
      height 20vw
      width 20vw
      padding 10px
      box-sizing border-box
.emoji-tab
  box-sizing border-box
  border-bottom 1px solid $border-base
  .tabs
    display flex
    height 29px
    flex-direction row
    padding-left 10px
    box-sizing border-box
    .single
      display flex
      margin-top 2px
      width 26px
      height 26px
      padding 2px
      border-radius 6px
      box-sizing border-box
      margin-right 8px
    .choosed
      background-color rgba(255, 255, 255, 0.7)
.bottom-image
  box-sizing border-box
  .images
    box-sizing border-box
    display flex
    padding 0 12px
    margin-top 16px
    &:last-child
      margin-bottom 16px
    .block
      box-sizing border-box
      display flex
      flex-direction column
      justify-content center
      align-items center
      margin 0 12px
      .name
        margin-top 6px
        font-size 12px
        color $secondary
        text-align center
      .image
        width 64px
        height 64px
        display flex
        justify-content center
        align-items center
        box-sizing border-box
        border-radius 8px
        background-color white
        padding 3vw
        .icon
          width 26px
          height 26px
.input
  background-color white
  border-radius 6px
  height 34px
  box-sizing border-box
  padding 0 8px
.btn-left
  display flex
  padding 0
  margin 0
  margin-right 10px
.btn
  display flex
  padding 0
  margin 0
  margin-left 10px
.button
  color white
  background-color $primary
  border-radius 8px
  height 26px
  padding 0 6px
  line-height 26px
  font-size 16px
// 添加用户当弹窗
.input-wrapper
  width 100%
  display flex
  justify-content center
li
  margin-top 18px
  padding 0 12px
.fail::before
  padding 2px 8px
  background-color $danger
  color white
  content '!'
  font-size 12px
  border-radius 50%
  cursor pointer
// @-webkit-keyframes load
// from
// transform rotate(0deg)
// to
// transform rotate(360deg)
.notice
  display flex
  justify-content center
  margin-bottom 10px
  .content
    background-color $background
    border-radius 8px
    font-size 14px
    color $regular
    padding 6px 8px
.message
  font-size 16px
  line-height 22px
  text-align left
  width fit-content
  word-break break-all
  background-color $dark-background
  padding 12px
.text-message
  display flex
  flex-direction row
  flex-wrap wrap
  white-space pre-wrap
.image-message
  max-width 180px
  border-radius 2px
.fail
  background-color transparent
.unSend
  width 12px
  height 12px
  border 4px solid $light-primary
  border-bottom $border-base 4px solid
  border-radius 50%
  -webkit-animation load 1.1s infinite linear
.item-right
  display flex
  flex-direction row
  justify-content flex-end
  height 100%
  .load
    height 100%
    width 30px
    display flex
    flex-direction column
    justify-content center
  .content
    margin-right 12px
    display flex
    flex-direction column
    align-items flex-end
    .name
      width 100%
      font-size 12px
      line-height 1
      margin-bottom 6px
      color $secondary
      text-align right
    .wrapper
      display flex
      flex-direction row
      height 100%
      .message
        background-color $primary-10
        border 1px solid $primary-30
        border-radius 8px 2px 8px 8px
.survey
  padding 20px
  background-color white
  .title
    font-size 16px
    font-weight 600
  .rate
    display flex
    flex-direction flex-start
    align-content center
    .star
      width 30px
      height 30px
    .rating
      font-weight 600
      color $regular
      line-height 30px
      padding-left 10px
  .suggestion
    padding-top 10px
    font-size 14px
    color $black
    font-weight 500
  .description
    font-size 18px
    color $black
.video
  max-height 200px
  max-width 50vw
.item-left
  display flex
  flex-direction row-reverse
  justify-content flex-end
  .content
    margin-left 10px
    .name
      width 100%
      font-size 12px
      line-height 1
      color $secondary
      margin-bottom 6px
    .message
      background-color #f8f8f8
      border 1px solid $light-background
      border-radius 2px 8px 8px 8px
// 音频解析
.box
  display flex
  height 20px
  line-height 20px
.record
  width 100%
  background-color white
  color $regular
  border-radius 6px
  box-sizing border-box
  height 34px
  line-height 34px
  display flex
  justify-content center
.record-modal
  height 150px
  width 60vw
  background-color black
  opacity 0.8
  position fixed
  top 200px
  z-index 9999
  left 20vw
  border-radius 12px
  display flex
  flex-direction column
  .wrapper
    display flex
    height 100px
    box-sizing border-box
    padding 10vw
    .modal-loading
      opacity 1
      width 20px
      height 8px
      border-radius 2px
      background-color $primary
      animation loading 2s cubic-bezier(0.17, 0.37, 0.43, 0.67) infinite
  .modal-title
    text-align center
    color white
// @-webkit-keyframes loading
// 0%
// transform translate(0,0)
// 50%
// transform translate(30vw,0)
// background-color #f5634a
// width 40px
// 100%
// transform translate(0,0)
.modal-display
  display none
.avatar
  height 40px !important
  width 40px !important
  border-radius 4px !important
.float-button-list
  position fixed
  top 12px
  right 12px
  image
    width 20px
    height 20px
    padding 7px
    box-shadow 0 0 4px gray
    background-color $background
    border-radius 50%
  .video-icon
    margin-right 6px
.re-edit
  color $primary
  line-height 30px
  font-size 14px
  margin-left 10px
</style>
