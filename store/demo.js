import api from '../api'
import utils from '../utils'

const SET_ITEMS = 'SET_ITEMS'

const state = () => ({
    items: []
})

const getters = {
    items: state => state.items
}

const actions = {
    getItems({
        commit
    }, data) {
        api.demo.getItems(data).then(response => {
            commit(SET_ITEMS, response.data)
        })
    }
}

const mutations = {
    [SET_ITEMS](state, data) {
        data.map(item => {
            item.createTimeText = utils.formatter.formatTimeChinese(item.createTime)
        })
        state.items = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
