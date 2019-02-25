<template>
	<div class="groupDetail">
		<div class="detailHead">
			<div class="groupPic">
				<div class="back" @click="go()"></div>
				<img class="head" :src="groupCover" @click='groupMsg'>
				<h1>{{detail.title}}</h1>
				<!-- <div class="bg" :onerror="groupPicBig" v-bind:style="{backgroundImage:'url('+groupCoverBig+')'}" ></div> -->
				<img class="bg" :src="groupCoverBig" :onerror="defaultImage">
			</div>
			<div class="search">
				<input @click='search' type="text" placeholder="搜索标题" >
			</div>
		</div>
		<div class="detail">
			<div v-if="detail.announcement!=''&&detail.announcement" class="report">
				<i></i>
				<h2>{{detail.announcement}}</h2>
			</div>
			<ul class="content"  v-infinite-scroll="loadMore" infinite-scroll-disabled="loaded" infinite-scroll-distance="10">
				<detail-item v-for='(item,index) in detailList' :key='item.index' :list='item' :isMaster='isMaster' ></detail-item>
			</ul>
		</div>
		<transition name="fade">
			<div v-show='shrinkHeader' class="slipTop">
				<h1>{{detail.title}}</h1>
				<input type="text" @click='search' placeholder="搜索标签，用户，标题">
				<img :src="groupCover" @click='groupMsg'>
			</div>
		</transition>
		<div class="publish" @click="publishPoster"></div>
		<button v-if='detail.auditStatus==0' class="takeIn" @click='joinIn'>加入圈子</button>
		<button v-if='detail.auditStatus==2' class="takeIng" @click='joinIn'>审核中</button>
		<mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
		<mt-actionsheet :actions="actionsData" v-model="sheetVisibleReport"></mt-actionsheet>
		<toastMsg v-if='showToast' :title='toastTitle' :content="toastContent" :btn='toastBtn' :type="toastType" :isShowClose='toastShowClose'></toastMsg>
		<transition name="picker">
			<div v-if='showPicker' class="pickerAll">
				<ul>
					<li class="cancel"  @click='setCancel'>取消</li>
					<li class="done" @click='setDone'>确定</li>
				</ul>
				<mt-picker ref='picker' :slots="slots" @change="onValuesChange" value-key="name" ></mt-picker>
			</div>
		</transition>
		<div v-if='noData' class="noData">
			<img :src="noDataImg">
			<h1>这里还没有内容来发布一条吧~</h1>
			<span @click="publishPoster">去发布</span>
		</div>
		<div v-if='showPicker' class="mock"></div>
	</div>
</template>
<script type="text/javascript">
import Vue from 'vue'
import api from '@/api'
import bus from '@/utils/eventbus'
import detailItem from './components/groupDetailItem'
import { InfiniteScroll , Actionsheet , Indicator , Toast , Picker } from 'mint-ui';
import toastMsg from '@/components/common/toastMsg'
import { mapGetters, mapActions } from 'vuex'
import keepView from '~/components/common/keepView.vue'
import Share from '@/utils/share'

Vue.use(InfiniteScroll);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Picker.name, Picker);
	export default{
		name:'groupDetail',
		components:{
			'detail-item':detailItem,
            keepView,
            toastMsg,
		},
		data(){
			return{
				groupPic:require('../../assets/images/noCover.png'),
				groupPicBig:require('../../assets/images/group/noCover.png'),
				noDataImg:require('../../assets/images/no_note.png'),
				detailList:[],
				shrinkHeader:false,
				detail:{},
				loading:false,
				isMore:false,
				isMaster:false,
				sheetVisible:false,
				sheetVisibleReport:false,
				ID:this.$route.query.id,
				page:1,
				blogId:null,
				isTop:null,
				showToast:false,
				toastTitle:'',
				toastContent:'',
				toastBtn:'',
				toastType:1,
				toastShowClose:true,
				actions:[],
				fixed: '',
				//isJoin:false,
				noData:false,
				pickerDate:[{'name':'日','num':['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']},{'name':'周','num':['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}],
				//auditStatus:null
				slots: [],
				showPicker:false,
				defaultImage: 'this.src="' + require('../../assets/images/group/noCover.png') + '"',
				groupCoverBig:null
			}
		},
		computed: {
	        ...mapGetters({
	            messageList: 'ucenter/messageList',
	            pagination: 'ucenter/pagination',
	            uid: 'common/uid',
	            userInfo:'common/userInfo',
	            feedReportType: 'common/feedReportType'
	        }),
	        loaded:function(){
	        	return !this.isMore||(this.loading&&this.isMore)
	        },
	        // groupCoverBig:function(){
	        // 	let cover = this.detail.cover?this.detail.cover.name:this.groupPicBig
	        // 	return (cover!=''&&cover)?cover:this.groupPicBig
	        // },
	       	groupCover:function(){
	       		let cover = this.detail.head?this.detail.head.name:this.groupPic
	        	return (cover!=''&&cover)?cover:this.groupPic
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
	    },
		watch:{

		},
		beforeDestroy () {
		    bus.$off()
		},
		mounted(){
			let _self = this
			this.fetch()
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
			global.addEventListener('scroll', this.scroll)
			bus.$on('set',function(data){
				_self.sheetVisible=data.isSet
				_self.blogId=data.blogId
				let isMy = (data.authorUid==_self.uid)?true:false
				_self.actions=[
					{
						name:"话题置顶",
						method:_self.setTop
					},
					{
						name:"删除话题",
						method:_self.deleteTopic
					}
				]
				if(_self.isMaster&&isMy){
					_self.isTop=data.isTop
					_self.actions[0].name=_self.isTop?'取消置顶':'话题置顶'
					_self.actions[1].name=(data.feedType=='uge')?'删除活动':'删除话题'
				}else if(_self.isMaster&&!isMy){
					_self.isTop=data.isTop
					_self.actions[0].name=_self.isTop?'取消置顶':'话题置顶'
					_self.actions.pop()
				}else if(!_self.isMaster&&isMy){
					_self.actions[1].name=(data.feedType=='uge')?'删除活动':'删除话题'
					_self.actions.shift()
				}else{
					_self.actions=[{
						name:"举报话题",
						method:_self.report
					}]
					data.feedType=='uge'?_self.actions[0].name='举报活动':'举报话题'
				}
			})
			bus.$on('close',function(data){
				_self.showToast=data
			})
			bus.$on('btnclick',function(data){
				if(data.type == 0){
					_self.joinInApi()
				}else if(data.type == 1||data.type == 2){
					_self.showToast=false
				}
			})
		},
        beforeRouteLeave(to, from, next) {
            this.fixed = 'fixed';
            next();
        },
		methods:{
			...mapActions({
	            getFeedReportType: 'common/getFeedReportType'
	        }),
			fetch(){
				this.loadMore()
				this.getGroupDetail()		
			},
			getGroupDetail(){
				let param={
					uid:this.uid,
					ID:this.ID,//this.id //活动227135199963344896
				}
				api.groups.getGroupDetail(param).then(res=>{
					if(res.status == 200){
						this.detail = res.data
						this.isMaster= (res.data.userId==this.uid)?true:false
						this.isJoin = res.data.isFollow
						this.groupCoverBig=res.data.cover.name
						//console.log(JSON.stringify(this.detail))

                        Share({
                            title: this.detail.title,
							desc: this.detail.content,
                            imgUrl: this.groupCover
                        })
					}
				}).catch(err=>{
					alert(err)
				})
			},
			go(){
				this.$router.go(-1)
			},
			async loadMore(){
				Indicator.open('加载中...');
				let param={
					uid:this.uid,
					topicId:this.ID,//'194039350959738880',//this.id
					page:this.page,
					size:10,
					orderType:'time',
				}
				let _self =this
				await api.groups.getGroupDetailList(param).then(res=>{
					if(res.status == 200){
						Indicator.close()
						_self.loading = true,
						_self.detailList = _self.detailList.concat(res.data.list)
						//console.log(JSON.stringify(_self.detailList))
						this.noData=_self.detailList.length==0?true:false
						_self.isMore = res.isMore
						_self.page++
						//console.log(JSON.stringify(_self.detailList))
					}
				}).catch(err=>{
					Indicator.close()
					alert(err)
				})
			},
			scroll(){
				let scrollTop = global.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
		        if( scrollTop > 110){
		            this.shrinkHeader = true;
		        }else{
		            this.shrinkHeader = false;
		        }
			},
			publishPoster () {
				if(this.detail.isFollow){
					this.$router.push({path: './publishPoster', query:{topicId: this.ID}}) // TODO
				}else{
					Toast('加入圈子后才可以发布哦！')
				}
                
			},
			search(){
				this.$router.push({name:'search-search',query:{from:'groupDetail',topicId:this.ID,isMaster:this.isMaster}})
			},
			setTop(){
				if(this.sheetVisible){
					let param ={
						blogId:this.blogId,
						uname:this.userInfo.nickName,
						uid:this.uid,
					}
					if(this.isTop){
						param.reason='取消置顶'
						api.groups.cancelTop(param).then(res=>{
							if(res.status == 200){
								Toast('取消置顶成功')
								this.page=1
								this.detailList=[]
								this.loadMore()
							}
						}).catch(err=>{
							alert(JSON.stringify(err))
						})
					}else{
						//设置置顶时间
						this.showPicker=true
						
					}
				}
				
			},
			deleteTopic(){
				if(this.sheetVisible){
					let param ={
						blogId:this.blogId,
						uid:this.uid,
					}
					api.groups.deleteTopic(param).then(res=>{
						if(res.status == 200){
							Toast('删除成功')
							this.page=1
							this.detailList=[]
							this.loadMore()
						}
					}).catch(err=>{
						alert(JSON.stringify(err))
					})					
				}
			},
			joinIn(){
				this.showToast=true
				this.toastTitle='承诺书'
				this.toastContent='我承诺不在圈子里发布任何违法和侵犯别人知识产权的内容'
				this.toastBtn='同意'
				this.toastType= 0
				
			},
			joinInApi(){
				let _self = this
				let param={
					uid:this.uid,
					topicId:this.ID,
					followStatus:1,
				}
				api.groups.joinGroupBtn(param).then(res=>{
					if(res.status == 200){
						_self.isJoin = true
						if(_self.detail.auditFlag==0){
							_self.toastShowClose=false
							_self.toastTitle='您已成功加入圈子'
							_self.toastType=1
							_self.toastBtn='我知道了'
							_self.toastContent=''
						}else if(_self.detail.auditFlag==1){
							_self.toastShowClose=false
							_self.toastTitle='审核中'
							_self.toastType=2
							_self.toastBtn='我知道了'
							_self.toastContent='圈主审核通过后您才可以加入该圈子'
						}
						this.getGroupDetail()
					}else{
						Toast('加入失败，请稍后重试');
						this.showToast=false
					}
				}).catch(err=>{
					alert(JSON.stringify(err))
				})
			},
			groupMsg(){
				this.$router.push({name: 'community-material', query:{topicId: this.ID}})
			},
			async report(){
				await this.getFeedReportType()
				//this.actions=this.actionsData
				this.sheetVisibleReport=true
			},
			async submitReport(e) {
	            let result = await api.ucenter.feedReport({
	                type: 1,
	                blogId: this.blogId,
	                refId: this.blogId,
	                reportType: e.id,
	                uid: this.uid,
	                reason: e.name
	            })
	            Toast('举报成功')
	            return true;
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
					blogId:this.blogId,
					uname:this.userInfo.nickName,
					uid:this.uid,
					type:values[1].name=="日"?1:2,//1是天2是周
					nums:Number(values[0]),
				}
		    	api.groups.setTop(param).then(res=>{
					Toast('置顶成功')
					this.showPicker=false
					this.page=1
					this.detailList=[]
					this.loadMore()
				}).catch(err=>{
					alert(JSON.stringify(err))
				})
		    }
		}
	}
</script>
<style lang="scss" scoped>
@import  '../theme.scss';
/*.rating_page{*/
	/*position: absolute;*/
	/*top: 0;*/
	/*left: 0;*/
	/*right: 0;*/
	/*bottom: 0;*/
	/*background-color: #fff;*/
	/*z-index: 202;*/
/*}*/
.groupDetail{
	.detailHead{
		margin-bottom:14px;
		.groupPic{
			height:180px;
			position:relative;
			overflow:hidden;
			.back{
				position:absolute;
			    width: 18px;
			    height: 16px;
			    z-index:11;
			    background: url(../../assets/images/group/back-w@2x.png) no-repeat 0 0;
			    background-size: 18px 16px;
			    display: block;
			    margin: 10px 0 10px 20px;
			    filter: blur(-10px)
			}
			.head{
				position:absolute;
				display:block;
				z-index:11;
				width:80px;
				height:80px;
				border:2px solid #fff;
				border-radius:5px;
				top:38px;
				left:50%;
				margin-left:-40px;
				object-fit:cover;
			}
			h1{
				position:absolute;
				z-index:11;
				color:#fff;
				font-size:20px;
				text-align:center;
				top:130px;
				width:100%;
			}
			.bg{
				content:"";
				position:absolute;
				width:100%;
				height:100%;
				top:0px;
				left:0px;
				filter: blur(2px);
				z-index:9;
				background-repeat:no-repeat;
				background-position:center;
				background-size:cover;
				object-fit: cover;
				display:block;
			}
		}
		
		.groupPic:after{
			content:"";
			position:absolute;
			width:100%;
			height:100%;
			top:0px;
			left:0px;
			z-index:10;
			background:rgba(0,0,0,0.4);
		}
		.search{
			padding:5px 20px;
			box-shadow:$itemShadow;
			input{
				height:40px;
				line-height:40px;
				background-color:#eee;
				background-image:url(../../assets/images/search.png);
				background-repeat:no-repeat;
				background-position:10px center;
				background-size:15px 14px;
				width:100%;
				border-radius:10px;
				padding-left:28px;
			}

		}
		
	}
	.detail{
		.report{
			margin:0 20px;
			box-shadow:$itemShadow;
			padding:0 15px;
			overflow:hidden;
			i{
				background:url(../../assets/images/group/report.png);
				background-repeat:no-repeat;
				background-position:center;
				background-size:100%;
				width:35px;
				height:30px;
				float:left;
				margin:10px 0;
			}
			h2{
				display:block;
				margin-left:50px;
				font-size:15px;
				padding:15px 0;
				line-height:20px;
			}
		}
		.content{
			margin-bottom:46px;
		}
	}
	.publish{
		position:fixed;
		height:63px;
		width:63px;
		background-image:url(../../assets/images/group/publish.png);
		background-size:62px;
		background-position:center;
		background-repeat:no-repeat;
		bottom:200px;
		right:20px;
	}
	.takeIn{
		height:50px;
		display:block;
		width:100%;
		background-color:$btnColorBlue;
		position:fixed;
		bottom:0px;
		left:0px;
		text-align:center;
		color:#fff;
		line-height:50px;
		font-size:20px;
	}
	.takeIng{
		height:50px;
		display:block;
		width:100%;
		background-color:#fff;
		position:fixed;
		bottom:0px;
		left:0px;
		text-align:center;
		color:#f8bf37;
		line-height:50px;
		font-size:20px;
		box-shadow:$itemShadow;
	}
	.slipTop{
		padding:5px 0;
		width:100%;
		background-color:#fff;
		z-index:20;
		position:fixed;
		top:0px;
		display:flex;
		h1{
			color:#000;
			font-size:20px;
			width:85px;
			height:36px;
			text-align:center;
			line-height:36px;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		input{
			border-radius:5px;
			background-color:#f2f2f2;
			background-image:url(../../assets/images/search.png);
			background-repeat:no-repeat;
			background-position:10px center;
			background-size:15px 14px;
			padding-left:35px;
			width:220px;
			height:36px;
			margin-right:15px;
		}
		img{
			width:36px;
			height:36px;
			border-radius:5px;
			object-fit:cover;
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
	.noData{
		margin-top:100px;
		height:200px;
		font-size:20px;
		text-align:center;
		color:#999;
		padding:0 20px;
		img{
		    width:225px;
		    object-fit:cover;
		}
		h1{
		    font-size:14px;
		    color:#999;
		    text-align:center;
		    margin-top:32px;
		    height:30px;
		    line-height:30px;
		}
		span{
			color:#12a4ff;
			width:64px;
			height:40px;
			line-height:40px;
			display:block;
			text-align:center;
			margin:0 auto;
			font-size:14px;
			box-shadow:$itemShadow;
		}
	}
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
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
</style>