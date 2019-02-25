<template>
    <div id="community-member">
        <head-top :name="this.name"
                  :back="this.back"
                  :className="this.className"
                  :backgroundColor="this.backgroundColor"></head-top>
        <div class="cell">
            <no-ssr>
                <div :class="['loadmore-box',{'hidden-loadmore-box':userList.length===0}]">
                    <mt-loadmore :autoFill="false"
                                 :top-method="loadTop"
                                 :bottomMethod="loadBottom"
                                 :bottom-all-loaded="allLoaded"
                                 :bottomPullText="bottomPullText"
                                 ref="loadmore">
                        <mt-cell-swipe v-for="(item,index) in userList"
                                       :key="index"
                                       :title="item.realname"
                                       :right="[
                                     {content: '删除',
                                     style: { background: '#FF091F', color: '#fff' },
                                     handler: () => deleteUser(item.uid)}]">
                            <span slot="icon"
                                  :style="{backgroundImage:formartAvatar(item.avatar)}"
                                  class="mintui-avator"
                                  @click="toPersonal($event,item.uid)"></span>
                        </mt-cell-swipe>
                    </mt-loadmore>
                </div>
            </no-ssr>
        </div>
        <Vueblank v-if="showBlank"
                  desc="囧，暂无圈子成员!" />
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { CellSwipe, Toast, Loadmore } from 'mint-ui'
import Vueblank from '../../components/blank'
import head from '../../components/common/header'
import api from '@/api'
import {wx} from '@/utils/share'

export default {
    components: {
        headTop: head,
        Vueblank
    },
    data() {
        return {
            back: 0,
            className: 1,
            backgroundColor: '1',
            name: '圈子成员',
            userList: [],
            queryConditions: {
                topicId: this.$route.query.topicId,
                page: 1,
                size: 10
            },
            topicId: this.$route.query.topicId,
            bottomPullText: '',
            allLoaded: false,
            showBlank: false
        }
    },
    mounted() {
        wx.hideAllNonBaseMenuItem();
        this.getTopicFollowListHandler(this.queryConditions)
    },

    methods: {
        ...mapActions({
            getTopicFollowList: 'community/getTopicFollowList'
        }),
        toPersonal(e, uid) {
            e.stopPropagation()
            this.$router.push({ name: 'ucenter-UserProfile', query: { userId: uid } })
        },
        async getTopicFollowListHandler(queryConditions) {
            const res = await api.community.getTopicFollowList(queryConditions)
            if (res.status === 200) {
                if (res.data !== null) {
                    if (res.data.list.length === 0) {
                        this.$set(this, 'userList', [])
                        this.$set(this, 'showBlank', true)
                        return
                    }
                    if (!res.data.isMore) {
                        this.allLoaded = true
                        this.$refs.loadmore.onBottomLoaded()
                    }
                    this.$set(this, 'userList', res.data.list)
                    return true
                } else {
                    this.$set(this, 'userList', [])
                    return this.$set(this, 'showBlank', true)
                }
            }
        },
        async deleteUser(id) {
            const res = await api.community.deleteUser({
                userId: id,
                topicId: this.topicId
            })
            if (res.status === 200) {
                Toast('删除成功')
                this.queryConditions.page = 1
                this.getTopicFollowListHandler(this.queryConditions)
            }
        },
        async loadTop() {
            this.allLoaded = false
            this.$set(this.queryConditions, 'page', 1)
            const status = await this.getTopicFollowListHandler(this.queryConditions)
            if (status) {
                this.$refs.loadmore.onTopLoaded()
            }
        },
        async loadBottom() {
            this.$set(this.queryConditions, 'page', this.queryConditions.page + 1)
            const res = await api.community.getTopicFollowList(this.queryConditions)
            if (res.status === 200) {
                if (!res.data.isMore) {
                    this.$set(this, 'allLoaded', true)
                }
                this.$set(this, 'userList', this.userList.concat(res.data.list))
                this.$refs.loadmore.onBottomLoaded()
            }
        },
        formartAvatar(data) {
            return data ? `url(${data})` : 'url(/images/avator.png)'
        }
    }
}
</script>

<style lang="less">
#community-member {
    .mint-loadmore-bottom {
        .mint-loadmore-text {
            color: #999;
        }
    }
    .hidden-loadmore-box {
        display: none;
    }
    .blank {
        .image {
            background-image: url('../../assets/images/activity-blank.png');
        }
    }
    .mint-cell-wrapper {
        background-image: url('');
    }
    .mint-cell:last-child {
        background-image: url('');
    }
    .mint-cell {
        .mint-cell-wrapper {
            height: 80px;
            line-height: 80px;
            border-bottom: 1px solid #f0f0f0;
            .mint-cell-title {
                display: flex;
                align-items: center;
                & > span {
                    display: flex;
                    align-items: center;
                }
                .mint-cell-text {
                    font-size: 20px;
                    text-decoration: none;
                }
                .mintui-avator {
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    background-color: #f0f0f0;
                    background-repeat: no-repeat;
                    background-size: cover;
                    margin-right: 15px;
                }
            }
        }
        .mint-cell-swipe-button {
            width: 80px;
            text-align: center;
            line-height: 80px;
            font-size: 20px;
        }
    }
    .loadmore-box {
        padding: 6px 0px;
        overflow: scroll;
        .mint-loadmore {
            min-height: 82vh;
        }
    }
}
</style>
