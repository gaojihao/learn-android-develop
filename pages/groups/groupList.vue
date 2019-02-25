<template>
    <div class="groupsBox">
        <div class="search">
            <img :src="searchIcon">
            <div><input type="text" @focus='onfocus' placeholder="搜索圈子名称" ></div>
        </div>
        <div class="content">
            <!-- 左边栏 -->
            <div id='menuWrapper' class="menu-wrapper" ref:menu-Wrapper ref='menuWrapper'>
                <ul>
                   <li v-for="(item,index) in groups" :key='index' class="menu-item" :class="{'current':currentIndex===index}"
                        @click="selectMenu(index,item,$event)">
                        <span class="text border-1px">
                            <span  class="icon"></span>{{item.tagDesc}}
                        </span>
                    </li>
                </ul>
            </div>
            <!-- 右边内容区域 -->
            <div class="groups-wrapper" ref:foods-wrapper ref='foodsWrapper'>
                <ul>
                    <li v-for="(item,index) in groupList" :key='index' class="item-list" @click="toGroupDetail(item.ID)">
                        <img :src="item.head.name"  :onerror="defaultImage">
                        <div class="name-title">
                            <span class="title">{{item.title}}</span>
                            <span class="joinNum"><i>{{item.followTotal}}</i>人已加入</span>
                        </div>
                        <button class="btnBlue" v-if="item.auditStatus == 0" @click.stop="join(item, index)">加入圈子</button>
                        <button v-else v-bind:class="{'cheack':item.auditStatus == 2,'joinIn':item.auditStatus== 1}">{{item.auditStatus == 2?"审核中":"已加入"}}</button>
                    </li>
                </ul>
                <no-content :content="content" v-if="!groupList || !groupList.length">
                    <button class="btn-create" @click="create">去创建</button>
                </no-content>
            </div>
        </div>
        <toastMsg v-if='showToast' :title='toastTitle' :content="toastContent" :btn='toastBtn' :type="toastType" :isShowClose='toastShowClose' :isGroupList='true'></toastMsg>
        
    </div>
</template>
<script>
import Vue from 'vue'
import { Navbar, TabItem } from 'mint-ui';
import api from '@/api'
import { mapGetters, mapActions } from 'vuex'
import noContent from '~/components/common/noContent.vue'
import toastMsg from '@/components/common/toastMsg'
import bus from '@/utils/eventbus'
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
export default {
    name:'grouplist',
    components: {
        noContent,
        toastMsg,
    },
    data(){
        return {
            searchIcon:require('../../assets/images/search.png'),
            currentIndex: 0,
            currentMenuItem: null,
            tagId:null,
            contentHeight:0,
            rightHeight:0,
            isMounted:false,
            content: {
                message: '这里还没有学习圈，来创建一个吧~',
                src: require('../../assets/images/no-groups.png')
            },
            defaultImage: 'this.src="' + require('~/assets/images/cover-4x3.png') + '"',
            toastTitle:'承诺书',
            toastContent:'我承诺不在圈子里发布任何违法和侵犯别人知识产权的内容',
            toastBtn:'同意',
            toastType:1,
            showToast:false,
            toastShowClose:true,
            item:null,
            index:null,
        }
    },
    created(){

    },
    mounted(){
        this.isMounted = true;
        this.fetch()
        let screenHeight = document.body.clientHeight;
        let contentTop = this.$refs.foodsWrapper.offsetTop;
        this.contentHeight = screenHeight-contentTop;
        this.rightHeight = this.$refs.foodsWrapper.style.height
        let _self = this;
        bus.$on('close',function(data){
            _self.showToast=data
        })
        bus.$on('btnclickGL',function(data){
            if(data.type == 0){
                _self.joinInApi()
            }else if(data.type == 1||data.type == 2){
                _self.showToast=false
            }
        })
    },
    computed:{
//        getRightHeight:function(){
//            if(!this.isMounted)return
//            return this.$refs.foodsWrapper.getBoundingClientRect().height
//        },
        ...mapGetters({
            groups: 'groups/groups',
            groupList: 'groups/groupList',
            uid: 'common/uid',
        })
    },
    watch:{
//        getRightHeight:function(height){
//            let contHeight = this.contentHeight
//            this.$refs.menuWrapper.style.height = height>=contHeight?height:contHeight
//        }
    },
    methods:{

        ...mapActions({
            getGroupTag: 'groups/getGroupTag',
            getGroupListByTag: 'groups/getGroupListByTag',
            joinGroup: 'groups/joinGroup',
        }),


        async fetch(){
            await this.getGroupTag({
                tagTypes: 1,
                status: 1,
                page: 1,
                size: 999999
            })

            if(this.groups && this.groups.length > 0){
                this.tagId = this.groups[0].id
            }

            if(this.tagId){
                let param = {
                    category:this.tagId,
                    uid: this.uid,
                    page: 1,
                    size: 999999
                }
                await this.getGroupListByTag(param)
            }
        },

        async selectMenu(index,item, event) {
            this.currentIndex = index;
            this.currentMenuItem = item;

            if(item.id){
                let param = {
                    category:item.id,
                    uid: this.uid,
                    page: 1,
                    size: 999999
                }
                await this.getGroupListByTag(param)
            }
        },
        join(item, index){
            this.item=item
            this.index=index
            this.showToast=true
            this.toastType= 0
            this.toastTitle='承诺书'
            this.toastContent='我承诺不在圈子里发布任何违法和侵犯别人知识产权的内容'
            this.toastBtn='同意'
        },
        joinInApi(){
            this.joinGroup({
                index: this.index,
                uid: this.uid,
                topicId: this.item.id,
                followStatus: 1,
            })
            if(this.item.auditFlag==0){
                this.toastShowClose=false
                this.toastTitle='您已成功加入圈子'
                this.toastType=1
                this.toastBtn='我知道了'
                this.toastContent=''
            }else if(this.item.auditFlag==1){
                this.toastShowClose=false
                this.toastTitle='审核中'
                this.toastType=2
                this.toastBtn='我知道了'
                this.toastContent='圈主审核通过后您才可以加入该圈子'
            }
            this.item=null
            this.index=null
        },
        create(){
            this.$router.push(`/groups/addGroup?tagId=${this.currentMenuItem ? this.currentMenuItem.id:  ''}`)
        },
        toGroupDetail(id){
            this.$router.push({name:'groups-groupDetail',query:{id:id}})
        },
        onfocus(){
            this.$router.push({name:'search-search',query:{from:'searchTagName'}})
        }
    },
    beforeDestroy () {
        bus.$off()
    },
}
</script>
<style lang="scss" scoped>
@import  './theme.scss';
.groupsBox{
    .search{
        height:40px;
        display:block;
        background:$basebackground;
        border-radius:5px;
        margin:0 20px;
        overflow:hidden;
        img{
            width:18px;
            margin:13px 0 0 13px;
            float:left;
            display:block;
        }
        div{
            margin-left:35px;
            display:block;
            input{
                height:40px;
                line-height:40px;
                width:100%;
                border:none;
                background:$basebackground;
            } 

        }  
    }
    .content{
        display: flex;
        padding-top:20px;
        height: 84vh;
        .menu-wrapper{
            background:$basebackground;
            font-size:14px;
            overflow:auto;
            -webkit-overflow-scrolling: touch;
            .menu-item{
                color:#666;
                padding: 17px 0;
                overflow: hidden;
                width: 88px;
                text-align: center;
            }
            li.current{
                background:#fff;
                color:#000;
                //border-left: solid 4px $btnColorBlue;
                font-weight: bold;
                position: relative;

                &:after{
                    height: 20px;
                    content: '';
                    position: absolute;
                    left: 0;
                    border: solid 2px $btnColorBlue;
                }
            }
        }
        .groups-wrapper{
            flex:1;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            padding-top: 10px;
            .item-list{
                height:90px;
                display:flex;
                margin-left:10px;
                margin-right: 10px;
                padding:0 10px 0 10px;
                box-shadow:$itemShadow;
                border-radius: 3px;
                align-items:center;
                margin-bottom:8px;
                &:first-child{
                    box-shadow:10px 4px 40px 0 rgba(152,152,152, 0.18);
                }
                img{
                    flex:0 0 61px;
                    width:61px;
                    height:61px;
                    border-radius:5px;
                    object-fit: cover;
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
                        font-size:14px;
                        color:#000;
                        margin-bottom:7px;
                        max-height: 40px;
                        overflow: hidden;
                    }
                }
                button{
                     flex:0 0 60px;
                     width:60px;
                     height:30px;
                     border:0px; 
                     background:#fff; 
                     outline:none;
                     color:#999;
                     border-radius:5px;
                     box-shadow:$itemShadow;
                     font-size:12px;
                     text-align:center;
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
    }

    .btn-create{
        padding: 10px 35px;
        margin-top: 15px;
        background: #fff;
        box-shadow: 0 2px 20px 0 rgba(152, 152, 152, 0.28);
        border-radius: 5px;
        color: #12a4ff;
        font-size: 14px;
    }
}

</style>

<style lang="scss" >
    .mygroup-list{
        .no_content {
            img{
                width: 50% !important;
            }
            .message-title{
                margin-top:10px !important;
            }
        }
    }
</style>
