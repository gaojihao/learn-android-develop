import api from '../api/index'
import utils from '../utils'
import { Toast} from 'mint-ui';

const GROUPS_CREATED_GROUP = 'GROUPS_CREATED_GROUP'
const GROUPS_JOIN_GROUP = 'GROUPS_JOIN_GROUP'
const GROUPS_ADD_JOIN_GROUP = 'GROUPS_ADD_JOIN_GROUP'
const GROUPS_GROUPS = 'GROUPS_GROUPS'
const GROUPS_GROUPS_LIST = 'GROUPS_GROUPS_LIST'
const GROUPS_GROUPS_INDEX_TYPE = 'GROUPS_GROUPS_INDEX_TYPE'
const GROUPS_UPDATE_GROUP_LIST = 'GROUPS_UPDATE_GROUP_LIST'


const state = () => ({
    createdGroup: [],
    joinGroup: [],
    groups: [],
    groupList: [],
    groupIndexType: 1,
})

const getters = {
    createdGroup: state => state.createdGroup,
    joinGroup: state => state.joinGroup,
    groups: state => state.groups,
    groupList: state => state.groupList,
    groupIndexType: state => state.groupIndexType,
}

const actions = {
    async getCreatedGroup({commit}, params) {
        commit(GROUPS_CREATED_GROUP,  [])
        return await api.groups.getMyGroup(params).then(response => {
            if(response.status === 200){
                commit(GROUPS_CREATED_GROUP,  response.data)
            }
        }).catch(function (err) {
            if(err){
                Toast(err);
            }
        })
    },

    async getJoinGroup({commit}, params) {

        return await api.groups.getJoinGroup(params).then(response => {
            if(response.status === 200){
                commit(GROUPS_JOIN_GROUP,  response.data)
            }
        }).catch(function (err) {
            if(err){
                Toast(err);
            }
        })
    },

    async getGroupTag({commit}, params) {
        return await api.groups.getGroupTag(params).then(response => {
            if(response.status === 200){
                commit(GROUPS_GROUPS,  response.data)
            }
        }).catch(function (err) {
            if(err){
                Toast(err);
            }
        })
    },

    async getGroupListByTag({commit}, params) {
        return await api.groups.getGroupList(params).then(response => {
            if(response.status === 200){
                commit(GROUPS_GROUPS_LIST,  response.data)
            }
        }).catch(function (err) {
            if(err){
                Toast(err);
            }
        })
    },

    setGroupIndexType({commit}, params){
        commit(GROUPS_GROUPS_INDEX_TYPE,  params)
    },

    async joinGroup({commit},  params){
        return api.groups.joinGroup(params).then(response => {
            if(response.status === 200){
                commit(GROUPS_UPDATE_GROUP_LIST,  {
                    item: response.data,
                    index: params.index,
                    update: function (newItem, stateItem) {
                        stateItem.auditStatus = newItem.auditStatus
                    }
                })

                console.log('test')
                //当已经加入的时候，增加到我加入的圈子里
                if(response.data.auditStatus == 1){
                    commit(GROUPS_ADD_JOIN_GROUP,  response.data.commonTopic)
                }
            }
            return response;
        }).catch(function (err) {
        })
    },
}

const mutations = {
    [GROUPS_CREATED_GROUP](state, data) {
        state.createdGroup = data;
    },
    [GROUPS_JOIN_GROUP](state, data) {
        state.joinGroup = data;
    },
    [GROUPS_ADD_JOIN_GROUP](state, addGroup) {
        state.joinGroup.push(addGroup);
    },
    [GROUPS_GROUPS](state, data) {
        state.groups = data.list;
    },
    [GROUPS_GROUPS_LIST](state, data) {
        state.groupList = data.recommendTopic;
    },
    [GROUPS_GROUPS_INDEX_TYPE](state, data) {
        state.groupIndexType = data
    },
    [GROUPS_UPDATE_GROUP_LIST](state, data) {
        state.groupList.map(function (item, index) {
            if(index === data.index){
                data.update(data.item, item);
            }else{
                return item;
            }
        })
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
