<template>
	<div class="rating_page">
		<div class=" addGroup">
			<head-top :name="this.name" :back="this.back" :className="this.className" :backgroundColor="this.backgroundColor"></head-top>
			<div class="groupName">
				<span>圈子名称：</span>
				<input v-model='groupName' ref='groupName' type="text" placeholder="请输入圈子名称" >
			</div>
			<div class="groupList">
				<span>圈子类型：</span>
				<div class="type">
					<input readonly unselectable="on" type="text" :data='this.id' readonly="" ref='groupTagIn' @focus='onfocus()' @blur='onblur()' placeholder="请选择圈子类型" >
					<ul :class="isclick?'':'hide'">
						<li v-for="(item,index) in list" :key='index' :id='item.id' @click='choose($event)'>{{item.tagDesc}}</li>
					</ul>
				</div>
			</div>
			<div class="groupIntroduce">
				<span>圈子介绍：</span>
				<textarea placeholder="请输入圈子介绍" v-model='groupDetail'></textarea>
			</div>
			<div class="addPic">
				<h1>请上传圈子头像</h1>
				<uploader class='uoloader' :isCreate='true' :addType="'head'" :src="'/api/imgs'" max="1" @updateFiles="updateFiles" :usingCropper="true" :cropper="cropper"></uploader>
			</div>
			<div class="addPic">
				<h1>请上传圈子封面图<span>（可选填）</span></h1>
				<uploader class='uoloader' :isCreate='true' :addType="'bg'" :src="'/api/imgs'" max="1" @updateFiles="updateFiles1" :usingCropper="true" :cropper="cropper1"></uploader>
			</div>
			<mt-cell class='isAgree' title="好友加入是否需要你的同意">
				<mt-switch  @change='turn' v-model="isAgree"></mt-switch>
			</mt-cell>
			<button @click="creatGroup()">创建</button>
			<toastMsg v-show="show" :title="toastTitle" :content='toastContent' :btn='toastBtn' :type='type' :isShowClose="this.isShowClose" ></toastMsg>
		</div>
	</div>
</template>
<script type="text/javascript">
	import Vue from 'vue'
	import { Switch , Cell ,Toast} from 'mint-ui'
	import head from '../../components/common/header'
	import api from '@/api'
	import toastMsg from '@/components/common/toastMsg'
	import bus from '@/utils/eventbus'
	import uploader from '~/components/uploader.vue'
	import { mapGetters, mapActions } from 'vuex'
    import {wx} from '@/utils/share'

	Vue.component(Switch.name, Switch)
	Vue.component(Cell.name, Cell)
	export default{
		name:'addGroup',
		data(){
			return{
				isAgree:true,
				name:'创建圈子',
				back:0,
				className:1,
				backgroundColor:'',
				isclick:false,
				addpic:require('../../assets/images/group/addpic.png'),
				list:[],
				id:'',
				toastTitle:'承诺书',
				toastContent:'我承诺不在圈子里发布任何违法和侵犯别人知识产权的内容',
				toastBtn:'同意',
				type:0,
				show:false,
				isShowClose:true,
				groupName:'',
				groupDetail:'',
				file: {
	                finish: true
	            },
	            file1: {
	                finish: true
	            },
                cropper: {
                    autoCropWidth: 150,
                    autoCropHeight: 150,
				},
				cropper1: {
                    autoCropWidth: 375,
                    autoCropHeight: 224,
				}

			}
		},
		components:{
			'headTop':head,
			'toastMsg':toastMsg,
			'uploader':uploader
		},
		mounted(){
            wx.hideAllNonBaseMenuItem();
			this.fetch()
			let _self = this;
			bus.$on('close',function(data){
				_self.show=data
			})
			bus.$on('btnclick',function(data){
				if(data.type==0){
					_self.creatGroupApi()
				}else{
					_self.show=false
					_self.isShowClose=false
					//_self.$router.push({name:'groups',query:{type:1}})
					_self.$router.go(-1)
				}
			})
		},
		beforeDestroy () {
		    bus.$off()
		},
		computed: {
	        ...mapGetters({
	            uid: 'common/uid',
	            userInfo:'common/userInfo'
	        })
	    },
		methods:{
			async fetch(){
				let param={
					tagTypes:1,
					status:1,
					page:1,
					size:999999,
				}
				const list = await api.groups.getGroupTag(param)
				if (list.status == 200) {
					this.list = list.data.list
				}
			},
			choose(e){
				let el = e.currentTarget
				let content = el.innerHTML
				let id = el.id
				this.$refs.groupTagIn.value = content;
				this.$refs.groupTagIn.id = id;
			},
			creatGroup(){
				if(this.groupName==''||!this.groupName){
					Toast('请输入圈子名称')
					return
				}
				if(this.$refs.groupTagIn.id==''||!this.$refs.groupTagIn.id){
					Toast('请输入圈子类型')
					return
				}
				if(this.groupDetail==''||!this.groupDetail){
					Toast('请输入圈子简介')
					return
				}
				if(!this.file.files){
					Toast('请添加圈子头像')
					return
				}
				api.groups.checkGroupName({title:this.groupName}).then(res=>{
					if(res.status == 200){
						this.show=true
					}else if(res.status == 400){
						Toast(res.message)
						return
					}
				})
				
			},
			creatGroupApi(){
				let _self=this
				let params ={//type就填1好了recommend_status 展示状态（0-不展示 1-展示）   填1好了status 状态（0-禁用 1-启用）  1吧后面几个也是字面的意思，创建可以不填。
					uid:this.uid,
					uname:this.userInfo.nickName,
					title:this.groupName,
					description:this.groupDetail,
					coverHeight:0,
					coverWidth:0,
					headUrl:this.file.files[0].url,
					coverUrl:this.file1.files?this.file1.files[0].url:'',
					headHeight:0,
					headWidth:0,
					type:1,
					recommendStatus:1,
					status:1,
					auditFlag:this.isAgree?1:0,
					tagList:this.$refs.groupTagIn.id,
				}
				
				console.log(params)
				api.groups.creatGroup(params).then(res=>{
					if(res.status == 200){
						_self.type = 1
						_self.toastBtn='我知道了'
						_self.toastTitle='您已成功创建圈子'
						_self.toastContent=''
					}else{
						Toast('创建失败请稍后重试')
					}
				}).catch(err=>{
					_self.show=false
					//alert(JSON.stringify(err))
				})
			},
			turn(){

			},
			onfocus(){
				this.isclick = true;
				//document.activeElement.blur()
			},
			onblur(){
				this.isclick = false;
			},
			updateFiles(e){
	            console.log(e)
	           	// this.cropper.autoCropWidth=600
	            // this.cropper.autoCropHeight=600
	            this.file = e;
	        },
	        updateFiles1(e){
	            this.file1 = e;
	        }
		}
	}
</script>
<style lang="scss" scoped>
@import  '../theme.scss';
.addGroup{
	padding:0 20px 60px 20px;
	.groupName{
		display:flex;
		width:100%;
		padding-left:25px;
		height:58px;
		box-shadow:$itemShadow;
		margin-bottom:20px;
		span{
			flex:0 0 75px;
			line-height:58px;
		}
		input{
			flex:1;
		}
	}
	.groupList{
		display:flex;
		padding-left:25px;
		position:relative;
		width:100%;
		box-shadow:$itemShadow;
		height:60px;
		margin-bottom:20px;
		span{
			flex:0 0 75px;
			line-height:58px;
		}
		.type{
			flex:1;
			input{
				height:60px;
				width:100%;
				line-height:60px;
				background:url(../../assets/images/group/down@2x.png);
				background-repeat:no-repeat;
				background-position:95% center;
				background-size:16px 9px;
			}
			ul{
				position:absolute;
				top:60px;
				left:0px;
				background:#fff;
				width:100%;
				z-index:999;
				max-height:300px;
				overflow:auto;
				li{
					height:60px;
					line-height:60px;
					font-size:16px;
					padding-left:88px;
				}
			}
		}

	}
	.groupIntroduce{
		padding:22px 0 22px 25px;
		box-shadow:$itemShadow;
		height:125px;
		width:100%;
		margin-bottom:20px;
		display:flex;
		span{
			flex:0 0 75px;
			line-height:18px;
		}
		textarea{
			flex:1;
		}
	}
	
	.addPic{
		position:relative;
		margin-bottom:20px;
		vertical-align: top;
		.uoloader{
			margin-left:-10px;
		}
		h1{
			font-size:15px;
			span{
				font-size:13px;
				color:#999;
			}
		}
		input{
			position:absolute;
			width:100%;
			height:100%;
			opacity:0;
			z-index:99;
		}
		.addBottom{
			overflow:hidden;
			img{
				display:block;
				width:25px;
				height:21px;
				margin:22px auto 11px;
			}
			span{
				display:block;
				text-align:center;
				color:#999;
				font-size:12px;
			}
		}
	}
	button{
		position:fixed;
		height:50px;
		line-height:50px;
		color:#12a4ff;
		font-size:20px;
		width:100%;
		bottom:0px;
		left:0px;
		right:0px;
		box-shadow:$itemShadow;
		background:#fff;
	}
	.isAgree{
		font-size:18px;
		text-decoration: none;
	}
	.hide{
		display:none;
	}
}
	
</style>