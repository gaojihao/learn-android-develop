import Vue from 'vue'
export default {
    async getHomepageActionList(params) {
        return Vue.axios.get('/v1/na-uis/feed/discovery', {params : params});
    },
    async getUserNewMessages(params) {
        return Vue.axios.get('/v1/uissh/notify/isnew', {params : params});
    }
}