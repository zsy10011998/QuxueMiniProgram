import WXRequest from '../../../../utils/wx-request'

function WXPostWithUrlAndOp (url, op = '', data = '') {
  data = { ...data }
  if (data && op) {
    data.op = op
  }
  const ret = WXRequest.post({ url, data })
  return ret
}

const APIURL_GROUP = '/groupinf/'

export const GetSelfInfoAPI = (data) => {
  const ret = WXPostWithUrlAndOp(APIURL_GROUP, 'getselfinfo', data)
  return ret
}

export const CreateGroupAPI = (data) => {
  const ret = WXPostWithUrlAndOp(APIURL_GROUP, 'creategroup', data)
  return ret
}

export const GetInvitationAPI = (data) => {
  const ret = WXPostWithUrlAndOp(APIURL_GROUP, 'getinvitation', data)
  return ret
}

export const AcceptInvitationAPI = (data) => {
  const ret = WXPostWithUrlAndOp(APIURL_GROUP, 'allowinvitation', data)
  return ret
}

export const RejectInvitationAPI = (data) => {
  const ret = WXPostWithUrlAndOp(APIURL_GROUP, 'rejectinvitation', data)
  return ret
}
