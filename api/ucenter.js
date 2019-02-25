import Vue from 'vue'
import {post, get} from '../utils/service';

export default {
    async getMessageList(params) {
        return Vue.axios.get('/v1/uissh/notify/list', {params: params});
    },
    async notifyDetail(params) {
        return Vue.axios.get('/v1/uissh/notify/detail', {params: params});
    },
    async exchangeJwt(params) {
        return post('/v1/na-uissh/feed/login',  params);
    },
    async getFavNoteList(params) {
        return Vue.axios.get('/ucenter/getFavNoteList', {params: params});
    },
    async feedReport(params) {
        return post('/v1/uis/feed/report', params);
    },
    async feedReportTypeList() {
        return get('/v1/na-uissh/feed/reportType/list');
    }
}
