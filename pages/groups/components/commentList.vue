<template>
	<div class="commentListAll">
	    <div class='comment_list_header'>
	      	<div><p class="comment_hint_label">评论</p></div>
	      	<div class="moreReplay" @click='more'>
	      		<p class='coment_count_text'>共<i>{{commentNums}}</i>条评论</p>
	          	<img class="arrowImg" :src="arrowright" alt="arrow">
	      	</div>
	    </div>
	   	<div v-if='commentNums==0' class="noData">
	      <img :src="noDataImg">
	      <h1>沙发等你来抢</h1>
		</div>
	    <ul v-else class='comment_list_bg' >
	    	<commentItem v-for='(item,index) in commentList' :key='item.index' :replyList="item"></commentItem>
	    </ul>
	    <p v-if='!(commentNums==0)' @click="more" class='foward_all_comment'>查看全部评论</p>
	</div>
</template>
<script type="text/javascript">
import commentItem from './commentItem'
	export default{
		name:'commentList',
		props:['commentList','blogId', 'commentNums'],
		data(){
			return{
				isZan:true,
				isFav:false,
				arrowright:require('../../../assets/images/note/detail/arrowright@2x.png'),
				zanBtnImageSrc:require('../../../assets/images/note/detail/zan_selected@2x.png'),
				favBtnImageSrc:require('../../../assets/images/note/detail/fav_normal@2x.png'),
				noDataImg:require('../../../assets/images/no-publish.png'),
				//noData:this.commentNums==0?true:false,
			}
		},
		methods:{
			more(){
				this.$router.push({name:'groups-allComment',query:{id:this.blogId}})
			},
            updateComment(e){
			    this.$emit('update', e);
			}
		},
		components:{
			'commentItem':commentItem,
		},
		mounted(){
			//this.noData=this.commentList.length==0?true:false
		},

	}
</script>
<style lang="scss" scoped>
@import  '../theme.scss';
.commentListAll{
	padding:0 20px;
	.comment_list_header{
	  	display:flex;
	  	justify-content: space-between;
	  	margin:10px 0;
	  	.comment_hint_label{
		  	font-size:18px;
		  	color:#3d3d3d;
		  	font-weight: bold;
		}
		.moreReplay{
			display:flex;
			.coment_count_text{
			  	font-size: 13px;
			  	color:#999999;
			}
			.arrowImg{
			  	width: 5px;
			  	height: 10px;
			  	margin-left: 10px;
			  	margin-top: 4px;
			}
		}
	}
	.comment_count_arrow{
	  display:flex;
	  align-items: flex-end;
	}
	.bottom_footer_placeholder
	{
	  height:40px;
	}

	.foward_all_comment
	{
	  display:flex;
	  margin: 15px;
	  background-color: #f6f5f6;
	  border-radius:5px;
	  height:40.5px;
	  justify-content: center;
	  align-items: center;
	  font-size: 15px;
	  color:#5b5b5b;
	}
	.comment_list_bg{
	  display: flex;
	  margin:10px 0;
	  flex-direction: column;
	}
	.noData{
	    margin-top:50px;
	    font-size:20px;
	    text-align:center;
	    color:#999;
	    padding:0 20px;
	    img{
	        width:225px;
	    }
	    h1{
	        font-size:14px;
	        color:#999;
	        text-align:center;
	        margin-top:32px;
	        height:30px;
	        line-height:30px;
	    }
  	}

}
	
</style>