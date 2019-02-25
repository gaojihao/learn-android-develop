<template>
	<div>
		<div v-if="!onfouce" class="comment_input_footer" id="footer">
			<div class='comment_textfield_bg' :class="{'onfouce':onfouce,'isAllComment':isAllComment}">
				<input type="text"  class="comment_textfield" id="input" :placeholder="placeholder" @focus='inputText' @blur="commentBlur" >
			</div>
			<div v-if='!isAllComment' class="commonBlur">
				<div class="commment_footer_zan_star">
					<img v-on:click='zanAction' class="zan_star_img" v-bind:src="zanBtnImageSrc" alt="">
					<p v-bind:class="[WisZan ? 'people_count_zan' : 'peogle_count_unselected']">{{WlikeTotal}}人</p>
				</div>
				<div  class="commment_footer_zan_star">
					<img v-on:click='favAction' class="zan_star_img" v-bind:src="favBtnImageSrc" alt="">
					<p v-bind:class="[WisFav ? 'people_count_fav' : 'peogle_count_unselected']">{{WcollectedTotal}}人</p>
				</div>
			</div>
		</div>
		<send-comment v-model="onfouce" :ID="this.blogId" placeholder="随便说点什么吧！" @update="updateComment"></send-comment>
	</div>
</template>
<script type="text/javascript">
import api from '@/api'
import bus from '@/utils/eventbus'
import { InfiniteScroll , Actionsheet , Indicator , Toast} from 'mint-ui';
import sendComment from '@/components/sendComment'
import { mapGetters, mapActions } from 'vuex'
	export default{
		name:'write',
        components:{
            sendComment,
        },
		data(){
			return{
				onfouce:false,
				placeholder:'评论',
				replyText:'',
				keyupShow:true,
				commentId:null,
				// WisZan:null,
				// WisFav:null,
				// WlikeTotal:null,
				// WcollectedTotal:null,
				toReplyId:null,
				zanKey:null,
				favKey:null,
				zanStatu:false,
				favStatu:false,
			}
		},
		computed: {
	        ...mapGetters({
	            uid: 'common/uid',
	            userInfo:'common/userInfo',
	        }),
	        zanBtnImageSrc:function(){
	        	return this.WisZan?require('../../assets/images/note/detail/zan_selected@2x.png'):require('../../assets/images/note/detail/zan_normal@2x.png')
	        },
	        favBtnImageSrc:function(){
	        	return this.WisFav?require('../../assets/images/note/detail/fav_selected@2x.png'):require('../../assets/images/note/detail/fav_normal@2x.png')
	        },
	        WcollectedTotal:function(){ 
	        	if(this.favKey=='add'&&!this.isFav){
	        		return Number(this.collectedTotal)+1 
	        	}else if(this.favKey=='del'&&this.isFav){
	        		return Number(this.collectedTotal)-1
	        	}else{
	        		return Number(this.collectedTotal)
	        	}     
	        },
	        WlikeTotal:function(){
	        	if(this.zanKey=='add'&&!this.isZan){
	        		return Number(this.likeTotal)+1 
	        	}else if(this.zanKey=='del'&&this.isZan){
	        		return Number(this.likeTotal)-1
	        	}else{
	        		return Number(this.likeTotal)
	        	}
	        },
	        WisFav:function(){
	        	return this.favStatu?!this.isFav:this.isFav	
	        },
	        WisZan:function(){
	        	return this.zanStatu?!this.isZan:this.isZan	 
	        }
	    },
	    props:['blogId','isFav','isZan','likeTotal','collectedTotal','isAllComment'],
		mounted(){
			let _self=this
			// this.WisZan=this.isZan,
			// this.WisFav=this.isFav,
			// this.WlikeTotal=this.likeTotal,
			// this.WcollectedTotal=this.collectedTotal,
			bus.$on('reply',function(data){
				_self.onfouce=true
				debugger
				//_self.$refs.textarea.focus
				_self.commentId=data.commentId
				_self.toReplyId=data.toReplyId
				_self.placeholder= "回复："+data.nickName
			})
		},
		beforeDestroy () {
		    bus.$off()
		},
		methods:{
			inputText(){
	      		this.placeholder='随便说点什么吧！'
	      		this.onfouce=true
	      	},
	      	commentBlur(){

	      	},
			keyup(){
	      		this.keyupShow=false
	      	},
	      	zanAction(event){
		        let _self = this
		        let params = {
					blogId:this.blogId,
					uid:this.uid,
					type:1,
					status:this.WisZan?0:1
				}
		        api.groups.Like(params).then(res=>{
					if(res.status == 200){
						_self.zanKey=_self.WisZan?'del':'add'
						_self.zanStatu = !_self.zanStatu
					}
				}).catch(err=>{
					//alert(err)
				})
		        
	      	},
	      	favAction(event){
	      		let _self = this
		        let params = {
					blogId:this.blogId,
					uid:this.uid,
					status:this.WisFav?0:1
				}
		        api.groups.Collect(params).then(res=>{
					if(res.status == 200){
						_self.favKey=_self.WisFav?'del':'add'
						_self.favStatu = !_self.favStatu
						// _self.WisFav?_self.WcollectedTotal--:_self.WcollectedTotal++
						// _self.WisFav = !_self.WisFav
					}
				}).catch(err=>{
					//alert(err)
				})
		        
	      	},

            updateComment(e){
	      	  this.$emit('updateComment', e)
			},
	      	async commentSend(){
	      		let replyText = this.replyText
	      		if(replyText==''){
	      			Toast('评论不能为空哦')
	      		}else{
	      			Indicator.open('发表中...')
	      			if(!this.commentId){
	      				const response = await api.groups.groupsComment(
				          {
				            blogId: this.blogId,
				            //commentId: this.currentCommentClickData.ID,
				            uid : this.uid,//TODD,
				            //toReplyId: "0", //回复第一层评论是0， //this.currentCommentClickData.user.uid,
				            content: replyText
				          }
				        )

				        if (response.status == 200) {
				        	Indicator.close()
				              console.log(response.data)
				              Toast("评论成功")
				              //reset status
				              this.placeholder = "评论"
				              this.onfouce=false
				              this.commentId=null
				              this.replyText=''
				              bus.$emit('sendSucess')
				              //this.getComments()
				        }else{
				        	Indicator.close()
				        }
	      			}else{
	      				let toReplyId=this.toReplyId?this.toReplyId:'0'
	      				const response = await api.groups.groupsReplyComment(
				          {
				            blogId: this.blogId,
				            commentId: this.commentId,
				            uid : this.uid,//TODD,
				            toReplyId: toReplyId, //回复第一层评论是0， //this.currentCommentClickData.user.uid,
				            content: replyText
				          }
				        )

				        if (response.status == 200) {
				        		Indicator.close()
				              console.log(response.data)
				              Toast("回复成功")
				              //reset status
				              this.placeholder = "评论"
				              this.onfouce=false
				              this.replyText=''
				              this.commentId=null
				              bus.$emit('sendSucess')
				              //this.getComments()
				        }else{
				        	Indicator.close()
				        }
	      			}
			        
	      		}
	      		
	      	}
		}

	}
</script>
<style lang="scss" scoped>
@import  '../../pages/theme.scss';
.comment_input_footer {
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
		  	height:40px;
		}
	}
	.onfouce{
		flex:0.8;
		background-color:#fff;
		padding-top:15px;
		.textarea{
			display:flex;
			width:100%;
			textarea{
				flex:1;
				height:90px;
				line-height:25px;
				padding-left:11px;
			}
			i{
				width:0.5px;
				background:#12a4ff;
				height:14px;
				margin-top:4px;
			}
		}
		
	}
	.isAllComment{
		flex:1;
		margin:2.5px 15px;
	}
	.sendBtn{
		flex:0.2;
		display:flex;
		flex-direction:column-reverse;
		h1{
			color:#999;
			font-size:16px;
			height:25px;
			line-height:25px;
			margin-bottom:16px;
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
}
</style>