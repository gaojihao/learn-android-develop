import Vue from 'vue'
import {
    post,
    get
} from '../utils/service';

export default {
    async getActivityDetails(params) {
        return get('/v1/na-uis/feed/content', params)
    },
    async getMemberList(params) {
        return post('/v1/getMemberList', params)
    },
    async enroll(params) {
        return get('/v1/uissh/activity/join', params)
    },
    async zanAction(params) {
        return post('/v1/na-uis/feed/feedLike', params)
    },
    async favAction(params) {
        return post('/v1/uis/feed/blogCollect', params)
    },
    async getUserlist(params) {
        return get('/v1/uissh/activity/joinedUser', params)
    },
    async getcommentList(params) {
        return get('/v1/na-uis/feed/commentMoreH5', params)
    },
    async publishComment(params) {
        return post('/v1/uis/feed/commentPub', params)
    }
}
