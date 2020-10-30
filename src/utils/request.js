import WXRequest from './wx-request'

export function WXPostWithUrlAndOp (url, op = '', data = '') {
  data = { ...data }
  if (data && op) {
    data.op = op
  }
  const ret = WXRequest.post({ url, data })
  return ret
}
