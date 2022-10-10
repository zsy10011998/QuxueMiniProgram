// timespan enum constants.
export const TIMESPAN_67 = '67'
export const TIMESPAN_89 = '89'
export const TIMESPAN_BC = 'BC'

// group status label constants.
export const STATUS_LEADER = 'leader'
export const STATUS_MEMBER = 'member'
export const STATUS_INVITED = 'invited'

// timespan map
export const TIMESPAN_MAP = {
    [TIMESPAN_67]: '第6-7小节',
    [TIMESPAN_89]: '第8-9小节',
    [TIMESPAN_BC]: '第11-12小节',
    '': '未开放选课'
}

export const TIMESPAN_SHORT_MAP = {
    [TIMESPAN_67]: '6-7',
    [TIMESPAN_89]: '8-9',
    [TIMESPAN_BC]: '11-12'
}

export const MINIMUM_MEMBERS = 5
export const MAXIMUM_MEMBERS = 6

export const FEErrorMsg = {
    INVALID_TIMESPAN: '存在不属于当前课时的成员',
    CANNOT_REMOVE_LEADER: '无法移除组长',
    CANNOT_REMOVE_BY_NON_LEADER: '您无权限删除成员',
    EXIST_NOT_ACCEPTED_INVITED: '还有成员没有接受邀请',
    CANNOT_MORE_THAN_5_MEMBERS: `成员数不能多于${MAXIMUM_MEMBERS}人`,
    CANNOT_LESS_THAN_4_MEMBERS: `成员数不能少于${MINIMUM_MEMBERS}人`
}

export const FENoticeMsg = {
    SUBMIT_TITLE: '确定提交分组',
    SUBMIT_CONTENT: '提交分组后将不能修改',
    SUBMIT_SUCCESS: '提交成功',
    DISGROUP_TITLE: '解散分组',
    DISGROUP_CONTENT: '是否解散分组',
    DISGROUP_SUCCESS: '解散成功',
    REMOVE_MEMBER_TITLE: '删除成员',
    REMOVE_MEMBER_SUCCESS: '删除成功',
    EXIT_SUCCESS: '退出成功'
}
