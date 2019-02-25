<template>
    <div id="activity-details">
        <head-top :name="activityDetails.topicName"
                  :back="this.back"
                  :className="this.className"
                  :backgroundColor="this.backgroundColor"></head-top>
        <div class="user">
            <div class="user-left">
                <div :style="{backgroundImage:formartAvatar(activityDetails.author&&activityDetails.author.user&&activityDetails.author.user.avatar)}"
                     class="avator"></div>
                <div class="user-name">{{ activityDetails.author&&activityDetails.author.user&&activityDetails.author.user.nickName }}</div>
            </div>
            <div class="time">{{ activityDetails.publishDate }}</div>
        </div>
        <div class="address">
            <div class="title">{{activityDetails.title}}</div>
            <div class="row">
                <div class="row-left">活动时间：</div>
                <div class="row-right">{{ `${formartTime(activityDetails.activityStartDate)} - ${showActivityEndDate}`}}</div>
            </div>
            <div class="row">
                <div class="row-left">报名时间：</div>
                <div class="row-right">{{ `${formartTime(activityDetails.activityEnrollStartDate)} - ${formartTime(activityDetails.activityEnrollEndDate)}`}}</div>
            </div>
            <div class="row">
                <div class="row-left">活动地点：</div>
                <div class="row-right">{{ activityDetails.activityAddress }}</div>
            </div>
            <div class="row">
                <div class="row-left">所需人数：</div>
                <div class="row-right">{{ `${activityDetails.activityLimitNum}人` }}</div>
            </div>
        </div>
        <div class="introduce">
            <p class="title">活动介绍</p>
            <p class="content"
               v-html="formartContent(activityDetails.content)" />
        </div>
        <div class="pic">
            <img :src="img.uploadImage.img.name" v-for='(img,index) in activityDetails.mediaList' :index='index' @click="previewClick(img,index)">
            </div>
        <div class="member-box">
            <mt-cell class="member"
                     title="已报名成员"
                     :to="`/activity/member?blogId=${blogId}`"
                     :value="activityDetails.activityEnrollNum"
                     is-link></mt-cell>
            <div class="avator-list">
                <div v-for="(item,index) in groupMemberList"
                     class="avator"
                     :key="index"
                     :style="{backgroundImage:formartAvatar(item.avatar)}"></div>
                <div v-if="groupMemberList.length>6"
                     class="line">......</div>
            </div>
        </div>

        <div class="enroll"
             @click="enroll">报名</div>
        <write :blogId="blogId"
               :isZan="activityDetails.likeStatus"
               :isFav="activityDetails.isCollect"
               :likeTotal="activityDetails.likes || 0"
               :collectedTotal="activityDetails.collectedTotal || 0"
               :isAllComment="false"
               @updateComment="updateComment"></write>
        <commentList class="comment-list"
                     :commentList='commentList.uisCommentOutput'
                     :blogId='blogId'
                     :commentNums="commentList.commentNums"></commentList>
        <gallary v-if="showGallary" :imgs="images" :activeIndex="activeIndex" @close="handleGallaryClose"></gallary>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import { Toast } from 'mint-ui'
moment.locale('zh-cn')
import write from '~/components/common/write.vue'
import head from '../../components/common/header'
import commentList from '~/components/commentList'
import Gallary from '~/components/common/gallary.vue'
import api from '@/api'
import Share from '@/utils/share'

export default {
    components: {
        headTop: head,
        'gallary':Gallary,
        commentList,
        write
    },
    data() {
        return {
            isAgree: false,
            back: 0,
            className: 1,
            backgroundColor: '1',
            blogId: this.$route.query.blogId,
            activeIndex : 1,
            showGallary:false,
        }
    },
    computed: {
        ...mapGetters({
            activityDetails: 'activity/activityDetails',
            groupMemberList: 'activity/groupMemberList',
            commentList: 'activity/commentList',
            uid: 'common/uid'
        }),
        images:  function () {
            let images = [];
            if(this.activityDetails.mediaList && this.activityDetails.mediaList.length){
                return this.activityDetails.mediaList.map(function (item) {
                    return item.uploadImage.img.name;
                })
            }
            return images;
        },
        showActivityEndDate:function(){
            return this.activityDetails.activityEndDate?this.formartTime(this.activityDetails.activityEndDate):"待定"
        }
    },
    async mounted() {
        await this.getActivityDetails({
            ID: this.blogId,
            uid: this.uid
        })
        this.getGroupMemberList({
            blogId: this.blogId,
            page: 1,
            size: 6
        })
        this.getcommentList({
            blogId: this.blogId,
            uid: this.uid,
            sortFlag: 1,
            page: 1,
            size: 10
        })

        Share({
            title: this.activityDetails.title,
            desc: this.activityDetails.content,
            imgUrl: this.activityDetails.mediaList && this.activityDetails.mediaList.length > 0 ? this.activityDetails.mediaList[0].uploadImage.img.name : null,
        })

    },
    methods: {
        ...mapActions({
            getActivityDetails: 'activity/getActivityDetails',
            getGroupMemberList: 'activity/getGroupMemberList',
            getcommentList: 'activity/getcommentList'
        }),
        formartContent(content) {
            if (content) {
                return content.replace(/\n/g, '<br/>')
            }
        },
        async enroll() {
            const res = await api.activity.enroll({
                blogId: this.blogId,
                uid: this.uid
            })
            if (res.status === 200) {
                Toast('报名成功')
                this.getGroupMemberList({
                    blogId: this.blogId,
                    page: 1,
                    size: 6
                })
                this.getActivityDetails({
                    ID: this.blogId,
                    uid: this.uid
                })
            }
        },
        updateComment() {
            this.getcommentList({
                blogId: this.blogId,
                uid: this.uid,
                sortFlag: 1,
                page: 1,
                size: 10
            })
        },
        formartAvatar(data) {
            return data ? `url(${data})` : 'url(/images/avator.png)'
        },
        formartTime(time) {
            if (time) {
                return moment(parseInt(time)).format('YYYY-MM-DD HH:mm:ss')
            }
            return ''
        },
        previewClick (file, index) {
            this.activeIndex = index
            this.showGallary = true
        },
        handleGallaryClose () {
            this.showGallary = false
        },
    }
}
</script>

<style lang="less">
#activity-details {
    padding: 0 20px;
    .comment-list {
        padding: 0;
    }
    .user {
        height: 34px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .user-left {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .avator {
                width: 30px;
                height: 30px;
                border-radius: 15px;
                background-color: #f0f0f0;
                background-image: url('../../assets/images/star.png');
                background-repeat: no-repeat;
                background-size: cover;
                margin-right: 10px;
            }
        }
        .time {
            font-size: 15px;
            color: #999;
        }
    }
    .address {
        padding-bottom: 8px;
        .title {
            font-size: 17px;
            color: #333;
            line-height: 28px;
            margin: 8px 0;
        }
        margin: 8px 0;
        font-size: 15px;
        line-height: 26px;
        color: #666;
        .row {
            display: flex;
            .row-left {
                flex: 3;
            }
            .row-right {
                flex: 10;
            }
        }
    }
    .introduce {
        line-height: 18px;
        .title {
            margin-bottom: 10px;
            font-size: 16px;
            line-height: 24px;
            color: #333333;
        }
        .content {
            font-size: 15px;
            color: #666;
            line-height: 24px;
        }
    }
    .pic{
        margin-top:15px;
        img{
            width:105px;
            height:105px;
            margin-right:10px;
            border-radius:5px;
            object-fit:cover;
        }
        img:last-child{
            margin-right:0px;
            object-fit:cover;
        }
    }
    .member {
        .mint-cell-wrapper {
            background-image: url();
        }
        .mint-cell-value.is-link {
            margin-right: 16px;
        }
        &.mint-cell:last-child {
            background-image: url();
        }
        .mint-cell-text {
            font-size: 15px;
            margin-left: -10px;
            position: relative;
        }
        .mint-cell-allow-right::after {
            width: 10px;
            height: 10px;
            right: 10px;
        }
    }
    .avator-list {
        // padding: 0px 20px 34px 20px;
        background: #fff;
        position: relative;
        margin-bottom: 10px;
        .avator {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-color: #eee;
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 30px;
            margin-right: 5px;
        }
        .line {
            position: relative;
            top: -18px;
            left: 6px;
            display: inline-block;
            width: 40px;
            height: 40px;
            line-height: 40px;
            color: #999;
            font-size: 14px;
        }
    }

    .enroll {
        margin: 50px auto;
        font-size: 20px;
        color: #12a4ff;
        width: 76px;
        height: 76px;
        border-radius: 38px;
        text-align: center;
        line-height: 75px;
        box-shadow: 0px 4px 40px 0px rgba(152, 152, 152, 0.28);
        &:active {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }

    .comment_list_header {
        display: flex;
        justify-content: space-between;
        margin: 10px;
    }
    .comment_count_arrow {
        display: flex;
        align-items: flex-end;
    }
    .coment_count_text {
        font-size: 10px;
        color: #999999;
    }
    .arrowImg {
        width: 5px;
        height: 9px;
        margin-left: 5px;
        margin-bottom: 4px;
    }
    .comment_hint_label {
        font-size: 17px;
        color: #3d3d3d;
        font-weight: bold;
    }
    .comment_input_footer {
        width: 100%;
        height: 40px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: white;
        display: flex;

        box-shadow: 0px 0px 5px #e9e9e9;

        .comment_textfield_bg {
            margin-left: 15px;
            margin-top: 2.5px;
            margin-bottom: 2.5px;
            flex: 0.6;
            background-color: #f1f1f1;
            border-radius: 5px;
            display: flex;
        }
        .comment_textfield {
            border: none;
            flex: 1;
            background-color: rgba(0, 0, 0, 0);
            margin-left: 10px;
        }
        .commment_footer_zan_star {
            display: flex;
            flex-direction: column;
            flex: 0.2;
            justify-content: center;
            align-items: center;
        }
        .zan_star_img {
            width: 15px;
            height: 15px;
        }
        .people_count_zan {
            color: #ff832a;
        }
        .people_count_fav {
            color: #12a4ff;
        }
        .peogle_count_unselected {
            color: #7d7d7d;
        }
        .commment_footer_zan_star {
            display: flex;
            flex-direction: column;
            flex: 0.2;
            justify-content: center;
            align-items: center;
        }
    }
    .foward_all_comment {
        display: flex;
        margin: 15px;
        background-color: #f6f5f6;
        border-radius: 5px;
        height: 40.5px;
        justify-content: center;
        align-items: center;
        margin-bottom: 60px;
    }
    .foward_all_comment_para {
        font-size: 15px;
        color: #5b5b5b;
    }
}
</style>
