<template>
  <div class="module-index">
    <i-input autofocus mode="wrapped" placeholder="请输入你想要搜索的模块名称"
      maxlength="10" @change="updateSearch"/>
    <i-cell>
      <i-card title="欢迎" extra="ヾ(•ω•`)o">
        <view slot="content">
          欢迎来到知识模块\^o^/ 在这里，你可以创建查看别人分享的知识并创建自己的知识块
        <i-button size="small" type="success" @click="handleCreate">
          <i-icon type="add" />
          创建属于你的知识模块
        </i-button>
      </view>
      </i-card>
    </i-cell>
    <i-cell-group v-for="(know_module, index) in know_modules" :key="index" >
      <i-cell v-if="know_module.seen">
        <i-card :title="know_module.title" :extra="know_module.star +'⭐'" @click="handleJump(know_module.id)" >
          <view slot="content">{{know_module.introduce}}</view>
        </i-card>
      </i-cell>
    </i-cell-group>
  </div>
</template>

<script>
export default {
  data () {
    return {
      know_modules: [],
      search: ''
    }
  },
  onShow: function () {
    this.loadAllKnowModules()
  },
  methods: {
    loadAllKnowModules () {
      this.$WXRequest.get({
        url: '/modules/'
      }).then(
        res => {
          this.know_modules = res
          console.log('kModules', res)
          this.know_modules.map(value => {
            value.seen = true
          })
        }
      )
    },
    updateSearch (event) {
      let search = event.mp.detail.detail.value
      this.search = search
      console.log(this.search)
      this.know_modules.map(value => {
        value.seen = value.title.includes(search)
      })
      console.log(this.know_modules[0].title.includes(search))
    },
    handleCreate () {
      wx.navigateTo({
        url: '../module-edit/main?id=0&create=true'
      })
    },
    handleJump (id) {
      wx.navigateTo({
        url: '../module-detail/main?id=' + id
      })
    }
  }
}
</script>

<style lang="stylus">
.collapse-item-title
  background-color aquamarine
.collapse-item-content
  padding-top 20px
  background-color black
</style>