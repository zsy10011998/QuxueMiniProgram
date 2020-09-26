<template>
  <div class="main-container">
    <div class="member-list">
      <div v-for="(item, index) in membersinf" :key="index" class="member-card">
        <div class="image-container">
          <image v-if="item.avatarUrl" :src="item.avatarUrl" />
          <image v-else src="/static/images/avatar.png" />
        </div>
        <div class="text-container">
          <div class="student-name">{{ item.name }}</div>
          <div class="student-id">{{ item.studentNo}}</div>
        </div>
      </div>
      <!-- <div class="status-icon">{{ item.name }}</div> -->
    </div>

    <i-input
      type="text"
      title="学号"
      placeholder="新成员学号"
      maxlength="20"
      i-class="input"
      @change="updatestudetNo"
      v-if="addblock"
    />

    <button
      hover-class="clicked"
      class="login-button"
      @click="addnew"
      v-if="isCaptain"
    >{{addblock?'添加':'添加新成员'}}</button>
    <button hover-class="clicked" class="login-button" @click="disgroup" v-if="isCaptain">解散分组</button>
    <button
      hover-class="clicked"
      class="login-button"
      @click="exitgroup"
      v-if="isCaptain==false"
    >退出分组</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      hasGroup: '',
      isCaptain: '',
      isInvited: '',
      groupNo: '',
      membersinf: [],
      studentNo: '',
      addblock: false

    }
  },
  computed: {
    ...mapState({
      openid: state => state.student.openid,
      name: state => state.student.name,
      studentNo: state => state.student.studentNo
    })
  },
  beforeMount () {
    this.$set(this, 'addblock', false)
    this.$WXRequest.post({
      url: '/groupinf/',
      data: {
        openid: this.openid,
        op: 'getselfinfo'
      }
    }).then(res => {
      console.log(res)
      this.$set(this, 'hasGroup', res.hasGroup)
      this.$set(this, 'isCaptain', res.isCaptain)
      this.$set(this, 'isInvited', res.isInvited)
    })
    this.$WXRequest.post({
      url: '/groupinf/',
      data: {
        openid: this.openid,
        op: 'getmembersinfo'
      }
    }).then(res => {
      console.log(res.members)
      this.$set(this, 'membersinf', res.members)
    })
  },
  methods: {
    addnew () {
      // console.log(this.addblock)
      // console.log(this.membersinf.length)
      // console.log(this.membersinf.length >= 5)
      if (this.membersinf.length >= 5) {
        wx.showToast({
          title: '最多只能五个成员',
          during: 1500,
          icon: 'none'
        })
      } else {
        if (this.addblock === false) {
          this.addblock = true
          // this.$set(this, 'addblock', true)
        } else {
          if (this.membersinf.length >= 5) {
            wx.showToast({
              title: '最多只能五个成员',
              during: 1500,
              icon: 'none'
            })
          } else {
            this.$WXRequest.post({
              url: '/groupinf/',
              data: {
                openid: this.openid,
                op: 'addmember',
                studentNo: this.studentNo
              }
            }).then(res => {
              console.log(res)
              if (res.repCode === 200) {
                this.membersinf.push(res.newStu)
                this.$set(this, 'studentNo', '')
                this.$set(this, 'addblock', false)
                wx.showToast({
                  title: '等待学生确认',
                  duration: 1500,
                  icon: 'none'
                })
              } else if (res.repCode === 700) {
                wx.showToast({
                  title: res.errMsg,
                  duration: 1500,
                  icon: 'none'
                })
              }
            })
          }
        }
      }
    },
    updatestudetNo (event) {
      let title = event.mp.detail.detail.value
      this.$set(this, 'studentNo', title)
    },
    exitgroup () {
      this.$WXRequest.post({
        url: '/groupinf/',
        data: {
          openid: this.openid,
          op: 'exitgroup'
        }
      }).then(res => {
        if (res.repCode === 200) {
          wx.showToast({
            title: '退出成功',
            during: 1500,
            icon: 'none'
          }).then(
            wx.redirectTo({ url: '../group/main' })
          )
        }
      })
    },
    disgroup () {
      this.$WXRequest.post({
        url: '/groupinf/',
        data: {
          openid: this.openid,
          op: 'disgroup'
        }
      }).then(res => {
        if (res.repCode === 200) {
          wx.showToast({
            title: '解散成功',
            during: 1500,
            icon: 'none'
          }).then(
            wx.redirectTo({ url: '../group/main' })
          )
        }
      })
    }

  }

}
</script>

<style lang="stylus" scoped>
.main-container {
  width 100vw
  min-height: 100vh;
  position: absolute;
  background-image: url(https://cs.zhouyc.cc/images/homeProbe.png);
  background-position: center 65%;
  background-repeat: no-repeat;
  background-size: 100%;
  background-attachment: fixed;
}

button {
  width: 60vw;
  background-color: $theme-blue;
  color: white;
  font-size: 16px;
  margin: 20px auto;
  // &::before
  // width 20px
  // height 20px
  // margin 0 6px 2px 0
}

.clicked {
  background-color: $dark-blue;
}

.content {
  margin: 20px 20px;
}

.member-list {
  box-sizing: border-box;
  width: 100%;
  padding: 25rpx;
}

.member-list>.member-card {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  float: left;
  padding 10rpx
  display: flex;
  flex-direction: row;
  margin-top: 24rpx;
  background: rgba(255,255,255,.8);
}

.image-container {
  height: 120rpx;
  width: 120rpx;
  border-radius: 50%
  overflow hidden

  >>>image {
    width: 100%;
    height: 100%;
  }
}

.text-container {
  max-width: 450rpx;
  padding-left: 20rpx
}

.student-name {
  font-weight: bold
  font-size: 36rpx
}
.student-id {
  margin-top: 12rpx
  font-size: 24rpx
  color: #555
}
</style>
