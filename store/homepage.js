import api from '../api/index'

const HOMEPAGE_ACTION_LIST = 'HOMEPAGE_ACTION_LIST'

const state = () => ({
    actionList: [],
})

const getters = {
    actionList: state => state.actionList,
}

const actions = {
    async getActionList({
        commit
    }, params) {
        return api.homepage.getHomepageActionList(params).then(response => {
            commit(HOMEPAGE_ACTION_LIST,  response.data.menu)
            return response;
        })
    }
}

const mutations = {
    [HOMEPAGE_ACTION_LIST](state, data) {
        state.actionList = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
