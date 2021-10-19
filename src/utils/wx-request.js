import store from '../store/index'

// const host = 'https://hpla1.tustcs.com'
const host = 'https://cs.zhouyc.cc/'
// const host = 'http://127.0.0.1:8000'

function request (url, method, data, loading = true) {
  let header = { 'content-type': 'application/json' }
  let myData = {
    data: data,
    sessionId: getSessionId()
  }
  if (loading) {
    wx.showLoading({
      title: '加载中' // 数据请求前loading
    })
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url, // 仅为示例，并非真实的接口地址
      method: method,
      data: myData,
      header: header,
      success: function (res) {
        wx.hideLoading()
        resolve(res.data)
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '服务器维护',
          icon: 'none',
          duration: 1500
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  })
}
function uploadFile (obj) {
  console.log(host + obj.url)
  wx.uploadFile({
    url: host + obj.url, // 仅为示例，非真实的接口地址
    filePath: obj.filePath,
    name: 'file',
    formData: {
      'user': 'test',
      'filename': obj.name,
      'openid': obj.openid,
      'themeCode': obj.themeCode,
    },
    success (res) {
      const onOk = obj.onOk
      onOk(res)

    },
    fail (res) {
      const onError = obj.onError
      onError(res)
    },
    complete (res) {
      //console.log('complete')
    }
  })
}

function get (obj) {
  return request(obj.url, 'GET', obj.data)
}

function post (obj, loading = true) {
  return request(obj.url, 'POST', obj.data, loading)
}

function put (obj) {
  return request(obj.url, 'PUT', obj.data)
}

function deleteRequest (obj) {
  return request(obj.url, 'DELETE', obj.data)
}

var sessionIdKey = 'sessionId'
var sessionDateKey = 'sessionDate'

var SESSION_TIMEOUT = 30 * 60 * 1000

// 获取sessionId

function requestSessionId () {
  post({
    url: '/sessions',
    data: {
      username: store.state.user.username,
      password: store.state.user.password
    }
  }).then(res => {
    let sessionId = res.data.sessionId
    saveSession(sessionId)
  })
}

// 封装保存sessionId的方法，将sessionId存储在localStorage中，定为半小时之后清空此sessionId缓存

function saveSession (sessionId) {
  console.log(' now save sessionId: ' + sessionId)
  wx.setStorageSync(sessionIdKey, sessionId) // 保存sessionId
  wx.setStorageSync(sessionDateKey, Date.parse(new Date())) // 保存当前时间，
}

// 过期后清除session缓存

function removeLocalSession () {
  wx.removeStorageSync(sessionIdKey)
  wx.removeStorageSync(sessionDateKey)
  console.log('remove session!')
}

// 检查sessionId是否过期的方法

function checkSessionTimeout () {
  var sessionId = wx.getStorageSync(sessionIdKey)
  if (sessionId == null || sessionId === undefined || sessionId === '') {
    console.log('session is empty')
    return false
  }
  var sessionTime = wx.getStorageSync(sessionDateKey)
  var afterTimeStamp = Date.parse(new Date())
  if (afterTimeStamp - sessionTime >= SESSION_TIMEOUT) {
    removeLocalSession()
    return false
  }
  return true
}

// 如果sessionId过期，重新获取sessionId

function checkSessionOk () {
  console.log('check session ok?...')
  var sessionOk = checkSessionTimeout()
  if (!sessionOk) {
    requestSessionId()
  }
}

// 定义一个方法每隔一段时间检查sessionid是否过期

function checkCrossTime () {
  setInterval(checkSessionOk, 25 * 60 * 1000)// 这个时间可以自定义。比如25 * 60 * 1000（代表25分钟）
}

function getSessionId () {
  return wx.getStorageSync(sessionIdKey)
}

// https://blog.csdn.net/xuexixuexien/article/details/79281395

export default {
  request,
  uploadFile,
  get,
  post,
  put,
  deleteRequest,
  host,
  requestSessionId,
  saveSession,
  removeLocalSession,
  checkSessionTimeout,
  checkSessionOk,
  checkCrossTime,
  sessionIdKey,
  sessionDateKey,
  SESSION_TIMEOUT,
  getSessionId
}

// 调用时在 main.js 里加入
// import WXRequest from '../../utils/wx-request'
// Vue.prototype.$httpWX = WXRequest

// 调用实例
// this.$httpWX.post({
//   url: '/mms/country/queryValidZoneListForMallHome',
//   data: {
//     'categoryType': 'SaleGoodsType@sim',
//     'streamNo': 'web_bss153570682909641893',
//     'reqSource': 'MALL_H5',
//     'appId': 'string',
//     'timestamp': 1535706829096,
//     'sign': 'string'
//   }
// }).then(res => {
//   console.log(res)
// })

// https://blog.csdn.net/xiaoLP1/article/details/82388115
