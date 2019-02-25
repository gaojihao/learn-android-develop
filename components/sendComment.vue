<template>
    <div>
        <div class="send-comment" v-if="currentValue">
            <div class='comment-text-bg'>
                <div class="comment-text">
                    <textarea ref='textarea' v-model='replyText' :placeholder="placeholder"></textarea>
                </div>
            </div>
            <div class="sendBtn">
                <h1 @click='commentSend' :class="replyText.length > 0 ? '': 'disabled'" >发送</h1>
            </div>
        </div>
        <div class="send-comment-mask" @click="close" @touchstart="close" v-if="currentValue"></div>
    </div>
</template>
<script>

import { Toast , Popup, Indicator} from 'mint-ui'
import utils from '@/utils/utils'
import { mapGetters, mapActions } from 'vuex'
import api from '@/api'
import bus from '@/utils/eventbus'

export default {
    name: 'sendComment',
    components: {
    },

    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
        },
        ID: {
            type: String,
            required: true
        },
        commentId: {
            type: String,
        },
        toReplyId: {
            type: String,
        },
        placeholder: {
            type: String,
        },
    },
    watch:{
        currentValue(val) {
            this.$emit('input', val);
        },

        value(val) {
            this.currentValue = val;
        }
    },
    computed: {
        ...mapGetters({
            uid: 'common/uid',
        }),
    },

    data() {
        return {
            replyText: '',
            currentValue: false,
        }
    },

    mounted(){
        if (this.value) {
            this.currentValue = true;
        }
    },

    methods: {
        ...mapActions({
        }),

        close(){
            this.currentValue = false;
        },

        async commentSend(){
            let that = this;
            let replyText = this.replyText
            if( replyText == ''){
                Toast('评论不能为空哦')
            }else{

                Indicator.open('发表中...')

                let params = {
                    uid : this.uid,
                    blogId: this.ID,
                    content: replyText,
                    commentId: this.commentId ? this.commentId : "0",
                    toReplyId: this.toReplyId ? this.toReplyId : "0", //回复第一层评论是0， //this.currentCommentClickData.user.uid,
                }

                let commentService;
                if(!that.commentId){
                    commentService =  api.groups.groupsComment;
                }else{
                    commentService = api.groups.groupsReplyComment;
                }

                const response = await commentService(params).catch(function(){})

                Indicator.close()

                if (response && response.status === 200) {

                    if(!that.commentId){
                        Toast("评论成功")
                    }else{
                        Toast("回复成功")
                    }

                    that.replyText = '';
                    that.currentValue = false;
                    that.$emit('update', params);
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>

    .send-comment {
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: white;
        display: flex;
        box-shadow: 0 4px 40px 0 rgba(152, 152, 152, 0.28);
        z-index: 999;

        .comment-text-bg {
            margin-left: 15px;
            margin-top: 2.5px;
            margin-bottom: 2.5px;
            border-radius: 5px;
            display: flex;
            flex: 0.8;
            background-color: #fff;
            padding-top: 10px;
            padding-bottom: 10px;
        }
        .comment-text {
            display: flex;
            width: 100%;
            textarea {
                flex: 1;
                height: 82px;
                line-height: 1.4;
                font-size: 14px;
                padding: 5px;
                background: #efefef;
                border-radius: 10px;
            }
        }

        .sendBtn {
            flex: 0.2;
            display: flex;
            flex-direction: column-reverse;
            h1 {
                color: #3385ff;
                font-size: 16px;
                height: 25px;
                line-height: 25px;
                margin-bottom: 16px;
                margin-left: 10px;

                &.disabled {
                    color: #999;
                }
            }
        }
    }

    .send-comment-mask{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        z-index: 90;
    }

</style>