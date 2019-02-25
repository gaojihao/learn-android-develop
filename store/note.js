import api from '../api/index'

const NOTE_COLLEGE_LIST = 'NOTE_COLLEGE_LIST'
const NOTE_NOTE_LIST = 'NOTE_NOTE_LIST'

const NOTE_NOTE_COLLECT = 'NOTE_NOTE_COLLECT'
const NOTE_NOTE_LIKE = 'NOTE_NOTE_LIKE'
const NOTE_NOTE_READ = 'NOTE_NOTE_READ'
const NOTE_NOTE_SEARCH = 'NOTE_NOTE_SEARCH'
const NOTE_SEARCH_HISTORY = 'NOTE_SEARCH_HISTORY'

const state = () => ({
    collegeList: [],    //笔记筛选条件
    noteList: [],       //笔记列表
    searchedNotes: [],  //笔记搜索结果
    historySearched: [],//笔记搜索历史

})

const getters = {
    collegeList: state => state.collegeList,
    noteList:  state => state.noteList,
    searchedNotes:  state => state.searchedNotes,
    historySearched:  state => state.historySearched,
}

const actions = {
    getCollegeList({commit}) {
        api.note.getCollegeTree().then(response => {
            console.log(response)
            commit(NOTE_COLLEGE_LIST,  response.data)
        })
    },

    getNoteList({commit}){
        api.note.getNoteList().then(response => {
            console.log(response)
            commit(NOTE_NOTE_LIST,  response.data)
        })
    },

    noteCollect({commit}){
        console.log('noteCollect')

        api.note.noteCollect().then(response => {
            console.log(response)
            commit(NOTE_NOTE_COLLECT,  response.data)
        })
    },

    noteLike({commit}){
        api.note.noteLike().then(response => {
            console.log(response)
            commit(NOTE_NOTE_LIKE,  response.data)
        })
    },

    noteRead({commit}){
        api.note.noteRead().then(response => {
            console.log(response)
            commit(NOTE_NOTE_READ,  response.data)
        })
    },

    noteSearch({commit}){
        api.note.noteSearch().then(response => {
            console.log(response)
            commit(NOTE_NOTE_SEARCH,  response.data)
        })
    },

    noteSearchHistory({commit}){
        api.note.noteSearchHistory().then(response => {
            console.log(response)
            commit(NOTE_SEARCH_HISTORY,  response.data)
        })
    },


}

const mutations = {
    [NOTE_COLLEGE_LIST](state, data) {
        state.collegeList = data;
    },
    [NOTE_NOTE_LIST](state, data) {
        state.noteList = data;
    },

    [NOTE_NOTE_COLLECT](state, data) {
        state.noteList = data;
    },

    [NOTE_NOTE_LIKE](state, data) {
        state.noteList = data;
    },

    [NOTE_NOTE_READ](state, data) {
        state.noteList = data;
    },

    [NOTE_NOTE_SEARCH](state, data) {
        state.searchedNotes = data;
    },

    [NOTE_SEARCH_HISTORY](state, data) {
        state.historySearched = data;
    },

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
