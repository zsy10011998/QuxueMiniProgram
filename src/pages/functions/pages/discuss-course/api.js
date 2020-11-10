import { WXPostWithUrlAndOp } from '../../../../utils/request'

const APIURL_GROUP = '/getTopics/'

const WXAPI = async (url, op, data, loading = true) => {
  const ret = await WXPostWithUrlAndOp(url, op, data, loading)
  const { repCode } = ret
  return new Promise((resolve, reject) => {
    if (!repCode || repCode === 200) {
      resolve(ret)
    } else {
      reject(ret)
    }
  })
}

export const GetSelfDiscussCourseInfoAPI = (data) => {
  const ret = WXAPI(APIURL_GROUP, '', data)
  return ret
}
