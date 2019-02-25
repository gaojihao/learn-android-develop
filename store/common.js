import api from '../api/index'

export const mutationTypes = {
    USER_JWT : 'USER_JWT',
    ROUTERS: 'ROUTERS',
    UID: 'UID',
    USERINFO: 'USERINFO',
    FEED_REPORT_TYPE: 'FEED_REPORT_TYPE',
    PAGINATION_LOADING : 'PAGINATION_LOADING',
}

let feedReportType = [];

const state = () => ({
    jwt: '',
    routers: [],
    uid: 1,
    userInfo: null,
    feedReportType: [],
    paginationLoading : {
        loading: false,
        allLoaded: false,
        error: false,
    },
})

const getters = {
    routers:  state => state.routers,
    uid: state => state.uid,
    userInfo: state => state.userInfo,
    feedReportType: state => state.feedReportType,
    paginationLoading: state => state.paginationLoading,
}

const mutations = {
    [mutationTypes.USER_JWT](state, jwt) {
        state.jwt = jwt
    },
    [mutationTypes.ROUTERS](state, routers) {
        state.routers = routers
    },
    [mutationTypes.UID](state, uid) {
        state.uid = uid
    },
    [mutationTypes.USERINFO](state, userInfo) {
        state.userInfo = userInfo
    },
    [mutationTypes.FEED_REPORT_TYPE](state, feedReportType) {
        state.feedReportType = feedReportType
    },

    [mutationTypes.PAGINATION_LOADING](state, paginationLoading) {
        if(paginationLoading.loading){
            paginationLoading.allLoaded = false;
            paginationLoading.error = false;
            state.paginationLoading = paginationLoading
        }else{
            for(let k in paginationLoading){
                state.paginationLoading[k] = paginationLoading[k]
            }
        }
    },
}

const actions = {
    setRoutes({commit}, routers) {
        commit(mutationTypes.ROUTERS, routers)
    },
    setUID({commit}, uid){
        commit(mutationTypes.UID, uid)
    },
    setUserInfo({commit}, userInfo){
        commit(mutationTypes.USERINFO, userInfo)
    },
    async getFeedReportType({commit}){
        if(!feedReportType.length){
            await api.ucenter.feedReportTypeList().then(response => {
                feedReportType = response.data
                commit(mutationTypes.FEED_REPORT_TYPE,  response.data)
            })
        }else{
            commit(mutationTypes.FEED_REPORT_TYPE,  feedReportType)
        }
    },

    async setPaginationLoading({commit}, params){
        commit(mutationTypes.PAGINATION_LOADING,  params)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
