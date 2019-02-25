import api from '../api/index'

const LIFE_PAYMENT_DATE = 'LIFE_PAYMENT_DATE'

const state = () => ({
    lifePayment: {}
})

const getters = {
    lifePayment: state => state.lifePayment
}

const actions = {
    getLifePayment({
        commit
    }, data) {
        api.helloWorld.getLifePayment(data).then(response => {
            console.log(response)
            commit(LIFE_PAYMENT_DATE, response.data)
        })
    }
}

const mutations = {
    [LIFE_PAYMENT_DATE](state, data) {
        state.lifePayment = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
