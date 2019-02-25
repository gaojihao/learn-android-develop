import api from '../api'

const SET_GROUP_MEMBER_LIST = 'SET_GROUP_MEMBER_LIST'
const SET_ACTIVITY_DETAILS = 'SET_ACTIVITY_DETAILS'
const SET_COMMENT_LIST = 'SET_COMMENT_LIST'

const state = () => ({
    activityDetails: {},
    groupMemberList: [],
    commentList: []
})

const getters = {
    activityDetails: state => state.activityDetails,
    groupMemberList: state => state.groupMemberList,
    commentList: state => state.commentList
}

const actions = {
    async getGroupMemberList({
        commit
    }, data) {
        const res = await api.activity.getUserlist(data)
        if (res.status === 200) {
            commit(SET_GROUP_MEMBER_LIST, res.data.list)
        }
    },

    async getActivityDetails({
        commit
    }, data) {
        const res = await api.activity.getActivityDetails(data)
        if (res.status === 200) {
            commit(SET_ACTIVITY_DETAILS, res.data)
            return res.data
        }
    },

    async getcommentList({
        commit
    }, data) {
        const res = await api.activity.getcommentList(data)
        if (res.status === 200) {
            commit(SET_COMMENT_LIST, res.data)
        }
    },
}

const mutations = {
    [SET_GROUP_MEMBER_LIST](state, data) {
        state.groupMemberList = data
    },
    [SET_ACTIVITY_DETAILS](state, data) {
        state.activityDetails = data
    },
    [SET_COMMENT_LIST](state, data) {
        state.commentList = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
