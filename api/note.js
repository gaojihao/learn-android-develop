import Vue from 'vue'
import {post,get} from '../utils/service';

export default {

    //获取笔记列表
    async getNoteList(params) {
        return post('/v1/na-uis/feed/search/seek',params);
    },
    //获取笔记详情
    async getNoteDetail(params){
        return Vue.axios.get('/v1/uissh/note/content', {params : params});
    },
    //获取课程筛选条件
    async getCollegeTree(){
        return get('/v1/na-uissh/collegeMajorCourse');
    },

    //获取年级筛选条件
    async getGrade(){
        return get('/v1/na-uissh/grade/list');
    },

    //笔记收藏
    async noteCollect(param){
        return post('/v1/uis/feed/blogCollect',param);
    },

    //笔记点赞
    async noteLike(params){
        return post('/v1/na-uis/feed/feedLike', params);
    },

    //笔记评论
    async noteComment(params){
      return post('/v1/uis/feed/commentPub', params);
    },

    //回复评论
    async noteReplyComment(params){
      return post('/v1/uis/feed/replyPub', params);
    },

    //更多评论
    async moreNoteComment(params){
      console.log("commentMoreH5 params = " + params)
      return Vue.axios.get('/v1/na-uis/feed/commentMoreH5', {params : params});
    },

    //笔记已读
    async noteRead(param){
        return Vue.axios.post('/v1/note/read',param);
    },

    //笔记搜索
    async noteSearch(params){
        return post('/v1/note/search',params);
    },

    //笔记搜索历史
    async noteSearchHistory(params){
        return get('/v1/note/searchHistory',params);
    },
}
