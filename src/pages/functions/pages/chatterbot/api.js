import { WXPostWithUrlAndOp } from '../../../../utils/request'

const APIURL_CHATBOT = '/chatrobotapi/'

export const GetMessageHistoryAPI = (data, loading = false) => {
  const ret = WXPostWithUrlAndOp(APIURL_CHATBOT, 'get', data, loading)
  return ret
}

export const SendMessageAPI = (data, loading = false) => {
    const ret = WXPostWithUrlAndOp(APIURL_CHATBOT, 'send', data, loading)
    return ret
}
