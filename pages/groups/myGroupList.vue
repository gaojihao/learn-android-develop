<template>
    <div class="bg">
        <!-- 我创建的圈子 -->
        <div class="mygroup-list">
            <div class="title"><i class="icon"></i><span>我创建的圈子</span></div>
            <div class="con">
                <div class="box" v-for="item in createdGroup" :key="item.index" @click='groupDetail(item.topicIdStr)'>
                    <img :src="item.headUrl" :onerror="defaultImage">
                    <div class="decbox"><span class="dec"><i v-if="item.isNew"></i>{{item.title}}</span></div>
                </div>
                <div class="box add" @click="addGroup">
                    <img :src="addIcon" alt="">
                    <p >创建圈子</p>
                </div>
            </div>
        </div>
        <!-- 我加入的圈子 -->
        <div class="mygroup-list" id="pt">
            <div class="title mt"><i class="icon"></i><span>我加入的圈子</span></div>
            <div class="con">
                <div class="box" v-for="item in joinGroup" :key="item.index" @click='groupDetail(item.id)'>
                    <img :src="item.head.name" :onerror="defaultImage">
                    <p class="decbox">{{item.title}}</p>
                </div>
            </div>
            <no-content :content="content" v-if="!joinGroup || !joinGroup.length">
                <button class="btn-go" @click="go">去逛逛</button>
            </no-content>
        </div>
    </div>
</template>
<script>
import api from '@/api'
import store from '@/store/common'
import { mapGetters, mapActions } from 'vuex'
import noContent from '~/components/common/noContent.vue'
export default {
    name:'mygrouplist',
    components: {
        noContent
    },
    data(){
        return{
            addIcon:require('../../assets/images/addgroup.png'),
            content: {
                message: '囧！ 还未加入任何圈子，快去逛逛吧~',
                src: require('../../assets/images/no-groups.png')
            },
            defaultImage: 'this.src="' + require('~/assets/images/cover-4x3.png') + '"',
        }
    },
    computed: {
        ...mapGetters({
            uid: 'common/uid',
            createdGroup: 'groups/createdGroup',
            joinGroup: 'groups/joinGroup'
        })
    },
    mounted(){
        // 获取页面数据
        this.initData()
    },
    methods:{

        ...mapActions({
            getCreatedGroup: 'groups/getCreatedGroup',
            getJoinGroup: 'groups/getJoinGroup',
            setGroupIndexType: 'groups/setGroupIndexType',
        }),

        async initData (){
            await this.getCreatedGroup({
                userId: this.uid,
            });

            await this.getJoinGroup({
                hostPuid:this.uid,
                page:1,
                size:9999,
            })
        },
        addGroup(){
            this.$router.push('/community/addGroup')
        },
        groupDetail(id){
            this.$router.push({name:'groups-groupDetail',query:{id:id}})
        },
        go(){
            this.setGroupIndexType(2);
        }
    }
}
</script>
<style lang="scss" scoped>
@import  './theme.scss';
.bg{
    background: $basebackground;
    #pt{
        padding-top:26px;
    }
}

.mygroup-list{
    width:100%;
    padding:0px 5% 30px 5%;
    margin: 0px 0px 10px 0px;
    background:#fff;
    .title{
        font-size:15px;
        color:$baseFontColor;
        letter-spacing:1px;
        display:flex;
        align-items:center;
        .icon{
            background-color:$baseIconColor;
            width:5px;
            height: 15px;
            border-radius: 2px;
            margin-right:5px;
        }
    }
    .con{
        display: flex;
        flex-wrap:wrap;
        justify-content:flex-start;
        text-align: left;
        .box{
            flex:0 0 100px;
            margin-top:15px;
            margin-right:10px;
            border-radius: 5px;
            box-shadow: 0 4px 40px rgba(152,152,152,0.28);
            text-align: center;
            
            img{
                width:100px;
                height: 75px;
                border-radius: 5px 5px 0 0;
                object-fit: cover;
            }
            .decbox{
                padding:5px 5px;
            }
            .dec{
                position: relative;
                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                word-break: break-all;
                i{
                    display:inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius:5px;
                    position: absolute;
                    background:$baseTipsColor;
                    right:-12px;
                }
            }
        }
        .add{
            min-height: 100px;
            img{ 
                margin: 20px 0 15px 0;
                width:44px;
                height: 44px;
            }
        }
    }

    .btn-go{
        padding: 10px 35px;
        margin-top: 15px;
        background: #fff;
        box-shadow: 0 2px 20px 0 rgba(152, 152, 152, 0.28);
        border-radius: 5px;
        color: #12a4ff;
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
