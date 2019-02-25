<template>
    <div id="auditing-activity">
        <head-top :name="this.name"
                  :back="this.back"
                  :className="this.className"
                  :backgroundColor="this.backgroundColor"></head-top>
        <div :class="['loadmore-box',{'hidden-loadmore-box':activityList.length===0}]">
            <mt-loadmore :autoFill="false"
                         :top-method="loadTop"
                         :bottomMethod="loadBottom"
                         :bottom-all-loaded="allLoaded"
                         :bottomPullText="bottomPullText"
                         ref="loadmore">
                <div class="product"
                     v-for="(item,index) in activityList"
                     :key="index">
                    <div class="header">
                        <div class="header-left">
                            <div class="avator"
                                 :style="{backgroundImage:formartAvatar(item.author && item.author.avatar)}"></div>
                            <div class="desc">
                                <p class="monicker">{{ item.author && item.author.nickName }}</p>
                                <p class="time">{{ `${uitls.formatTime(Number(item.publishTime))}` }}</p>
                            </div>
                        </div>
                        <div class="header-right"></div>
                    </div>
                    <div class="msg">
                        <p class="msg-title">{{ item.title }}</p>
                        <div class="activity-time">
                            <div class="time">活动时间: </div>
                            <div class="desc">{{ `${uitls.formatTime(item.startDate)} - ${showActivityEndDate(item.endDate)}` }}</div>
                        </div>
                        <div class="address">
                            <div class="time">地点: </div>
                            <div class="desc">{{`${item.address}`}}</div>
                        </div>
                    </div>
                    <div class="opreation">
                        <div class="reject"
                             @click="reject(item.feedId)">拒绝</div>
                        <div class="agree"
                             @click="agree(item.feedId)">同意</div>
                    </div>
                </div>
            </mt-loadmore>
        </div>
        <Vueblank v-if="showBlank"
                  desc="这里没有需要审核的活动哦~" />
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import head from '../../components/common/header'
import { Toast, Loadmore } from 'mint-ui'
import uitls from '../../utils/formatter'
import Vueblank from '../../components/blank'
import api from '@/api'
import {wx} from '@/utils/share'

export default {
    components: {
        headTop: head,
        Vueblank
    },
    data() {
        return {
            uitls,
            bottomPullText: '',
            allLoaded: false,
            isAgree: false,
            back: 0,
            className: 1,
            backgroundColor: '1',
            name: '圈子活动审核',
            queryConditions: {
                topicId: this.$route.query.topicId,
                status: 0,
                types: 4,
                page: 1,
                size: 10
            },
            activityList: [],
            showBlank: false
        }
    },
    computed: {
        ...mapGetters({
            uid: 'common/uid'
        }),
    },
    mounted() {
        wx.hideAllNonBaseMenuItem();
        this.$set(this.queryConditions, 'puid', this.uid)
        this.getActivityList(this.queryConditions)
    },
    methods: {
        async getActivityList(queryConditions) {
            const res = await api.community.getActivityList(queryConditions)
            if (res.status === 200) {
                if (res.data !== null) {
                    if (res.data.list.length === 0) {
                        this.$set(this, 'activityList', [])
                        return this.$set(this, 'showBlank', true)
                    }
                    if (!res.data.isMore) {
                        this.allLoaded = true
                        this.$refs.loadmore.onBottomLoaded()
                    }
                    this.$set(this, 'activityList', res.data.list)
                    return true
                } else {
                    this.$set(this, 'activityList', [])
                    return this.$set(this, 'showBlank', true)
                }
            }
        },
        async reject(id) {
            const res = await api.community.rejectActivity({
                id: id,
                uid: this.uid,
                uname: '',
                reason: '审核通过/不通过'
            })
            if (res.status === 200) {
                Toast('操作成功')
                this.queryConditions.page = 1
                this.getActivityList(this.queryConditions)
            }
        },
        async agree(id) {
            const res = await api.community.agreeActivity({
                id: id,
                uid: this.uid,
                uname: ''
            })
            if (res.status === 200) {
                Toast('操作成功')
                this.queryConditions.page = 1
                this.$set(this.queryConditions, 'puid', this.uid)
                this.getActivityList(this.queryConditions)
            }
        },
        async loadTop() {
            this.$set(this.queryConditions, 'page', 1)
            this.$set(this.queryConditions, 'puid', this.uid)
            this.allLoaded = false
            const status = await this.getActivityList(this.queryConditions)
            if (status) {
                this.$refs.loadmore.onTopLoaded()
            }
        },
        async loadBottom() {
            this.$set(this.queryConditions, 'page', this.queryConditions.page + 1)
            const res = await api.community.getActivityList(this.queryConditions)
            if (res.status === 200) {
                if (!res.data.isMore) {
                    this.$set(this, 'allLoaded', true)
                }
                this.$set(this, 'activityList', this.activityList.concat(res.data.list))
                this.$refs.loadmore.onBottomLoaded()
            }
        },
        formartAvatar(data) {
            return data ? `url(${data})` : 'url(/images/avator.png)'
        },
        showActivityEndDate(endDate){
            return endDate?uitls.formatTime(endDate):"待定"
        }
    }
}
</script>

<style lang="less">
#auditing-activity {
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
    .title {
        padding: 20px 20px 0 20px;
        font-size: 20px;
    }
    .loadmore-box {
        padding: 6px 0px;
        overflow: scroll;
        .mint-loadmore {
            min-height: 82vh;
        }
    }
    .product {
        padding: 10px 20px 25px 20px;
        border-bottom: 1px solid #f0f0f0;
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .header-left {
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
                }
                .desc {
                    margin-left: 10px;
                    .monicker {
                        font-size: 15px;
                        color: #333;
                    }
                    .time {
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
            .header-right {
                width: 29px;
                height: 29px;
                background-image: url('../../assets/images/activity.png');
                background-repeat: no-repeat;
                background-size: cover;
            }
        }
        .msg {
            padding: 16px 0;
            .msg-title {
                font-size: 15px;
                color: #333;
                margin-bottom: 10px;
            }
            .activity-time {
                display: flex;
                font-size: 13px;
                color: #666;
                margin-bottom: 10px;
                .desc {
                    flex: 4;
                    font-size: 13px;
                }
                .time {
                    flex: 1;
                    font-size: 13px;
                }
            }
            .address {
                display: flex;
                font-size: 13px;
                color: #666;
                .desc {
                    flex: 4;
                    font-size: 13px;
                }
                .time {
                    flex: 1;
                    font-size: 13px;
                }
            }
        }
        .opreation {
            display: flex;
            margin: 0 auto;
            height: 40px;
            width: 100%;
            color: #fff;
            text-align: center;
            line-height: 40px;
            font-size: 16px;
            .reject {
                border-radius: 5px 0 0 5px;
                flex: 1;
                background-color: #dadada;
            }
            .agree {
                border-radius: 0 5px 5px 0;
                flex: 1;
                background-color: #12a4ff;
                &:active {
                    background: #3a8ee6;
                    border-color: #3a8ee6;
                    color: #fff;
                }
            }
        }
    }
}
</style>
