import Vue from 'vue'
import {post,get,put} from '../utils/service';

export default {
		/*
	* 获取我的圈子信息
	* @param 
	*/
	async getMyGroup (params){
		return post('/v1/uissh/feed/user/topicOwnerlist', params)
	},
	async getJoinGroup(params){
		return get('/v1/na-uis/feed/topic/follow', params)
	},

	/*
	* 获取圈子分类列表 getGroups
	*/ 

	async  getGroupTag(params){
		return get('/v1/na-uis/feed/tags',params)
	},

	async getGroupList(param){
		return get('/v1/na-uis/feed/discovery/Category',param)
	},

    async joinGroup(param){
        return post('/v1/uissh/feed/user/followTopic',param)
    },

	/*
	* 获取圈子详情，圈子详情列表
	*/ 
	async getGroupDetail(params){
		return Vue.axios.get('/v1/na-uis/feed/topic/main',{params:params})
	},

	async getGroupDetailList(params){
		return Vue.axios.get('/v1/na-uis/feed/topic/feeds',{params:params})
	},

	/* 我的收藏 (动态， 笔记) */
	async getUserCollectedList(params){
		return Vue.axios.get('/v1/na-uis/follow/MainList', {params: params})
	},
	/*
	* 	获取动态详情
	*/
	async getTrendsDetail(params){
		return Vue.axios.get('/v1/na-uis/feed/content',{params: params})
	},

	/*
	* 	获取动态评论
	*/

	async getComments(params){
		return Vue.axios.get('/v1/na-uis/feed/commentMoreH5',{params: params})
	},


	/*
	 * 	发布动态/活动
	 */
    async publishPoster(params){
        return post('/v1/uis/feed/create', params);
    },

	/*
	* 	获取搜索结果
	*/

	async getSearchResult(params){
		return Vue.axios.get('/v1/na-uis/feed/topic/seek',{params: params})
	},

	async getSearchNotResult(param){
		return post('/v1/na-uis/feed/search/seek',param)
	},
	async getSearchGroupResult(params){
		return Vue.axios.get('/v1/na-uis/feed/topic/feeds',{params: params})
	},

	/*
	* 	置顶话题
	*/ 
	async setTop(param){
		const _params = {
            blogId: param.blogId,
            uid: param.uid,
            uname: param.uname,
            type:param.type,
            nums:param.nums
        }
		return put(`/v1/mgmt/mgmt/blog/upgrade/${param.blogId}`,_params)
	},

	/*
	* 	取消置顶
	*/ 
	async cancelTop(param){
		const _params = {
            blogId: param.blogId,
            uid: param.uid,
            uname: param.uname
        }
		return put(`/v1/mgmt/mgmt/blog/downgrade/${param.blogId}`,_params)
	},
	/*
	* 	加入圈子
	*/

	async joinGroupBtn(params){
		return post('/v1/uissh/feed/user/followTopic',params)
	},

	/*
	* 	点赞
	*/

	async Like(params){
        return post('/v1/na-uis/feed/feedLike', params);
    },

    /*
	* 	收藏
	*/
	async Collect(params){
        return post('/v1/uis/feed/blogCollect', params);
    },
    /*
	* 	创建圈子
	*/

	async creatGroup(params){
        return post('/v1/mgmt/topic', params);
    },

    /*
	* 	删除话题
	*/

	async deleteTopic(params){
        return Vue.axios.get('/v1/uis/feed/blogDelete',{params: params});
    },

    /*
	* 	评论
	*/
    async groupsComment(params){
      return post('/v1/uis/feed/commentPub', params);
    },

    /*
	* 	回复评论
	*/
    async groupsReplyComment(params){
      return post('/v1/uis/feed/replyPub', params);
    },

    /*
	* 	验证圈子是否重名
	*/
	async checkGroupName(params){
      return Vue.axios.get('/v1/uissh/feed/user/isExistTopicName', {params: params});
    },
}