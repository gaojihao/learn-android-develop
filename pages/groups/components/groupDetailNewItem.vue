<template>
	<div>
		<div class="release-cnt" @click="getDetail(item.feedType, item.id)">
			<div class="release-tx" >
				<div class="release-img" @click.stop="toUserProfile(item.author.uid)"><img class="avatar" v-lazy="avatar" ></div>
				<div class="release-name">
					<p>{{item.author.nickName}}</p>
					<p class="txt-color time">
						{{item.publishTime | formatTime('YYYY-MM-DD HH:mm')}}
					</p>
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
				<p>活动时间：{{item.publishTime}}</p>
				<p>地点：{{item.previewText}}</p>
			</div>
			<div class="release-btn">
				<span class="release-comment" @click="getDetail(item.feedType, item.id)"><img src="~assets/images/comment.png"><i class="txt-color">{{item.commentTotal}}</i></span>
				<span class="release-zan" @click.stop="like(index)">
											   <img v-if="!item.likeStatus" src="~assets/images/zan_f.png" ref="img_zan">
											   <img v-if="item.likeStatus" class="animated likeIt" src="~assets/images/zan_fl.png" ref="img_zan" style="color: #ff8309">
											   <i ref="t_zan" class="txt-color">{{item.likeTotal}}</i>
											</span>
				<span class="release-more" @click.stop="showMore(item)"><img src="~assets/images/more.png"></span>
			</div>
		</div>
		<mt-actionsheet cancel-text="取消" :actions="actions" v-model="sheetVisible"></mt-actionsheet>
		<complain v-if="item" :propShow="showBlogComplain" type="1" :blogId="item.contentId" :refId="item.contentId" complainStyle="x" @hide="showBlogComplain=false"></complain>
	</div>
</template>
<script type="text/javascript">
import filters from '@/utils/filters'
import formatTime from '@/utils/formatter'
import bus from '@/utils/eventbus'
import { Toast, MessageBox, Lazyload } from 'mint-ui'
import api from '@/api'
import { mapGetters, mapActions } from 'vuex'
import complain from '~/components/complain.vue'

	export default{
		name:'groupDetailItem',
		data(){
			return{
				userImage:require('../../../assets/images/defaultHead.png'),
				id:this.item.contentId,
                sheetVisible: false,
                showBlogComplain: false,
                actions: this.uid === this.item.author.uid ? [
					{
						name: '删除话题',
						method: this.blogDelete
					},{
						name: '投诉',
						method: this.blogComplain
					}] :
					[{
						name: '投诉',
						method: this.blogComplain
					}
					],
			}
		},
		props:['item', 'index', 'isMaster', 'showMoreAction', 'fromUserCollection'],
		components:{
            complain,
		},
		computed:{
            ...mapGetters({
                uid: 'common/uid',
            }),

			avatar:function(){
				return	this.item.author.avatar? this.item.author.avatar:this.userImage
			},
		},
		methods:{

            ...mapActions({
                updateUserCollectedItem: 'userCollection/updateUserCollectedItem',
            }),

            async like(index){
				let _self=this
				let params = {
					blogId:this.id,
					uid:this.uid,
					type:1,
					status:_self.item.likeStatus? 0: 1
				}
				api.groups.Like(params).then(res=>{
					if(res.status == 200){
                        _self.updateUserCollectedItem({
                            update: function(){
                                _self.item.likeStatus?_self.item.likeTotal--:_self.item.likeTotal++
                                _self.item.likeStatus = !_self.item.likeStatus
                            }, index});
					}

				}).catch(err=>{
				})
			},

            async showMore(){
                this.sheetVisible = true;
            },

            async blogComplain() {
                this.showBlogComplain = true;
            },

            getDetail(feedType,id){
				if(feedType=='uge'){
					this.$router.push({name:'activity-details',query:{blogId: this.id,isMaster:this.isMaster}})
				}else if(feedType=='ugc'){
					this.$router.push({name:'groups-trendsDetail',query:{id: this.id,isMaster:this.isMaster}})
				}
			},

            toUserProfile(userId){
                this.$router.push({path:'/ucenter/UserProfile',query:{userId: userId}})
			}
		},
		filters:Object.assign(filters, formatTime),
	}
	
</script>
<style lang="scss" scoped>
@import  '../theme.scss';
.release{
	overflow: hidden;
	font-size: 15px;
	background: #fff
}
.release-cnt{
	overflow: hidden;
	width: 100%;
	padding:25px 15px 0;
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
	background: #eee url('../../../assets/images/default-img_x2.png') no-repeat center center;
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