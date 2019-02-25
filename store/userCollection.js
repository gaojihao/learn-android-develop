import api from '../api/index'
import utils from '../utils'

const USER_COLLECTION_TAB_TYPE = 'USER_COLLECTION_TAB_TYPE'
const USER_COLLECTION_GROUP_FEED_LIST = 'USER_COLLECTION_GROUP_FEED_LIST'
const USER_COLLECTION_GROUP_FEED_LIST_UPDATE_ITEM = 'USER_COLLECTION_GROUP_FEED_LIST_UPDATE_ITEM'

const state = () => ({
    tabType: 1,
    groupFeedList:  {
        data: [],
        pagination: {},
    }
})

const getters = {
    groupFeedList: state => state.groupFeedList,
    tabType: state => state.tabType,
}

const actions = {

    async setTabType({commit}, params) {
        commit(USER_COLLECTION_TAB_TYPE,  params)
    },

    async getUserCollectedList({
        commit
    }, params) {

        return await api.groups.getUserCollectedList(params).then(response => {
            commit(USER_COLLECTION_GROUP_FEED_LIST,  {data: response.data, params: params})
            return response;
        })
    },

    async updateUserCollectedItem({commit}, params){
        commit(USER_COLLECTION_GROUP_FEED_LIST_UPDATE_ITEM, params )
    },
}

const mutations = {
    [USER_COLLECTION_TAB_TYPE](state, tabType) {
        state.tabType = tabType
    },

    [USER_COLLECTION_GROUP_FEED_LIST](state, commitData) {

        let pagination = utils.pagination.getPaginationByMoreSign(commitData.params, commitData.data);

        if(utils.pagination.isByPassResponse(state.groupFeedList.pagination, pagination)){
            return;
        }

        state.groupFeedList.pagination = pagination;
        state.groupFeedList.data = utils.pagination.mergePaginationData(
            pagination.currentPage, state.groupFeedList.data, commitData.data.list,  function (item) {
                //item.createTimeText =  utils.formatter.formatTime(item.createTime, 'MM-DD HH:mm')
            });
    },

    [USER_COLLECTION_GROUP_FEED_LIST_UPDATE_ITEM](state, data){
        if(data && data.update){
            data && data.update && data.update();
            state.groupFeedList.data.map(function (item, index) {
                if(index === data.index){
                    return data.item;
                }
                return item
            })
        }else if(data && data.remove){
            state.groupFeedList.data.splice(data.index, 1)
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
