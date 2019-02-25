<template>
    <div>
        <header-top :name="this.name" ></header-top>
        <div>
            <div class="message-list" >
                <mt-loadmore v-if="messageList && messageList.data.length" :top-method="loadTop" :auto-fill="false"  :bottomMethod="loadBottom" :bottom-all-loaded="allLoaded"  ref="loadmore">
                    <div class="message-item" v-for="(item, index) in messageList.data" :key="item.id"  @click="view(item, index)">
                        <div class="message-header">
                            <div class="icon">
                                <img src="~/assets/images/icon_message.png" />
                                <div class="message-unread" v-if="item.status==0"></div>
                            </div>
                            <div class="title-warp">
                                <div class="title">
                                    {{item.title}}
                                    <div class="time">{{item.createTimeText}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="message-body">{{item.content}}</div>
                        <div class="message-footer" v-if="item.url">
                            <div><a class="btn btn-view">点击查看&nbsp;&gt</a></div>
                        </div>
                    </div>
            　　</mt-loadmore>
            </div>
            <no-content :content="content" v-if="!messageList || !messageList.data.length"></no-content>
        </div>
    </div>
</template>

<script>
import {urlHelper} from '../../utils';
import headerTop from '~/components/common/header.vue'
import noContent from '~/components/common/noContent.vue'
import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'
import { Loadmore, InfiniteScroll } from 'mint-ui';
import api from '@/api'
import Share from '@/utils/share'

export default {
    components: {
        headerTop,
        Loadmore,
        noContent
    },
    data() {
        return {
            name: '消息通知',
            pageSize: 10,
            allLoaded:false,
            content: {
                message: '这里还没有任何信息哦',
                src: require('../../assets/images/no-message.png')
            }
        }
    },
    computed: {
        ...mapGetters({
            messageList: 'ucenter/messageList',
            uid: 'common/uid'
        })
    },
    mounted() {
        this.getMessageListPage()
    },
    methods: {
        ...mapActions({
            getMessageList: 'ucenter/getMessageList',
            updateMessageItem: 'ucenter/updateMessageItem',
        }),

        getMessageListPage: function (page = 1, pos = 'top') {
            let that = this;
            this.getMessageList({
                userId: this.uid,
                page: page,
                size: this.pageSize
            }).then(function (response) {
                if(pos === 'top'){
                    that.$refs.loadmore.onTopLoaded();
                }else{
                    that.$refs.loadmore.onBottomLoaded();
                }
                that.allLoaded = that.messageList.pagination.allLoaded;
                Share({})
            })
        },

        view(item, index){

            let that = this;
            let redirectTo = () => {
                if (item.url) {
                    urlHelper.navigateTo.call(this, {
                        url: item.url
                    })
                }
            }

            if(item.status !== 0){
                redirectTo();
            }else{
                api.ucenter.notifyDetail({
                    userId: this.uid,
                    notifyId: item.notifyId
                }).then(function (res) {
                    that.updateMessageItem({
                        update: function(){
                            item.status = 1;
                        }, index});

                    redirectTo();
                })
            }
        },

        loadTop() {
            this.getMessageListPage(1, 'top')
        },

        loadBottom() {
            if (this.messageList.pagination.hasMore) {
                this.getMessageListPage(this.messageList.pagination ? this.messageList.pagination.currentPage + 1 : 1, 'bottom');
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .message-list{
        background: #f5f5f5;
        padding: 16px 20px 6px;
        font-size: 15px;
        .mint-loadmore{
            min-height: 82.5vh;
        }
        .loading{
            text-align: center;
            font-size: 13px;
        }
    }
    .message-item{
        background: #fff;
        border-radius: 4px;
        margin-bottom: 15px;
        box-shadow: 0 2px 20px rgba(152,152,152, 0.28);
        padding-top: 15px;
        .icon{
            img{
                height: 32px;
                width: 32px;
            }
            display: inline;
            position: relative;
        }
        .title-warp{
            flex: 1;
            clear: both;
        }
        .title{
            font-size: 18px;
            margin-top: 4px;
            padding-left: 10px;
        }
        .time{
            float: right;
            font-size: 13px;
            color: #666;
            margin-top: 4px;
        }
        .message-header{
            display: flex;
            padding: 0 15px 15px;
            /*border-bottom: solid 1px #eee;*/
        }
        .message-body{
            color: #666;
            padding: 15px;
            /*border-bottom: solid 1px #eee;*/
        }
        .message-footer{
            padding: 10px 15px 5px;
            text-align: center;
        }
        .btn-view{
            color: #12a4ff;
            padding: 10px;
            display: inline-block;
            text-decoration: none;
        }
        .message-unread{
            position: absolute;
            right:-2px;
            top:-2px;
            border-radius:100%;
            background-color:#e33244;
            line-height:1;
            display:block;
            font-size:14px;
            text-align:center;
            color:#fff;
            height:8px;
            width:8px;
        }
    }
</style>
