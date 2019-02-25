import api from '../api'

const SET_GROUP_MATERIA = 'SET_GROUP_MATERIA'
const SET_GROUP_MEMBER_LIST = 'SET_GROUP_MEMBER_LIST'

const state = () => ({
    groupMaterial: {},
    groupMemberList: []
})

const getters = {
    groupMaterial: state => state.groupMaterial,
    groupMemberList: state => state.groupMemberList
}

const actions = {
    async getGroupMateria({
        commit
    }, data) {
        const res = await api.community.getGroupMaterial(data)
        if (res.status === 200) {
            commit(SET_GROUP_MATERIA, res.data)
        }
        return res;
    },

    async getTopicFollowList({
        commit
    }, data) {
        const res = await api.community.getTopicFollowList(data)
        if (res.status === 200) {
            if (res.data !== null) {
                commit(SET_GROUP_MEMBER_LIST, res.data.list)
            }
        }
    }
}

const mutations = {
    [SET_GROUP_MATERIA](state, data) {
        state.groupMaterial = data
    },
    [SET_GROUP_MEMBER_LIST](state, data) {
        state.groupMemberList = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
