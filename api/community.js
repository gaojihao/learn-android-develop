import Vue from 'vue'
import {
    post,
    get,
    put
} from '../utils/service';

export default {
    async getAttornAuthorityList(params) {
        return post('/v1/uissh/feed/user/topicFollowList', params)
    },
    async getFollowUnderAnditList(params) {
        return post('/v1/uissh/feed/user/followUnderAnditList', params)
    },
    async getTopicFollowList(params) {
        return post('/v1/uissh/feed/user/topicFollowList', params)
    },
    async getUserlist(param) {
        return post('/v1/getUserlist', param)
    },
    async banndeUser(param) {
        return post('/v1/banndeUser', param)
    },
    async deleteUser(params) {
        return post('/v1/uissh/feed/user/removeTopicFollow', params)
    },
    async downline(params) {
        const _params = {
            uid: params.uid,
            uname: params.uname
        }
        return post(`/v1/mgmt/topic/${params.topicId}/disable`, _params)
    },
    async dissolve(params) {
        return post('/v1/uissh/feed/user/dismiss', params)
    },
    async groupAttornAuthority(params) {
        return post('/v1/uissh/feed/user/transferTopic', params)
    },
    async agree(params) {
        return post('/v1/uissh/feed/user/followTopicAudit', params)
    },
    async getActivityList(params) {
        return get('/v1/na-uis/feed/topic/feeds', params)
    },
    async rejectActivity(params) {
        const _params = {
            uid: params.uid,
            uname: params.uname,
            reason: params.reason
        }
        return post(`/v1/mgmt/mgmt/blog/content/${params.id}/offline`, _params)
    },
    async agreeActivity(params) {
        const _params = {
            uid: params.uid,
            uname: params.uname
        }
        return post(`/v1/mgmt/mgmt/blog/content/${params.id}/online`, _params)
    },
    async getGroupMaterial(params) {
        return get('/v1/na-uis/feed/topic/main', params)
    },
    async getMenu(params) {
        return get('/v1/na-uis/feed/tags', params)
    },
    async getGroupMemberList(param) {
        return post('/v1/groupMemberList', param)
    },
    async exitGroup(params) {
        return post('/v1/uis/feed/user/followTopic', params)
    },
    async getHomePageList(param) {
        return post('/v1/homePageList', param)
    },
    async getTopicActivityAuditCount(param) {
        return post('/v1/uissh/feed/user/topicActivityAuditCount', param)
    },
    async isAgreeJoin(params) {
        const _params = {
            auditFlag: params.auditFlag,
            uid: params.uid,
            uname: params.uname
        }
        return put(`/v1/mgmt/topic/${params.topicId}`, _params)
    },
    async editIntroduce(params) {
        const _params = {
            description: params.description,
            uid: params.uid,
            uname: params.uname
        }
        return put(`/v1/mgmt/topic/${params.topicId}`, _params)
    },
    async editNotice(params) {
        const _params = {
            announcement: params.announcement,
            uid: params.uid,
            uname: params.uname
        }
        return put(`/v1/mgmt/topic/${params.topicId}`, _params)
    },

    async editGroupHeadUrl(params) {
        return put(`/v1/mgmt/topic/${params.topicId}`, params)
    },

    async editGroupCoverUrl(params) {
        return put(`/v1/mgmt/topic/${params.topicId}`, params)
    }
}
