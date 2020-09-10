const studentModules = {
  state: {
    openid: '',
    name: '',
    studentNo: '',
    avatarUrl: ''
  },
  mutations: {
    setOpenId (state, openid) {
      state.openid = openid
    },
    setName (state, name) {
      state.name = name
    },
    setStudentNo (state, studentNo) {
      state.studentNo = studentNo
    },
    setAvatarUrl (state, avatarUrl) {
      state.avatarUrl = avatarUrl
    }
  }

}
export default studentModules
