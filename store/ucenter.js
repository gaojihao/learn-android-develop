import api from '../api/index'
import utils from '../utils'

const UCENTER_MESSAGE_LIST = 'UCENTER_MESSAGE_LIST'
const UCENTER_MESSAGE_ITEM_UPDATE = 'UCENTER_MESSAGE_ITEM_UPDATE'

const state = () => ({
    messageList: {
        data: [],
        pagination: {},
    },
})

const getters = {
    messageList: state => state.messageList,
}

const actions = {
    async getMessageList({
        commit
    }, params) {

        return api.ucenter.getMessageList(params).then(response => {
            if(response.isMore){
                response.data.isMore = response.isMore;
            }
            commit(UCENTER_MESSAGE_LIST,  {data: response.data, params: params})
            return response;
        })
    },

    updateMessageItem({commit}, params){
        commit(UCENTER_MESSAGE_ITEM_UPDATE, params )
    },
}

const mutations = {
    [UCENTER_MESSAGE_LIST](state, commitData) {

        let pagination = utils.pagination.getPaginationByMoreSign(commitData.params, commitData.data);

        if(utils.pagination.isByPassResponse(state.messageList.pagination, pagination)){
            return;
        }

        state.messageList.pagination = pagination;
        state.messageList.data = utils.pagination.mergePaginationData(
            pagination.currentPage, state.messageList.data, commitData.data.list,  function (item) {
                item.createTimeText =  utils.formatter.formatTime(item.createTime, 'MM-DD HH:mm')
            });
    },

    [UCENTER_MESSAGE_ITEM_UPDATE](state, data){
        if(data && data.update){
            data && data.update && data.update();
            state.messageList.data.map(function (item, index) {
                if(index === data.index){
                    return data.item;
                }
                return item
            })
        }else if(data && data.remove){
            state.messageList.data.splice(data.index, 1)
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
