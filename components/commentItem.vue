<template>
    <li class='comment_item_bg'>
        <div class="avatar_name_label_container">
            <img class="user_head_image"
                 src="../assets/images/note/detail/useravatar@2x.png"
                 alt="user avartar">
            <div class='user_name_commenttime'>
                <p class='user_name_para'>{{replyList?replyList.user.nickName:''}}</p>
                <p class='comment_time_para'>{{replyList.createTime | formatPublishTime(now) }}</p>
            </div>
            <div class="setReport"
                 @click='setReport(replyList.blogId,replyList.id)'></div>
        </div>
        <p class='content_container'
           @click='reply(replyList.id, replyList.user ? replyList.user.nickName: "")'>{{replyList.content}}</p>
        <div class='feedback_list_bg'
             v-if='replyList.replyList&&replyList.replyList.length>0'>
            <div class='feedback_list_item'
                 v-for="feedbackitem in replyList.replyList"
                 @click='reply(feedbackitem.commentId, (feedbackitem.user ? feedbackitem.user.nickName : ""), feedbackitem.id)'>
                <div class='feedback_username'>
                    <i>{{feedbackitem.user?feedbackitem.user.nickName:''}}:</i>
                    <span v-if='feedbackitem.replyUser'>回复
                        <i>{{feedbackitem.replyUser?feedbackitem.replyUser.nickName:''}}:</i>
                    </span>
                </div>
                <p class='feedback_content'>{{feedbackitem.content}}<br></p>
            </div>
        </div>
        <send-comment v-model="showReplyBox"
                      :ID="replyList.blogId"
                      :commentId="replayCommentId"
                      :toReplyId="replayToReplyId"
                      :placeholder="replayPlaceholder"
                      @update="updateComment"></send-comment>
        <complain class='complain'
                  v-if='complainShow'
                  :type='complainType'
                  :blogId='complainBlogId'
                  :refId='complainRefId'
                  @hide="complainShow = false"></complain>
    </li>
</template>
<script>
import { formatPublishTime } from '../utils/formatter'
import complain from '~/components/complain'
import sendComment from '@/components/sendComment'
import bus from '@/utils/eventbus'
export default {
    name: 'commentItem',
    props: ['replyList'],
    data() {
        return {
            complainShow: false,
            complainType: '2',
            complainBlogId: '',
            complainRefId: '',
            showReplyBox: false,
            replayCommentId: '',
            replayPlaceholder: '',
            replayToReplyId: '',
            now: new Date()
        }
    },
    components: {
        complain,
        sendComment
    },
    filters: { formatPublishTime },
    methods: {
        setReport(blogId, id, e) {
            this.complainShow = true
            this.complainBlogId = blogId
            this.complainRefId = id
        },

        reply(id, nickName, toReplyId) {
            this.showReplyBox = true
            this.replayCommentId = id
            this.replayToReplyId = toReplyId
            this.replayPlaceholder = `回复 ${nickName}：`
        },

        updateComment(e) {
            this.$emit('update', e)
        }
    },
    mounted() {
        let _self = this
        bus.$on('close', function() {
            _self.complainShow = false
        })
    }
}
</script>


<style lang="scss" scoped>
.comment_item_bg {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    position: relative;
}

.avatar_name_label_container {
    display: flex;
    flex-direction: row;
}

.content_container {
    margin-left: 38px;
    margin: 10px 0 10px 38px;
    font-size: 15px;
}

.user_head_image {
    width: 30.5px;
    height: 30.5px;
}

.user_name_para {
    margin-left: 10px;
    font-size: 14px;
}

.comment_time_para {
    margin-left: 12px;
    color: #8e8e8e;
}

.user_name_commenttime {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.feedback_list_bg {
    display: flex;
    flex-direction: column;
    padding: 3px 10px 15px 15px;
    margin-left: 38px;
    margin-top: 10px;
    background-color: #f7f7f7;
}

.feedback_list_item {
    display: block;
    word-break: break-all;
    margin-top: 8px;
    font-size: 15px;
}

.feedback_username {
    height: 15px;
    display: inline-block;
    word-break: break-all;
    i {
        color: #00a4fb;
    }
}

.feedback_content {
    color: #333333;
    margin-left: 5px;
    display: inline;
    word-break: break-all;
}
.setReport {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    background: url(../assets/images/more.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 20px 20px;
}
.complain {
    position: absolute;
    top: 22px;
    right: 0px;
}
</style>
