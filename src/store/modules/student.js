const studentModules = {
  state: {
    openid: '',
    name: '',
    studentNo: ''
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
    }
  }

}
export default studentModules
