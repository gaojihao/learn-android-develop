<template>
    <div class="all-commnet">
        <header-top :name="name">
        </header-top>

        <section class="note-section">
            <mt-loadmore :autoFill="false"
                         :top-method="loadTop"
                         :bottomMethod="loadBottom"
                         :bottom-all-loaded="allLoaded"
                         :bottomPullText="bottomPullText"
                         ref="loadmore">
                <commentItem :commentsList="commentList" />
            </mt-loadmore>
        </section>

        <div class="comment_input_footer"
             id="footer">
            <div class='comment_textfield_bg'>
                <input type="text"
                       v-model="comment"
                       @keypress="keypress"
                       class="comment_textfield"
                       id="input"
                       placeholder="评论">
            </div>
        </div>
        <div class='bottom_footer_placeholder'>
        </div>
    </div>
</template>



<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import commentItem from '../../components/commentItem'
import headerTop from '../../components/common/header.vue'
import { Toast } from 'mint-ui'
import api from '@/api'
import {wx} from '@/utils/share'

export default {
    components: {
        commentItem,
        headerTop
    },
    data() {
        return {
            name: '全部评论',
            commentList: [],
            commentConditions: {
                blogId: null,
                uid: null,
                sortFlag: 1,
                page: 1,
                size: 10
            },
            bottomPullText: '',
            allLoaded: false,
            blogId: null,
            comment: ''
        }
    },
    computed: {
        ...mapGetters({
            uid: 'common/uid'
        })
    },
    mounted() {
        wx.hideAllNonBaseMenuItem();
        this.$set(this.commentConditions, 'blogId', this.getUrlParam('blogId'))
        this.$set(this.commentConditions, 'uid', this.uid)
        this.$set(this, 'blogId', this.getUrlParam('blogId'))
        this.getcommentList()
    },
    methods: {
        getUrlParam(name) {
            const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
            const r = location.search.substr(1).match(reg)
            if (r != null) return unescape(r[2])
            return null
        },
        async keypress() {
            const res = await api.activity.publishComment({
                content: this.comment,
                blogId: this.blogId,
                uid: this.uid
            })
            if (res.status === 200) {
                this.comment = ''
                Toast('评论成功')
            }
        },
        async getcommentList() {
            const res = await api.activity.getcommentList(this.commentConditions)
            if (res.status === 200) {
                if (!res.data.isMore) {
                    this.allLoaded = true
                    this.$refs.loadmore.onBottomLoaded()
                }
                this.$set(this, 'commentList', res.data.uisCommentOutput)
                return true
            }
        },
        async loadTop() {
            this.allLoaded = false
            this.$set(this.commentConditions, 'page', 1)
            const status = await this.getcommentList(this.commentConditions)
            if (status) {
                this.$refs.loadmore.onTopLoaded()
            }
        },
        async loadBottom() {
            this.$set(this.commentConditions, 'page', this.commentConditions.page + 1)
            const res = await api.activity.getcommentList(this.commentConditions)
            if (res.status === 200) {
                if (!res.data.isMore) {
                    this.$set(this, 'allLoaded', true)
                }
                this.$set(this, 'commentList', this.commentList.concat(res.data.uisCommentOutput))
                this.$refs.loadmore.onBottomLoaded()
            }
        }
    }
}
</script>



<style lang="less">
.all-commnet {
    .mint-loadmore-bottom {
        .mint-loadmore-text {
            color: #999;
        }
    }

    .note-section {
        overflow: scroll;
    }
    .headline {
        font-size: 27.5px;
        margin: 15px;
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
    }

    .comment_textfield_bg {
        margin-left: 15px;
        margin-right: 15px;
        margin-top: 2.5px;
        margin-bottom: 2.5px;
        flex: 1;
        background-color: #f1f1f1;
        border-radius: 5px;
        display: flex;
    }

    .comment_textfield {
        border: none;
        flex: 1;
        background-color: rgba(0, 0, 0, 0);
        /* margin-left: 10px; */
        text-align: center;
    }

    .bottom_footer_placeholder {
        height: 40px;
    }
}
</style>
