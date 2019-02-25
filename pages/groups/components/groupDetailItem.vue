<template>
	<li class="detialItem" @click="getDetail(list.feedType,list.id)">
		<div class="portrait">
			<img  :src="avatar" @click='toPersonal($event)'>
			<div class="nickName">
				<h1>{{list.author.nickName}}</h1>
				<span v-if="list.publishTime.indexOf('-') > -1">{{list.publishTime | formatTime('YYYY-MM-DD HH:mm')}}</span>
				<span v-else>{{list.publishTime | formatDate('%Y-%m-%d %R')}}</span>
			</div>
			<div class="flag">
				<i v-if="list.feedType == 'uge'" class="activityIcon"></i>
				<i v-if='list.downgrade==0' class="topIcon"></i>
			</div>
		</div>
		<div v-if="list.feedType == 'uge'" class="activity">
			<h1>{{list.title}}</h1>
			<div  class="time">活动时间：<span v-if="list.startDate.indexOf('-') > -1">{{list.startDate | formatTime('YYYY-MM-DD HH:mm') +'  -  '+ showActivityEndDate(list.endDate)}}</span><span v-else>{{ list.startDate | formatDate('%Y-%m-%d %R') +'  -  '+ showActivityEndDate(list.endDate)}}}</span></div>
			<div class="address">地点：<span>{{list.address}}</span></div>
			<div class="pic" v-if='list.pics'>
				<img :src="img.name" v-for='(img,index) in list.pics' :index='index'>
			</div>
		</div>
		<div v-if="list.feedType == 'ugc'" class="topic">
			<h1 v-html='list.previewText'></h1>
			<div class="pic" v-if='list.pics'>
				<img :src="img.name" v-for='(img,index) in list.pics' :index='index'>
			</div>
		</div>
		<div class="operate">
			<div class="set" @click='set($event)'>
				<i></i>
			</div>
			<div class="zan" @click='like($event)'>
				<i :class="islike?'like':''"></i>
				<span>{{likeTotal}}</span>
			</div>
			<div class="reply" :class="list.feedType == 'uge'?'activityPeople':''">
				<i></i>
				<span v-if="list.feedType == 'uge'">{{list.activityEnrollNum}}</span>
				<span v-else>{{list.commentTotal}}</span>
			</div>
			
		</div>
	</li>
</template>
<script type="text/javascript">
import filters from '@/utils/filters'
import formatTime from '@/utils/formatter'
import uitls from '@/utils/formatter'
import bus from '@/utils/eventbus'
import api from '@/api'
import { mapGetters, mapActions } from 'vuex'
	export default{
		name:'groupDetailItem',
		data(){//downgrade,0置顶，1不置顶
			return{
				islike:this.list.likeStatus,
				likeTotal:this.list.likeTotal,
				userImage:require('../../../assets/images/defaultHead.png'),
				id:this.list.contentId,
				uitls,
			}
		},
		props:['list','isMaster', 'showMoreAction', 'fromUserCollection'],
		components:{
		},
		computed:{
			avatar:function(){
				let avatar = this.list.author?this.list.author.avatar:this.userImage
				return	(avatar!=null&&avatar)?this.list.author.avatar:this.userImage
			},
			...mapGetters({
	            messageList: 'ucenter/messageList',
	            pagination: 'ucenter/pagination',
	            uid: 'common/uid',
	            userInfo:'common/userInfo'
	        }),

		},
		methods:{
			like(e){
				e.stopPropagation()
				let _self=this
				let params = {
					blogId:this.id,
					uid:this.uid,
					type:1,
					status:this.islike?0:1
				}
				api.groups.Like(params).then(res=>{
					if(res.status == 200){
						_self.islike?_self.likeTotal--:_self.likeTotal++
						_self.islike = !_self.islike
					}
				}).catch(err=>{
					alert(err)
				})
				
			},
			getDetail(feedType,id){
				if(feedType=='uge'){
					this.$router.push({name:'activity-details',query:{blogId: this.id,isMaster:this.isMaster}})
				}else if(feedType=='ugc'){
                    this.$router.push({path:'/groups/trendsDetail',query:{id: this.id,isMaster:this.isMaster}})
				}
			},
			set(e){
				let _self = this
				e.stopPropagation()
				bus.$emit('set',{isSet:true,isTop:_self.list.downgrade==0?true:false,blogId:_self.id,feedType:_self.list.feedType,authorUid:_self.list.author.uid})

			},
			toPersonal(e){
				e.stopPropagation()
				this.$router.push({name:'ucenter-UserProfile',query:{userId:this.list.author.uid}})
			},
			showActivityEndDate(endDate){
	            return endDate?uitls.formatTime(endDate):"待定"
	        }
		},
		filters:Object.assign(filters, formatTime),
	}
	
</script>
<style lang="scss" scoped>
@import  '../theme.scss';
.detialItem{
	border-bottom:1px solid $borderline;
	padding-top:26px;
	.portrait{
		display:flex;
		padding:0 20px;
		img{
			width:30px;
			height:30px;
			border-radius:50%;
			margin-right:10px;
			object-fit:cover;
		}
		.nickName{
			flex:1;
			h1{
				color:#000;
				font-size:15px;
			}
			span{
				color:#999;
				font-size:12px;
			}
		}
		.flag{
			.activityIcon{
				display:inline-block;
				width:29px;
				height:30px;
				background-image:url(../../../assets/images/group/activity@2x.png);
				background-repeat:no-repeat;
				background-position:center;
				background-size:cover;	
			}
			.topIcon{
				display:inline-block;
				width:40px;
				height:25px;
				background-image:url(../../../assets/images/group/top@2x.png);
				background-repeat:no-repeat;
				background-position:center;
				background-size:40px 25px;
				margin-left:10px;	
			}
		}
		
	}
	.topic{
		padding:0 20px;
		h1{
			color:#000;
			font-size:15px;
			padding:15px 0;
			line-height:25px;
			overflow:hidden;
		}
		.pic{
			img{
				width:105px;
				height:105px;
				margin-right:10px;
				border-radius:5px;
				object-fit:cover;
			}
			img:last-child{
				margin-right:0px;
				object-fit:cover;
			}
		}
	}
	.activity{
		padding:0 20px;
		h1{
			color:#000;
			font-size:15px;
			padding:10px 0 6px 0;
			line-height:25px;
		}
		div{
			color:#999;
			font-size:13px;
			line-height:25px;
		}
		.pic{
			margin-top:10px;
			img{
				width:105px;
				height:105px;
				margin-right:10px;
				border-radius:5px;
				object-fit:cover;
			}
			img:last-child{
				margin-right:0px;
				object-fit:cover;
			}
		}
	}
	.operate{
		padding:17px 0;
		display:flex;
		align-items: center;
		flex-direction: row-reverse;
		.reply{
			border-right:1px solid $borderline;
			text-align:center;
			display:flex;
			align-items: center;
			justify-content:center;
			flex:0 0 33%;
			i{
				width:20px;
				height:20px;
				margin-right:5px;
				background:url(../../../assets/images/comment.png);
				background-repeat:no-repeat;
				background-position:center;
				background-size:20px 20px;

			}
		}
		.activityPeople{
			i{
				width:22px;
				background:url(../../../assets/images/people.png);
				background-repeat:no-repeat;
				background-position:center;
				background-size:cover;
			}
		}
		.zan{
			text-align:center;
			display:flex;
			align-items: center;
			justify-content:center;
			flex:0 0 33%;
			i{
				
				width:23px;
				height:22px;
				margin-right:5px;
				background:url(../../../assets/images/group/zan.png);
				background-repeat:no-repeat;
				background-position:center;
				background-size:23px 22px;
			}
			i.like{
				background:url(../../../assets/images/zan_fl.png);
				background-repeat:no-repeat;
				background-position:center;
				background-size:23px 22px;
			}
		}
		.set{
			border-left:1px solid $borderline;
			text-align:center;
			display:flex;
			align-items: center;
			justify-content:center;
			flex:0 0 33%;
			i{
				width:20px;
				height:20px;
				margin-right:5px;
				background:url(../../../assets/images/more.png);
				background-repeat:no-repeat;
				background-position:center;
				background-size:20px 20px;

			}
		}

	}
}
</style>