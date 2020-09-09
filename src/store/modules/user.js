const userModules = {
  state: {
    myInfo: {},
    userProfile: {},
    blacklist: [],
    studentNo: '',
    userId: ''
  },
  getters: {
    myInfo: state => state.myInfo,
    userProfile: state => state.userProfile,
    studentNo: state => state.studentNo,
    userId: state => state.userId
  },
  mutations: {
    updateMyInfo (state, myInfo) {
      state.myInfo = myInfo
    },
    updateUserProfile (state, userProfile) {
      state.userProfile = userProfile
    },
    setBlacklist (state, blacklist) {
      state.blacklist = blacklist
    },
    updateBlacklist (state, blacklist) {
      state.blacklist.push(blacklist)
    },
    resetUser (state) {
      state.blacklist = []
      state.userProfile = {}
      state.myInfo = {}
      state.studentNo = ''
    },
    // setStudentNo (state, studentNo) {
    //   state.studentNo = studentNo
    // },
    setUserId (state, userId) {
      state.userId = userId
    }
  }
}

export default userModules
