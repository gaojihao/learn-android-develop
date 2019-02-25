<template>
	<div class="trendsDetail">
		<header-top :name='name'>
			<div  slot="action" class="setTop" @click='setTopClick'></div>
		</header-top>
		<div class="content">
			<div class="portrait">
				<img :src="avatar" @click='toPersonal($event)'>
				<div class="nickName">
					<h1>{{nickName}}</h1>
					<span>{{detail.publishDate}}</span>
				</div>
			</div>
			<div class="topic">
				<h1 v-html='detail.content'></h1>
				<div class="pic">
					<img :src="img.uploadImage.img.name" v-for='(img,index) in detail.mediaList' :index='index' @click="previewClick(img,index)">
				</div>
			</div>
		</div>
	    <write :blogId='ID' :isZan='isZan' :isFav='isFav' :likeTotal='likeTotal' :collectedTotal='collectedTotal' :isAllComment='false' @updateComment="updateComment"></write>
		<commentList :commentList='commentList' :blogId='ID' :commentNums="commentNums"></commentList>
		<mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
		<mt-actionsheet :actions="actionsData" v-model="sheetVisibleReport"></mt-actionsheet>
		<gallary v-if="showGallary" :imgs="images" :activeIndex="activeIndex" @close="handleGallaryClose"></gallary>
		<transition name="picker">
			<div v-if='showPicker' class="pickerAll">
				<ul>
					<li class="cancel"  @click='setCancel'>取消</li>
					<li class="done" @click='setDone'>确定</li>
				</ul>
				<mt-picker ref='picker' :slots="slots" @change="onValuesChange" value-key="name" ></mt-picker>
			</div>
		</transition>
	</div>
</template>
<script type="text/javascript">
import Vue from 'vue'
import header from '@/components/common/header'
import sendComment from '@/components/sendComment'
import commentList from './components/commentList'
import api from '@/api'
import bus from '@/utils/eventbus'
import { InfiniteScroll , Actionsheet , Indicator , Toast , Picker} from 'mint-ui';
import Gallary from '~/components/common/gallary.vue'
import write from '~/components/common/write.vue'
import { mapGetters, mapActions } from 'vuex'
import Share from '@/utils/share'

Vue.component(Picker.name, Picker);
	export default{
		name:'trendsDetail',
		data(){
			return{
				name:'',
				canShrink:true,
				detail:{},
				commentList:[],
                commentNums: 0,
				ID:this.$route.query.id,
				userImage:require('../../assets/images/defaultHead.png'),
				activeIndex : 1,
				showGallary:false,
				isMaster:null,
				isMy:null,
				sheetVisible:false,
				sheetVisibleReport:false,
				actions:[],
				isTop:false,
				isZan:false,
				isFav:false,
				likeTotal:0,
				collectedTotal:0,
				// onfouce:false,
				// placeholder:'评论',
				// replyText:'',
				// keyupShow:true,
				commentId:null,
				pickerDate:[{'name':'日','num':['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']},{'name':'周','num':['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}],
				//auditStatus:null
				slots: [],
				showPicker:false,
				
			}
		},
		components:{
			'header-top':header,
			'commentList':commentList,
			'gallary':Gallary,
            sendComment,
			write,
		},
		computed: {
	        ...mapGetters({
	            uid: 'common/uid',
	            userInfo:'common/userInfo',
	            feedReportType: 'common/feedReportType',
	        }),
	        avatar:function(){
	        	let cover = this.detail.author?this.detail.author.user.avatar:this.userImage
	        	return (cover!=''&&cover)?cover:this.userImage
	        },
	        nickName:function(){
	        	let nickName = this.detail.author?this.detail.author:null
	        	return (nickName!=null&&nickName)?nickName.user.nickName:''
	        },
	        images:  function () {
	            let images = [];
	            if(this.detail.mediaList && this.detail.mediaList.length){
	                return this.detail.mediaList.map(function (item) {
	                    return item.uploadImage.img.name;
	                })
	            }
	            return images;
	        },
	       	actionsData: function () {
	            let that = this;
	            return this.feedReportType.map(function (item) {
	                return {
	                    ...item,
	                    method: that.submitReport
	                }
	            })
	        },
	        // zanBtnImageSrc:function(){
	        // 	return this.isZan?require('../../assets/images/note/detail/zan_selected@2x.png'):require('../../assets/images/note/detail/zan_normal@2x.png')
	        // },
	        // favBtnImageSrc:function(){
	        // 	return this.isFav?require('../../assets/images/note/detail/fav_selected@2x.png'):require('../../assets/images/note/detail/fav_normal@2x.png')
	        // }
	    },
		mounted(){
			let _self=this
			this.fetch()
			bus.$on('sendSucess',function(){
				_self.getComments()
			})
			this.slots= [
		        {
		          flex: 1,
		          values: this.pickerDate[0].num,
		          className: 'slot1',
		          textAlign: 'right'
		        }, {
		          divider: true,
		          content: '-',
		          className: 'slot2'
		        }, {
		          flex: 1,
		          values:this.pickerDate,
		          className: 'slot3',
		          textAlign: 'left'
		        }
		    ]
			// bus.$on('reply',function(data){
			// 	_self.onfouce=true
			// 	debugger
			// 	//_self.$refs.textarea.focus
			// 	_self.commentId=data.commentId
			// 	_self.placeholder= "回复："+data.nickName
			// })
		},
		beforeDestroy () {
		    bus.$off()
		},
		methods:{
			...mapActions({
	            getFeedReportType: 'common/getFeedReportType'
	        }),
			async fetch(){
				let _self = this
				let param = {
					uid:this.uid,
					ID:this.ID,
				}
				
				await api.groups.getTrendsDetail(param).then(res=>{
					if(res.status == 200){
						_self.detail = res.data
						_self.isTop = (res.data.downgrade==0)?true:false
						_self.isZan = (_self.detail.likeStatus==0)?false:true
						_self.isFav = (_self.detail.isCollect==0)?false:true
						_self.likeTotal= _self.detail.likes
						_self.isMaster= (_self.detail.topicUserId==_self.uid)?true:false
						_self.isMy= (_self.detail.author.user.uid==_self.uid)?true:false
						_self.collectedTotal= _self.detail.collectedTotal
						_self.name=res.data.topicName

                        Share({
                            title: _self.detail.topicName,
							desc: _self.detail.content,
                            imgUrl: _self.detail.mediaList && _self.detail.mediaList.length > 0 ?  _self.detail.mediaList[0].uploadImage.img.name : null,
                        })
                    }
					console.log(_self.isZan,_self.isFav)
				})
				this.getComments()
				
			},
			async getComments(){
				let _self = this
				let params = {
					uid:this.uid,
					blogId:this.ID,
					sortFlag:1,
					page:1,
					size:10,
				}
				await api.groups.getComments(params).then(res=>{
					if(res.status == 200){
						_self.commentList = res.data.uisCommentOutput
						_self.commentNums = res.data.commentNums
					}
				})
			},
			toPersonal(e){
				e.stopPropagation()
				this.$router.push({name:'ucenter-UserProfile',query:{userId:this.detail.author.user.uid}})
			},
            updateComment(){
			  this.getComments();
			},
			previewClick (file, index) {
	            this.activeIndex = index
	            this.showGallary = true
	        },
	        handleGallaryClose () {
	            this.showGallary = false
	        },
	        setTopClick(){
	        	this.sheetVisible=true
	        	this.actions=[
					{
						name:"话题置顶",
						method:this.setTop
					},
					{
						name:"删除话题",
						method:this.deleteTopic
					}
				]
				if(this.isMaster&&this.isMy){
					this.actions[0].name=this.isTop?'取消置顶':'话题置顶'
				}else if(this.isMaster&&!this.isMy){
					this.actions[0].name=this.isTop?'取消置顶':'话题置顶'
					this.actions.pop()
				}else if(!this.isMaster&&this.isMy){
					this.actions.shift()
				}else{
					this.actions=[{
						name:"举报话题",
						method:this.report
					}]
				}
	        },
	        async report(){
				await this.getFeedReportType()
				//this.actions=this.actionsData
				this.sheetVisibleReport=true
			},
			async submitReport(e) {
	            let result = await api.ucenter.feedReport({
	                type: 1,
	                blogId: this.ID,
	                refId: this.ID,
	                reportType: e.id,
	                uid: this.uid,
	                reason: e.name
	            })
	            Toast('举报成功')
	            return true;
	        },
	        setTop(){
	        	let _self=this
				if(this.complainShow||this.sheetVisible){
					let param ={
						blogId:this.ID,
						uname:this.userInfo.nickName,
						uid:this.uid,
					}
					if(this.isTop){
						param.reason='取消置顶'
						api.groups.cancelTop(param).then(res=>{
							if(res.status == 200){
								Toast('取消置顶成功')
								_self.isTop=false
							}
						}).catch(err=>{
							alert(JSON.stringify(err))
						})
					}else{
						this.showPicker=true
					}
				}
				
			},
			deleteTopic(){
				if(this.complainShow||this.sheetVisible){
					let param ={
						blogId:this.ID,
						uid:this.uid,
					}
					api.groups.deleteTopic(param).then(res=>{
						if(res.status == 200){
							Toast('删除成功')
						}
					}).catch(err=>{
						alert(JSON.stringify(err))
					})					
				}
			},
			onValuesChange(picker, values) {
	        	console.log(picker)
	        	console.log(values)
		      	if (!values[1]) {
		        	//picker.setValues([this.pickerDate[0].num,this.pickerDate[0]])
		      	}else{
		      		picker.setSlotValues(0, values[1].num);
		      	}
		    },
			setCancel(){
		    	this.showPicker=false
		    },
		    setDone(){
		    	let values = this.$refs.picker.getValues()
		    	let param ={
					blogId:this.ID,
					uname:this.userInfo.nickName,
					uid:this.uid,
					type:values[1].name=="日"?1:2,//1是天2是周
					nums:Number(values[0]),
				}
		    	api.groups.setTop(param).then(res=>{
					if(res.status == 200){
						Toast('置顶成功')
						this.showPicker=false
						this.isTop=true
					}
				}).catch(err=>{
					alert(JSON.stringify(err))
				})
		    }
		}
	}
</script>
<style lang="scss" scoped>
@import  '../theme.scss';
.trendsDetail{
	padding-bottom:50px;
	.setTop{
		width:29px;
		height:29px;
		float:right;
		background-image:url(../../assets/images/more.png);
		background-position:center;
		background-repeat:no-repeat;
		background-size:29px;
	}
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
			overflow:hidden;
			padding-top:3px;
			h1{
				color:#000;
				font-size:15px;
				float:left;
			}
			span{
				color:#999;
				font-size:12px;
				float:right;
			}
		}
		
	}
	.topic{
		padding:0 20px 48px;
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
	.pickerAll{
		position:fixed;
		left:0px;
		right:0px;
		bottom:0px;
		background-color:#fff;
		z-index:2021;
		padding-bottom:20px;
		ul{
			display:block;
			overflow:hidden;
			li{
				display: inline-block;
			    width: 50%;
			    text-align: center;
			    line-height: 1.066667rem;
			    font-size: 0.426667rem;
			    color: #26a2ff;
			}
			.cancel{
				float:left;
			}
			.done{
				float:right;
			}
		}
	}
	.mock{
		position: fixed;
	    left: 0;
	    top: 0;
	    width: 100%;
	    height: 100%;
	    opacity: 0.5;
	    background: #000;
	    z-index:2020;
	}
	.picker-enter-active {
	  	animation: bounce-in .5s ease;
	}
	.picker-leave-active{
		animation: bounce-in .5s reverse;
	}
	@keyframes bounce-in {
	  0% {
	   	bottom:-200px;
	  }
	  100% {
	    bottom:0px;
	  }
	}

/* 	.comment_input_footer {
		width: 100%;
		position: fixed;
		bottom:0;
		left:0;
		right:0;
		background-color: white;
		display:flex;
		box-shadow:$itemShadow;
		z-index:999;
		.comment_textfield_bg{
		  	margin-left: 15px;
		  	margin-top: 2.5px;
		  	margin-bottom: 2.5px;
		  	flex:0.6;
		  	background-color: #f1f1f1;
		  	border-radius:5px;
		  	display:flex;
		  	.comment_textfield{
			  	border:none;
			  	flex:1;
			  	background-color:rgba(0,0,0,0);
			  	margin-left: 10px;
			}
		}
		.onfouce{
			flex:0.8;
			background-color:#fff;
			padding-top:15px;
			padding-bottom: 10px;
			.textarea{
				display:flex;
				width:100%;
				textarea{
					flex:1;
					height:82px;
					line-height:1.4;
					font-size: 14px;
					padding:5px 10px;
					background: #efefef;
					border-radius: 10px;
				}
				i{
					width:0.5px;
					background:#12a4ff;
					height:14px;
					margin-top:4px;
				}
			}
			
		}
		.sendBtn{
			flex:0.2;
			display:flex;
			flex-direction:column-reverse;
			h1{
				color:#3385ff;
				font-size:16px;
				height:25px;
				line-height:25px;
				margin-bottom:16px;
				margin-left: 10px;

				&.disabled{
					color:#999;
				}
			}
		}
		.commonBlur{
			flex:0.4;
			display:flex;
			align-items: center;
			justify-content: space-around;
			.commment_footer_zan_star{
			  	display:flex;
			  	flex-direction: column;
			  	justify-content: center;
			  	align-items: center;
			}
		}
		
		.zan_star_img{
		  	width:15px;
		  	height:15px;
		  	object-fit:cover;
		}
		.people_count_zan{
		  	color:#ff832a;
		}
		.people_count_fav{
		  	color:#119aff;
		}
		.peogle_count_unselected{
		  	color:#7d7d7d;
		}
	
	} */	
}
	
	
</style>