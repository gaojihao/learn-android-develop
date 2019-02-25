import api from '../api'
import utils from '../utils'

const PERSONAL_INFO = 'PERSONAL_INFO'
const PERSONAL_PUBLISH_LIST = 'PERSONAL_PUBLISH_LIST'
const PERSONAL_PAGINATION = 'PERSONAL_PAGINATION'
const PERSONAL_UPDATE_BLOGITEM = 'PERSONAL_UPDATE_BLOGITEM'

const state = ()=> ({
    personalInfo:{},
    personalPublishList: {
        data: [],
        pagination: {},
    },
})

const getters = {          //缓存数据
    personalInfo: state => state.personalInfo,
    personalPublishList:  state => state.personalPublishList,
}

const actions = {
    async getPersonalInfo({commit},data){
        return await api.personal.getPersonalInfo().then(response => {
            commit(PERSONAL_INFO, response.data)
        })
    },
    async getPersonalPush({commit}, params){
         return await api.personal.getPersonalPush(params).then(response => {
             commit(PERSONAL_PUBLISH_LIST, {data: response.data, params: params})
         })
    },
    updateItem({commit}, params){
        commit(PERSONAL_UPDATE_BLOGITEM, params )
    },
}
const mutations = {
    [PERSONAL_INFO](state,data){
        state.personalInfo = data
    },
    [PERSONAL_PUBLISH_LIST](state, commitData){

        let pagination = utils.pagination.getPaginationByMoreSign(commitData.params, commitData.data);

        if(utils.pagination.isByPassResponse(state.personalPublishList.pagination, pagination)){
           return;
        }

        state.personalPublishList.pagination = pagination
        state.personalPublishList.data =  utils.pagination.mergePaginationData(
            pagination.currentPage, state.personalPublishList.data, commitData.data.list,  function (item) {
                item.publishTimeText =  utils.formatter.formatTime(item.publishTime, 'YYYY-MM-DD');
                if(item.pics){
                    item.gallaryImageList =item.pics.map(function (p) {
                        return p.name;
                    })
                }
            });
    },
    [PERSONAL_UPDATE_BLOGITEM](state, data){
        if(data && data.update){
            data && data.update && data.update();
            state.personalPublishList.data.map(function (item, index) {
                if(index === data.index){
                    return data.item;
                }
                return item
            })
        }else if(data && data.remove){
            state.personalPublishList.data.splice(data.index, 1)
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
