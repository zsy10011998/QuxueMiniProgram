<template>
  <div class="newArticle">
    <div class="acticle-title">
      <i-input autofocus
               mode="wrapped"
               placeholder="请输入知识块标题"
               maxlength="10"
               @change="handleTitle" />
    </div>

    <div class="article-edit">
      <div class="article-main">
        <div class='toolbar'
             @click="format">
          <i v-if="config.bold"
             :class="'iconfont icon-zitijiacu ' + (formats.bold ? 'ql-active' : '')"
             data-name="bold"></i>
          <i v-if="config.italic"
             :class="'iconfont icon-zitixieti ' + (formats.italic ? 'ql-active' : '')"
             data-name="italic"></i>
          <i v-if="config.underline"
             :class="'iconfont icon-zitixiahuaxian ' + (formats.underline ? 'ql-active' : '')"
             data-name="underline"></i>
          <i v-if="config.strike"
             :class="'iconfont icon-zitishanchuxian ' + (formats.strike ? 'ql-active' : '')"
             data-name="strike"></i>
          <i v-if="config.alignLeft"
             :class="'iconfont icon-zuoduiqi ' + (formats.align === 'left' ? 'ql-active' : '')"
             data-name="align"
             data-value="left"></i>
          <i v-if="config.alignCenter"
             :class="'iconfont icon-juzhongduiqi  ' + (formats.align === 'center' ? 'ql-active' : '')"
             data-name="align"
             data-value="center"></i>
          <i v-if="config.alignRight"
             :class="'iconfont icon-youduiqi  ' + (formats.align === 'right' ? 'ql-active' : '')"
             data-name="align"
             data-value="right"></i>
          <i v-if="config.justify"
             :class="'iconfont icon-zuoyouduiqi  ' + (formats.align === 'justify' ? 'ql-active' : '')"
             data-name="align"
             data-value="justify"></i>
          <i v-if="config.lineHeight"
             :class="'iconfont icon-line-height ' + (formats.lineHeight ? 'ql-active' : '')"
             data-name="lineHeight"
             data-value="2"></i>
          <i v-if="config.letterSpacing"
             :class="'iconfont icon-Character-Spacing  ' + (formats.letterSpacing ? 'ql-active' : '')"
             data-name="letterSpacing"
             data-value="2em"></i>
          <i v-if="config.marginTop"
             :class="'iconfont icon-722bianjiqi_duanqianju ' + (formats.marginTop ? 'ql-active' : '')"
             data-name="marginTop"
             data-value="20px"></i>
          <i v-if="config.marginBottom"
             :class="'iconfont icon-723bianjiqi_duanhouju ' + (formats.micon-previewarginBottom ? 'ql-active' : '')"
             data-name="marginBottom"
             data-value="20px"></i>
          <i v-if="config.removeFormat"
             class="iconfont icon-clearedformat"
             @click="removeFormat"></i>
          <i v-if="config.fontFamily"
             :class="'iconfont icon-font ' + (formats.fontFamily ? 'ql-active' : '')"
             data-name="fontFamily"
             data-value="Pacifico"></i>
          <i v-if="config.fontSize"
             :class="'iconfont icon-fontsize ' + (formats.fontSize === '24px' ? 'ql-active' : '')"
             data-name="fontSize"
             data-value="24px"></i>

          <i v-if="config.color"
             :class="'iconfont icon-text_color ' + (formats.color === '#0000ff' ? 'ql-active' : '')"
             data-name="color"
             data-value="#0000ff"></i>
          <i v-if="config.backgroundColor"
             :class="'iconfont icon-fontbgcolor ' + (formats.backgroundColor === '#00ff00' ? 'ql-active' : '')"
             data-name="backgroundColor"
             data-value="#00ff00"></i>

          <i v-if="config.insertDate"
             class="iconfont icon-date"
             @click="insertDate"></i>
          <i v-if="config.listCheck"
             class="iconfont icon--checklist"
             data-name="list"
             data-value="check"></i>
          <i v-if="config.listOrdered"
             :class="'iconfont icon-youxupailie ' + (formats.list === 'ordered' ? 'ql-active' : '')"
             data-name="list"
             data-value="ordered"></i>
          <i v-if="config.listBullet"
             :class="'iconfont icon-wuxupailie ' + (formats.list === 'bullet' ? 'ql-active' : '')"
             data-name="list"
             data-value="bullet"></i>
          <i v-if="config.undo"
             class="iconfont icon-undo"
             @click="undo"></i>
          <i v-if="config.redo"
             class="iconfont icon-redo"
             @click="redo"></i>

          <i v-if="config.indentReduce"
             class="iconfont icon-outdent"
             data-name="indent"
             data-value="-1"></i>
          <i v-if="config.indentAdd"
             class="iconfont icon-indent"
             data-name="indent"
             data-value="+1"></i>
          <i v-if="config.insertDivider"
             class="iconfont icon-fengexian"
             @click="insertDivider"></i>
          <i v-if="config.insertImage"
             class="iconfont icon-charutupian"
             @click="insertImage"></i>
          <i v-if="config.header"
             :class="'iconfont icon-format-header-1  ' + (formats.header === 1 ? 'ql-active' : '')"
             data-name="header"
             data-value="1"></i>
          <i v-if="config.scriptSub"
             :class="'iconfont icon-zitixiabiao  ' + (formats.script === 'sub' ? 'ql-active' : '')"
             data-name="script"
             data-value="sub"></i>
          <i v-if="config.scriptSuper"
             :class="'iconfont icon-zitishangbiao  ' + (formats.script === 'super' ? 'ql-active' : '')"
             data-name="script"
             data-value="super"></i>
          <!-- <i class="iconfont icon-quanping"></i> -->
          <i v-if="config.clear"
             class="iconfont icon-shanchu"
             @click="clear"></i>
          <i v-if="config.direction"
             :class="'iconfont icon-direction-rtl  ' + (formats.direction === 'rtl' ? 'ql-active' : '')"
             data-name="direction"
             data-value="rtl"></i>
        </div>
        <editor id="editor"
                class="ql-container"
                :placeholder="placeholder"
                showImgSize
                showImgToolbar
                showImgResize
                @statuschange="onStatusChange"
                @ready="onEditorReady"
                @input="onInput">
        </editor>

      </div>
    </div>
    <i-button class="button"
              @click="handleEdit"
              type="success"
              shape="circle">发布</i-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      main: '',
      isCreate: true,
      placeholder: '请输入知识块的内容',
      editorCtx: null,
      formats: {},
      config: { /** 配置粗体 */
        bold: true,
        italic: true,
        underline: true,
        strike: true,
        alignLeft: false,
        alignCenter: false,
        alignRight: false,
        justify: false,
        lineHeight: true,
        letterSpacing: true,
        marginBottom: true,
        removeFormat: true,
        fontFamily: false,
        fontSize: true,
        color: true,
        backgroundColor: true,
        insertDate: true,
        listCheck: false,
        listOrdered: true,
        listBullet: true,
        undo: true,
        redo: true,
        indentReduce: false,
        indentAdd: false,
        insertDivider: false,
        insertImage: false,
        header: false,
        scriptSub: false,
        scriptSuper: false,
        clear: false,
        direction: false
      },
      myBlock: {
        id: 0,
        title: '',
        number: 1,
        content: '',
        owner: 0,
        module: 0,
        star: 0,
        prev: 0,
        next: 0
      }
    }
  },
  methods: {
    format (e) {
      console.log('format')
      console.log(e)
      let { name, value } = e.target.dataset
      if (!name) return
      this.editorCtx.format(name, value)
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
    onEditorReady () {
      console.log('onEditorReady')
      const that = this
      wx.createSelectorQuery().select('#editor').context(function (res) {
        that.editorCtx = res.context
        console.log(that.editorCtx)
      }).exec()
      that.editorCtx.setContents({
        html: '<html><body><p>Hello<p></body></html>',
        success: (res) => {
          console.log('editor set content success', res)
        },
        fail: (res) => {
          console.log('editor set content fail', res)
        }
      })
    },
    onStatusChange (e) {
      this.formats = e.mp.detail
    },
    onInput (e) {
      console.log('intput')
      console.log(this.myBlock)
      this.myBlock.content = e.mp.detail.html
    },
    removeFormat () {
      this.editorCtx.removeFormat()
    },
    insertDate () {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate
      })
    },
    undo () {
      this.editorCtx.undo()
    },
    redo () {
      this.editorCtx.redo()
    },
    insertDivider () {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success')
        }
      })
    },
    clear () {
      this.editorCtx.clear({
        success: function (res) {
          console.log('clear success')
        }
      })
    },
    insertImage () {
      const that = this
      wx.chooseImage({
        count: 1,
        success: function () {
          that.editorCtx.insertImage({
            src: '',
            data: {
              id: 'abcd',
              role: 'god'
            },
            success: function () {
              console.log('insert image success')
            }
          })
        }
      })
    },
    handleEdit () {
      console.log('发布')
      const method = this.isCreate ? this.$WXRequest.post : this.$WXRequest.put
      const urlStr = '/modules/' + this.myBlock.module + '/blocks/' + (this.isCreate ? '' : (this.myBlock.id + '/'))
      const dataJSON = this.myBlock
      if (this.isnull(this.myBlock.title)) {
        this.nullWarning('标题')
        return
      } else if (this.isnull(this.myModule.content)) {
        this.nullWarning('内容')
        return
      }
      method({
        url: urlStr,
        data: dataJSON
      }).then(res => {
        wx.navigateBack({
          url: '../module-detail/main?id=' + this.myBlock.module
        })
      })
    },
    handleTitle (e) {
      this.myBlock.title = e.mp.detail.detail.value
    }
  },
  onLoad ({ mid, id, create }) {
    this.isCreate = create !== 'false'
    this.myBlock.module = mid
    if (!this.isCreate) {
      this.$WXRequest.get({
        url: '/modules/' + mid + '/blocks/' + id + '/'
      }).then(res => {
        this.myBlock = res
      })
    }
    this.myBlock.owner = wx.store.state.user.userId
  },
  onShow () {
    console.log('onShow')
  },
  /** 页面加载完成时调用函数 */
  mounted () {
    console.log('mounted')
    console.log(wx.api)
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      console.log(that.editorCtx)
    }).exec()
  }
}
</script>

<style scoped>
@import url("./iconfont.css");
.newArticle {
  height: 100%;
}
.button {
  position: fixed;
  bottom: 30rpx;
  width: 100%;
}
.wrapper {
  padding: 5px;
}
.iconfont {
  display: inline-block;
  padding: 8px 12px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 20px;
}
.toolbar {
  box-sizing: border-box;
  /* border: 1px solid #ccc; */
  border-bottom: 0;
  font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
}
.ql-active {
  color: #06c;
}
.ql-container {
  box-sizing: border-box;
  padding: 12px 0px;
  width: 100%;
  height: auto;
  border-top: 1px solid #ccc;
  font-size: 16px;
  line-height: 1.5;
}
</style>
