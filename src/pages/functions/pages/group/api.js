import { WXPostWithUrlAndOp } from '../../../../utils/request'

const APIURL_GROUP = '/groupinf/'

export const GetSelfGroupInfoAPI = (data) => {
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

export const GetGroupMembersAPI = (data) => {
  const ret = WXPostWithUrlAndOp(APIURL_GROUP, 'getmembersinfo', data)
  return ret
}

export const AddGroupMemberAPI = (data) => {
  const ret = WXPostWithUrlAndOp(APIURL_GROUP, 'addmember', data)
  return ret
}

export const ExitGroupAPI = (data) => {
  const ret = WXPostWithUrlAndOp(APIURL_GROUP, 'exitgroup', data)
  return ret
}

export const RemoveMemberAPI = (data) => {
  const ret = WXPostWithUrlAndOp(APIURL_GROUP, 'removemember', data)
  return ret
}

export const DisGroupAPI = (data) => {
  const ret = WXPostWithUrlAndOp(APIURL_GROUP, 'disgroup', data)
  return ret
}

export const SubmitGroupAPI = (data) => {
  const ret = WXPostWithUrlAndOp(APIURL_GROUP, 'submitgroup', data)
  return ret
}

export const GetGroupsInfoAPI = (data) => {
  const ret = WXPostWithUrlAndOp(APIURL_GROUP, 'getgroupsinfo', data)
  return ret
}
