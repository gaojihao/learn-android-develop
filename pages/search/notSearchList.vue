<template>
	<ul class="noteList">
	  	<li class="note_item" v-for="(item, index) in notes" :key="item.id" v-show="sortByType != 'course'">
	      	<div class="note_container" @click="gotoArticalDetail(item)">
		         <div v-bind:class="[index === 0 ? 'mark_1' : (index === 1 ? 'mark_2':(index === 2 ? 'mark_3':'')), 'mark']">
		            <span class="num">{{index+1}}</span>
		            <div class="jiahao"></div>
		        </div>
		        <div class="note_cell_container">

		            <img :src=item.headImg alt="" class="note_cell_container_img">
		            <div class="note_info">
		                <h3>{{item.title}}</h3>
		                <div class="note_auther_date">
		                    <span>{{item.name}}</span>
		                    <span class="item-data">{{item.date}}</span>
		                </div>
		            </div>
		        </div>
		        <div class="note_cell_bottom">
		            <div class="smallItem" @click.stop="noteCollect(index,item)">
		                <img  v-if="item.stared" class="smallImg" src="../../assets/images/star_hightlight.png">
		                <img v-else class="smallImg" src="../../assets/images/star.png" >
		                <span class="smallText" v-bind:class="{starActive:item.stared}">{{item.star}}人</span>
		            </div>
		            <div class="smallItem middleItem" @click.stop="noteLike(index,item)">
		                <img v-if="item.zaned" class="smallImg" src="../../assets/images/zan_highlight.png" >
		                <img v-else class="smallImg" src="../../assets/images/zan.png">
		                <span class="smallText" v-bind:class="{zanActive:item.zaned}">{{item.zan}}人</span>
		            </div>
		            <div class="smallItem">
		                <img class="readImg" src="../../assets/images/read.png" alt="">
		                <span class="smallText">{{item.read}}人</span>
		            </div>
	          	</div>
	      	</div>
	  	</li>
	</ul>
</template>
<script type="text/javascript">
import { mapGetters, mapActions } from 'vuex'
	export default{
		name:'searchNote',
		data(){
			return{

			}
		},
		props:['notes'],
		methods:{
			...mapActions({
	            getCollegeList: 'note/getCollegeList',
	            getNoteList: 'note/getNoteList',
	            noteCollect: 'note/noteCollect',
	            noteLike: 'note/noteLike',
	            noteRead: 'note/noteRead',
	        }),
			async gotoArticalDetail(item){
	            this.$router.push('/note/ArticalDetail',{noteId: item.id})
	        },
		}
	}
</script>
<style lang="scss" scoped>
@import  '../theme.scss';
.noteList{
	.note_item{

	    margin-left:20px;
	    margin-right:20px;
	    margin-top: 10px;
	    margin-bottom:20px;
	    background-color: white;
	}
	.item-data{
	    font-size: 13px;
	}
	.mark{
	    position: absolute;
	    top: 0;
	    right: 15px;
	    width: 22px;
	    height: 30px;
	    background-color: #BDBEBE;
	    display: flex;
	    justify-content: center;
	    align-content: center;
	}

	.mark_1{
	    background-color: #FC8327;
	}

	.mark_2{
	    background-color: #FACD44;
	}

	.mark_3{
	    background-color: #48AEFB;
	}

	.num{
	    color: white;
	    font-size: 10px;
	    align-self: center;
	    margin-bottom:5px;
	}

	.jiahao{
	    position: absolute;
	    height: 0px;
	  width: 0px;
	  left: 0;
	  bottom: -1px;
	  border-left: 11px solid transparent;
	  border-right: 11px solid transparent;
	  border-bottom: 6px solid white;
	}

	.note_container{
	    border-radius: 5px;
	    box-shadow:0 0 2.5px 20px #FAFAFA;
	    position: relative;
	}

	.note_cell_container{
	    padding: 20px 10px;
	    display: flex;
	    flex-direction: row;
	    border-bottom:0.5px solid #FAFAFA;
	}
	.note_cell_container .note_cell_container_img{
	    width: 60px;
	    height: 60px;
	    border-radius: 5px;
	}

	.note_category{
	    width: 50px;
	    height: 50px;

	}

	.head{
	    width: 20px;
	    height: 20px;
	    margin-right:4px;
	}

	.note_info{
	    margin-left:7px;
	    display: flex;
	    flex-direction: column;
	    flex: 1;
	}

	.note_auther_date{
	    display: flex;
	    margin-top:4px;
	    justify-content:space-between;
	    align-items: center;
	    color: #696969;
	    font-size: 12px;
	}

	.note_cell_bottom
	{
	    display: flex;
	    flex-direction: row;
	    justify-content: space-around;
	    padding: 10px 0;
	    align-items: center;
	}

	.smallItem{
	    display: flex;
	    flex-direction: row;
	    align-items: center;
	    flex: 1;
	    justify-content: center;
	}

	.middleItem{
	    border-left:0.5px solid #eee;
	    border-right:0.5px solid #eee;
	}

	.smallImg{
	    width: 16px;
	    height: 16px;
	}

	.readImg{
	    width: 16px;
	    height: 13px;
	}

	.smallText{
	    margin-left:4px;
	    font-size: 10px;
	    color: #999;
	}

	.starActive{
	    color: #48AEFB;
	}

	.zanActive{
	    color: #FC8327;
	}
}
</style>