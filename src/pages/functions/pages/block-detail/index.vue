<template>
  <div class="block-detail">

    <i-panel>
      <i-divider :content="block.title" color="#35495E" lineColor="#35495E" size="20"></i-divider>
    
      <view class="show-rich">
        <rich-text :nodes="block.content"></rich-text>
      </view>
    </i-panel>

    <div class="comment">
      <i-panel style="padding: 15px">
        <i-cell-group class="comments" v-for="(comment, index) in comments" :key="index" >
          <i-cell>
            <text> {{comment.content}} </text>
            <text slot="footer">{{comment.username}}</text>
            <i-icon v-if="comment.owner === user" 
              slot="icon" type="delete" size="20" @click="handleDelete(comment.id, index)"/>
            <i-icon v-else slot="icon" type="emoji" size="20" />
          </i-cell>
        </i-cell-group>
      </i-panel>
    </div>

    <div class="comment-input">
      <i-row>
        <i-col span="18">
          <i-input v-model=newComment placeholder="友善的评论是交流的起点" maxlength="50" @change="setNewComment"/>
        </i-col>
        <i-col span="3">
          <i-button @click="handleCreateComment" shape="circle" type="success" size="small" long>
            <i-icon type="right" />
          </i-button>
        </i-col>
        <i-col span="3">
          <i-button open-type="share" shape="circle" type="success" size="small" long>
            <i-icon type="share" />
          </i-button>
        </i-col>
      </i-row>
    </div>
  
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: 1,
      newComment: '',
      block: {},
      comments: [],
      like: false,
      mid: 0
    }
  },
  onLoad: function ({mid, id}) {
    this.setUser()
    this.loadBlock(mid, id)
    this.loadAllComments(id)
  },
  onShareAppMessage: function () {
    return {
      title: '知识分享',
      path: '/pages/functions/pages/block-detail/main?mid=' + this.mid + '&id=' + this.block.id
    }
  },
  methods: {
    setUser () {
      this.user = wx.store.state.user.userId
    },
    setNewComment (e) {
      this.newComment = e.mp.detail.detail.value
    },
    handleCreateComment () {
      if (this.newComment === '') {
        wx.showToast({
          title: '请输入评论',
          icon: 'none',
          duration: 2000
        })
        return
      }
      const dataJSON = {
        content: this.newComment,
        owner: this.user,
        block: this.block.id
      }
      this.$WXRequest.post({
        url: '/blocks/' + this.block.id + '/comments/',
        data: dataJSON
      }).then(
        res => {
          this.comments.push(res)
          console.log('comments', this.comments)
          this.newComment = ''
          this.$set(this.newComment, '')
        }
      )
    },
    handleDelete (id, index) {
      this.$WXRequest.deleteRequest({
        url: '/blocks/' + this.block.id + '/comments/' + id + '/'
      }).then(
        res => {
          this.$delete(this.comments, index)
          console.log('comments', this.comments)
        }
      )
    },
    handleLike () {
      this.myModule.star += 1
      const combine = item => item.join('=')
      const dataStr = Object.entries(this.myModule).map(combine).join('&')
      console.log(dataStr)
      this.$WXRequest.put({
        url: '/modules/' + this.myModule.id + '/',
        data: dataStr
      }).then(
        res => {
          console.log('module', this.myModule)
        }
      )
    },
    loadBlock (mid, id) {
      this.mid = mid
      this.$WXRequest.get({
        url: '/modules/' + mid + '/blocks/' + id + '/'
      }).then(
        res => {
          this.block = res
        }
      )
    },
    loadAllComments (id) {
      this.$WXRequest.get({
        url: '/blocks/' + id + '/comments/'
      }).then(
        res => {
          this.comments = res
        }
      )
    }
  }
}
</script>

<style lang="stylus" scoped>
.block-detail
  .comments
    padding-top 40rpx
    bottom 50rpx
  .comment-input
    position fixed
    bottom 0rpx
    width 100%
</style>