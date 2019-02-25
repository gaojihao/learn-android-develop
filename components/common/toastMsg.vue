<template>
	<div class="toast">
		<div class="toastMsg">
			<img :src="picType[this.type]">
			<h1 v-if='this.title'>{{this.title}}</h1>
			<span v-if='this.content'>{{this.content}}</span>
			<button @click="btnclick">{{this.btnContent}}</button>
			<i v-if='this.isShowClose' @click='close'></i>
		</div>
		<div class="mask"></div>
	</div>
</template>
<script type="text/javascript">
import bus from '@/utils/eventbus'
	export default {
		name:'toastMsg',
		data(){
			return{
				//0是承诺，1是创建成功，2是审核中
				picType:[
					require('../../assets/images/group/toast1.png'),
					require('../../assets/images/group/toast2.png'),
					require('../../assets/images/group/toast3.png'),
				],
			}
		},
		computed:{
			btnContent:function(){
				return this.btn
			}
		},
		props:['title','content','btn','type','isShowClose','isGroupList'],
		methods:{
			close(){
				bus.$emit('close',false)
			},
			btnclick(){
				let param={
					type:this.type,
				}
				if(this.isGroupList){
					bus.$emit('btnclickGL',param)
				}else{
					bus.$emit('btnclick',param)
				}
				
			}
		},
		mounted(){
			
		}
	}
</script>
<style lang="scss" scoped>
@import  '../../pages/theme.scss';
.toast{
	position:fixed;
	top:0;
	bottom:0px;
	left:0;
	right:0;
	z-index:9999;
	.toastMsg{
		width:80%;
		position:absolute;
		top:50%;
		left:50%;
		margin:-240px 0 0 -40%;
		background:#fff;
		border-radius:10px;
		padding-bottom:26px;
		img{
			width:100%;
		}
		h1{
			font-size:25px;
			color:#000;
			text-align:center;
			margin-top:24px;
		}
		span{
			display:block;
			padding:25px 35px 0;
			font-size:12px;
			text-align:center;
			color:#888;
		}
		button{
			display:block;
			width:200px;
			height:45px;
			line-height:45px;
			font-size:20px;
			color:#fff;
			text-align:center;
			background:$btnColorBlue;
			margin:25px auto 0;
			border-radius:5px;
		}
		i{
			width:35px;
			height:35px;
			position:absolute;
			right:16px;
			top:13px;
			background:url('../../assets/images/group/close.png');
			background-repeat:no-repeat;
			background-position:center;
			background-size:contain;
		}
	}
	.mask{
		width:100%;
		height:100%;
		background:rgba(0,0,0,0.4)
	}
}
	




</style>