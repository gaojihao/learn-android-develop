import {get, post} from '../utils/service';

export default{
    async getPersonalInfo(params){
        return get('/v1/na-uis/social/UserDetail', params)
    },

    async getMemberInfo(params) {
        return  get('/v1/uis/social/MemberInfo', params)
    },

    async getPersonalPush(params){
        return get('/v1/na-uis/follow/MainList', params)
    },

    async blogDelete(params){
        return get('/v1/uis/feed/blogDelete',  params);
    },

    async blogLike(params){
        return post('/v1/na-uis/feed/blogLike',  params);
    }
}

