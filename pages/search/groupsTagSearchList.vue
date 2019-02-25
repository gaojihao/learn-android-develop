<template>
	<div class="groups-wrapper" ref:foods-wrapper ref='foodsWrapper'>
        <ul>
            <li v-for="(item,index) in resultList" :key='index' class="item-list" @click='groupDetail(item.ID)'>
                <img :src="item.cover.name">
                <div class="name-title">
                    <span class="title">{{item.title}}</span>
                    <span class="joinNum"><i>{{item.followTotal}}</i>人已加入</span>
                </div>
                <button class="btnBlue" v-if="item.auditStatus&&item.auditStatus == 0">加入圈子</button>
                <button v-bind:class="{'cheack':item.auditStatus&&item.auditStatus == 2,'joinIn':item.isFollow&&item.auditStatus == 1}" v-else>{{item.auditStatus&&item.auditStatus == 2?"审核中":"已加入"}}</button>
            </li>
        </ul>
    </div>
</template>
<script type="text/javascript">	
import api from '@/api'
	export default{
		name:'groupsTagSearchList',
		data(){
			return{

			}
		},
		mounted(){
		},
        props:['resultList'],
		methods:{
            groupDetail(id){
                this.$router.push({name:'groups-groupDetail',query:{id:id}})
            }
		}
	}
</script>
<style lang="scss" scoped>
@import  '../theme.scss';
.groups-wrapper{
    padding:0 20px;
    margin-top:10px;
    .item-list{
        height:90px;
        display:flex;
        padding:0 20px 0 15px;
        box-shadow:$itemShadow;
        border-radius:3px;
        align-items:center;
        margin-bottom:15px;
        img{
            flex:0 0 61px;
            width:61px;
            height:61px;
            border-radius:10px;
        }
        .name-title{
            flex:1;
            padding:0 7px;
            span{
                display:block;
                i{
                    font-style:normal;
                }
            }
            .joinNum{
                font-size:13px;
                color:#999;
                margin-top:7px;
            }
            .title{
                font-size:15px;
                color:#000;
                margin-bottom:7px;
            }
        }
        button{
             flex:0 0 65px;
             width:65px;
             height:40px; 
             border:0px; 
             background:#fff; 
             outline:none;
             color:#999;
             border-radius:5px;
             box-shadow:$itemShadow;
        } 
        .btnBlue{
            background:$btnColorBlue;
            color:#fff;
        } 
        .cheack{
            color:#f8bf37;
        } 
        .joinIn{
            color:#999;
        }
    }
}
	
</style>