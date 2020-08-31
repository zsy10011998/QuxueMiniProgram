<template>
  <div class="edit">

    <i-cell-group>

      <i-cell>
        <i-input v-model="myModule.title" title="标题" placeholder="请输入标题"
          maxlength="10" @change="updateTitle" />
      </i-cell>

      <i-cell>
        <i-input v-model="myModule.introduce" title="介绍" type="textarea"
          maxlength="140" placeholder="请给知识模块添加一个简介吧"
          @change="updateIntroduce" />
      </i-cell>

      <i-cell>
        <i-input v-model="myModule.notice" title="公告" type="textarea"
          maxlength="50" placeholder="为知识模块发布你的公告"
          @change="updateNotice" />
      </i-cell>

    </i-cell-group>

    <div class="submit-button">
      <i-button type="success" shape="circle" @click="handleEdit" >
        <i-icon type="right" /> 发布 
      </i-button>
    </div>

  </div>
</template>
 
<script>
export default {
  data () {
    return {
      id: 0,
      isCreate: true,
      myModule: {}
    }
  },
  onLoad ({id, create}) {
    this.setId(id)
    this.setCreate(create)
  },
  onShow () {
    let id = this.id
    console.log('module-update, id=' + id)
    console.log(this.isCreate)
    if (!this.isCreate) {
      this.$WXRequest.get({
        url: '/modules/' + id + '/'
      }).then(res => {
        this.myModule = res
      })
    } else {
      this.myModule = {
        id: 0,
        title: '',
        introduce: '',
        notice: '',
        owner: 0,
        star: 0,
        head: 0,
        tail: 0
      }
    }
    this.myModule.owner = wx.store.state.user.userId
  },
  methods: {
    setId (id) {
      this.id = id
    },
    isnull (content) {
      if (content === '') {
        return true
      }
      const reg = '^[ ]+$'
      const re = new RegExp(reg)
      return re.test(content)
    },
    nullWarning (content) {
      wx.showToast({
        title: '请输入' + content,
        icon: 'none',
        duration: 2000
      })
    },
    setCreate (create) {
      this.isCreate = create !== 'false'
    },
    updateTitle (event) {
      let title = event.mp.detail.detail.value
      this.$set(this.myModule, 'title', title)
    },
    updateIntroduce (event) {
      let introduce = event.mp.detail.detail.value
      this.$set(this.myModule, 'introduce', introduce)
    },
    updateNotice (event) {
      let notice = event.mp.detail.detail.value
      this.$set(this.myModule, 'notice', notice)
    },
    handleEdit () {
      const method = this.isCreate ? this.$WXRequest.post : this.$WXRequest.put
      const urlStr = '/modules/' + (this.isCreate ? '' : (this.myModule.id + '/'))
      const dataJSON = this.myModule
      if (this.isnull(this.myModule.title)) {
        this.nullWarning('标题')
        return
      } else if (this.isnull(this.myModule.introduce)) {
        this.nullWarning('简介')
        return
      } else if (this.isnull(this.myModule.notice)) {
        this.nullWarning('公告')
        return
      }
      method({
        url: urlStr,
        data: dataJSON
      }).then(res => {
        wx.navigateBack({
          url: '../module-index/main'
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.edit
  display flex
  height 100%
  width 100%
  .text
    width 100%
  .submit-button
    position fixed
    bottom 30rpx
    width 100%
</style>