<template>
    <div class="personal-release">
            <header-top :name="this.name"></header-top>
            <div class="release">
               <mt-loadmore :top-method="loadTop" :auto-fill="false" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"  bottomPullText="" ref="loadmore">
                    <div class="release-cnt" v-for="(item,index) in personalPublishList.data" :key="item.id" @click="getDetail(item.feedType, item.feedId)">
                        <div class="release-tx">
                           <div class="release-img" @click.stop="toUserProfile(uid)"><img class="avatar" v-lazy="item.author.avatar" ></div>
                           <div class="release-name">
                               <p>{{item.author.nickName}}</p>
                               <p class="txt-color time">{{item.publishTimeText}}</p>
                           </div>
                           <div v-if="item.feedType == 'uge'" class="release-activity-img"><img src="~assets/images/activity.png" /></div>
                       </div>
                        <div class="release-info" v-if="item.feedType == 'ugc'">
                           <div class="release-title">{{item.title}}</div>
                           <div>
                               <img v-for="(pic, j) of item.pics" :key="pic.name" v-lazy="pic.name" />
                           </div>
                       </div>
                        <div class="release-activity" v-if="item.feedType == 'uge'">
                           <p class="release-activity-title">{{item.title}}</p>
                           <p>活动时间：{{item.publishTimeText}}</p>
                           <p>地点：{{item.previewText}}</p>
                           <div class="release-activity-status" v-if="item.status==0">审核中</div>
                        </div>
                        <div class="release-btn">
                           <span @click.stop="toAllComment(item)" class="release-comment"><img src="~assets/images/comment.png"><i class="txt-color">{{item.commentTotal}}</i></span>
                           <span class="release-zan" @click.stop="blogLike(item,index)">
                               <img v-if="!item.likeStatus" src="~assets/images/zan_f.png" ref="img_zan">
                               <img v-if="item.likeStatus" class="animated likeIt" src="~assets/images/zan_fl.png" ref="img_zan" style="color: #ff8309">
                               <i ref="t_zan" class="txt-color">{{item.likeTotal}}</i>
                           </span>
                           <span class="release-more" @click.stop="showMore(item, index)"><img src="~assets/images/more.png"></span>
                        </div>
                   </div>
                   <div v-if="!personalPublishList || !personalPublishList.data.length">
                       <no-content :content="myNoContent"  v-if="isMyself">
                           <button class="btn-publish" @click="toPublish">去发布</button>
                       </no-content>
                       <no-content :content="noContent" v-if="!isMyself"></no-content>
                   </div>
               </mt-loadmore>
            </div>
            <fade>
              <gallary :imgs="sheetData.gallaryImageList" v-if="showGallary && sheetData" :activeIndex="activeIndex" @close="handleGallaryClose"></gallary>
            </fade>

           <mt-actionsheet cancel-text="取消" :actions="actions" v-model="sheetVisible"></mt-actionsheet>
           <complain v-if="sheetData" :propShow="showBlogComplain" type="1" :blogId="sheetData.contentId" :refId="sheetData.contentId" complainStyle="x" @hide="showBlogComplain=false"></complain>
      </div>
</template>
<script>
import HeaderTop from '~/components/common/header.vue'
import paginationLoading from '~/components/pagination-loading.vue'
import Gallary from '~/components/common/gallary.vue'
import complain from '~/components/complain.vue'
import Fade from '~/components/common/fade.vue'
import { Toast, MessageBox, Lazyload } from 'mint-ui'
import { mapGetters, mapActions } from 'vuex'
import { Loadmore, InfiniteScroll, Indicator } from 'mint-ui';
import noContent from '~/components/common/noContent.vue'
import spinner from '~/components/common/loading/initiate-loading'
import api from '@/api'
import eventbus from '@/utils/eventbus'
import Share from '@/utils/share'

export default {
    name:'PersonalRelease',
    components:{
        HeaderTop,
        Gallary,
        Fade,
        noContent,
        complain,
        paginationLoading
    },
    data () {
        return {
            name:  this.$store.state.common.uid === this.$route.query.userId ? '我的发布': 'TA的发布',
            showGallary:false,
            sheetVisible: false,
            sheetData: null,
            allLoaded:false,
            sheetDataIndex: -1,
            showBlogComplain: false,
            actions: this.$store.state.common.uid === this.$route.query.userId ? [
                {
                    name: '删除',
                    method: this.blogDelete
                }] :
                [{
                    name: '投诉',
                    method: this.blogComplain
                }
            ],
            activeIndex:1,
            defaultImage: 'this.src="' + require('~/assets/images/default-img_x2.png') + '"',
            defultAvatar: 'this.src="' + require('~/assets/images/avatar_60x60.png') + '"',
            noContent: {
                message: '这家伙很懒，什么都没有~',
                src: require('~/assets/images/no-publish.png')
            },
            myNoContent: {
                message: '这里空空如也，赶紧发布吧~',
                src: require('~/assets/images/no-publish.png')
            }
        }
    },
    computed: {
        ...mapGetters({
            personalPublishList: 'personal/personalPublishList',
            paginationLoading: 'common/paginationLoading',
            userInfo: 'common/userInfo'
        }),

        isMyself () {
            return this.$store.state.common.uid === this.$route.query.userId
        },

        uid(){
            return this.$store.state.common.uid;
        }
    },


    methods:{
        ...mapActions({
            getPersonalPush: 'personal/getPersonalPush',
            updateItem: 'personal/updateItem',
            setPaginationLoading: 'common/setPaginationLoading',
        }),

        handleImgClick (item,index) {
            this.showGallary = true;
            this.sheetData = item;
            this.activeIndex = index;
        },

        handleGallaryClose () {
            this.showGallary = false
        },

        async blogDelete() {
            const info = await api.personal.blogDelete({
                blogId: this.sheetData.contentId,
                uid: this.$store.state.common.uid,
            })
            this.updateItem({
                remove: function(){},
                index: this.sheetDataIndex
            });

        },

        async blogComplain() {
            this.showBlogComplain = true;
        },

        async blogLike (item, index) {
            const info = await api.personal.blogLike({
                blogId: item.contentId,
                uid: this.$store.state.common.uid,
                status: !item.likeStatus ? 1: 0
            })

            this.updateItem({
                update: function(){
                    item.likeStatus = !item.likeStatus;
                    item.likeTotal = item.likeStatus ? item.likeTotal+1: item.likeTotal-1
                }, index});
        },

        showMore(item, index){
            this.sheetData = item;
            this.sheetDataIndex = index;
            this.sheetVisible = true;
        },

        async fetch (page, pos = 'top') {
            this.setPaginationLoading({loading: true});

            const info = await this.getPersonalPush({
                    hostPuid: this.$route.query.userId,
                    uid: this.$store.state.common.uid,
                    type: 'published',
                    page: page,
                    size: 10
            }).catch(function (err) {
                eventbus.$emit('paginationLoading.error', err)
            })

            Share({
                desc: this.userInfo && this.userInfo.nickName ? this.userInfo.nickName + '的个人主页' : '我的发布',
                imgUrl: this.userInfo && this.userInfo.avatar ? this.userInfo.avatar : null
            })

            this.setPaginationLoading({loading: false, allLoaded:  this.personalPublishList.pagination.allLoaded});

            spinner.hide();

            if(pos === 'top'){
                this.$refs.loadmore.onTopLoaded();
            }else{
                this.$refs.loadmore.onBottomLoaded();
            }

            this.allLoaded = this.personalPublishList.pagination.allLoaded;
        },

        loadTop() {
            this.fetch(1, 'top')
        },

        loadBottom() {
            console.log('loadBottom')

            this.$nextTick(function () {
                if (this.personalPublishList.pagination.hasMore) {
                    if(this.paginationLoading.loading){
                        return;
                    }
                    this.fetch(this.personalPublishList.pagination.currentPage ? this.personalPublishList.pagination.currentPage + 1 : 1, 'bottom');
                }
            })
        },

        getDetail(feedType,id){
            if(feedType=='uge'){
                this.$router.push({name:'activity-details',query:{blogId: id}})
            }else if(feedType=='ugc'){
                this.$router.push({name:'groups-trendsDetail',query:{id: id}})
            }
        },

        toAllComment(item){
            this.$router.push({path:'/groups/allComment', query:{id: item.contentId}});
        },

        toPublish(){
            this.$router.push('/groups')
        },

        toUserProfile(uid){
            this.$router.push({path: '/ucenter/UserProfile', query: {userId: uid}});
        }


    },

    mounted() {

        console.log('mounted')
        let that = this;
        spinner.show();
        that.fetch(1, 'top')
//        spinner.show();
//        this.fetch(1, 'top')
    },

    beforeDestroy(){
        spinner.hide();
    }
}
</script>
<style lang="less" scoped>
.personal-release{
}
.mint-loadmore{
    min-height: 82.5vh;
}
.release{
    overflow: hidden;    
    font-size: 15px;
    background: #fff
}
.release-cnt{
    overflow: hidden;
    width: 100%;
    padding:25px 20px 0;
    border-top: 10px solid #f6f6f6;
}
.release-img{
    width: 40px;
    height: 40px;
    margin-top:5px;   
    float:left;
    border-radius: 50%;
}
.release-img img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.release-name{
    overflow: hidden;
    float: left;
    padding:0 10px;
    max-width: 86%;   
}
.release-name p{
    overflow: hidden;    
    height: 20px;
    line-height: 20px; 
    margin-top: 4px;
}
img[lazy=error],
img[lazy=loading]{
    background: #eee;
    background-size: contain;
}
img.avatar[lazy=loading],
img.avatar[lazy=error]{
    background: transparent url('../../../assets/images/avatar_60x60.png') no-repeat center center;
}
.time{
    font-size: 12px;
}
.txt-color{
    color:#999999;
}
.clear-padding{
    padding-top:0;
}
.release-info{
    width: 100%;
    float: left;  
    line-height: 1.5;
    padding-top: 10px;
}
.release-info img{
    width: 105px;
    height: 105px;
    margin-right: 5px;
    margin-top: 5px;
    object-fit: cover;
}
.release-info img:last-child{
    margin-right: 0;
}

.release-title{
    display: -webkit-box;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}
.release-btn{
    overflow: hidden;
    width: 100%;
    margin-top:15px;
    padding: 35px 0 15px;
}
.release-btn:before{
    position: absolute;
    width: 100%;
    content: '';
    height: 0;
    border-bottom: solid 1px rgba(233,233,233, 0.6);
    margin-top: -15px;
    margin-left: -20px;
}
.release-btn i{
    padding-left: 5px;
}
.release-btn span{
    display:flex;      
    align-items: center;//子元素垂直居中
    justify-content: center;//子元素水平居中
    width: 33%;
    height: 16px; 
    text-align: center; 
    font-size: 14px;
    float: left;
   
}
.release-btn span img{
    width: 16px;
    height: 16px;
    margin-right:3px;
}
.release-btn .release-zan{
    /*border-left:1px solid #dfdfdf;*/
    /*border-right:1px solid #dfdfdf;*/
}
.release-activity{
    overflow: hidden;
    width: 100%;
    float: left;
    position: relative;  
}
.release-activity p{
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color:#666666;
}
.release-activity .release-activity-title{
    font-size: 16px; 
    color:#000;
    margin-top:10px;
    margin-bottom: 5px;
}

.release-activity-status{
    position: absolute;
    bottom: 2px;
    right: 2px;
    font-size: 13px;
    padding: 5px 4px;
    color: #ff612a;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 20px 0 rgba(152, 152, 152, 0.28);
}
.release-tx{
    position: relative;
}
.release-activity-img{
    position: absolute;
    top: 0;
    right: 0;
}
.release-activity-img img{
    width:29px;
    height:32px;
}

@keyframes likeIt {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
        top: -10px;
        left: 53%;
    }
}


.likeIt {
    -webkit-animation-name: likeIt;
    animation-name: likeIt;
    -webkit-animation:flutter 1.2s ease-in-out;
    animation:flutter 1.2s 1 ease-in-out;
}

.btn-publish{
    padding: 10px 35px;
    margin-top: 30px;
    background: #fff;
    box-shadow: 0 2px 20px 0 rgba(152, 152, 152, 0.28);
    border-radius: 5px;
    color: #12a4ff;
}
</style>
