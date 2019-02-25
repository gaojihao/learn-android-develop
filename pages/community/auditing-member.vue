<template>
    <div id="auditing-member">
        <head-top :name="this.name"
                  :back="this.back"
                  :className="this.className"
                  :backgroundColor="this.backgroundColor"></head-top>
        <VueCheckList ref="checkList"
                      :class="['checkList',{'hidden-checkList':userList.length===0}]"
                      :queryConditions="queryConditions"
                      :allLoaded="allLoaded"
                      :userList="userList"
                      @loadTop="loadTop"
                      @loadBottom="loadBottom">
            <template slot="right"
                      slot-scope="scope">
                <div class="btn"
                     @click="agree(scope.item)">同意</div>
            </template>
        </VueCheckList>
        <Vueblank v-if="showBlank"
                  desc="您还没有需要审核的圈友哦~" />
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { Loadmore, Toast } from 'mint-ui'
import head from '../../components/common/header'
import VueCheckList from '../../components/checkList'
import Vueblank from '../../components/blank'
import api from '@/api'
import {wx} from '@/utils/share'

export default {
    components: {
        headTop: head,
        VueCheckList,
        Vueblank
    },
    data() {
        return {
            isAgree: false,
            back: 0,
            className: 1,
            backgroundColor: '1',
            name: '新成员',
            userList: [],
            queryConditions: {
                topicId: this.$route.query.topicId,
                page: 1,
                size: 10
            },
            topicId: this.$route.query.topicId,
            allLoaded: false,
            showBlank: false
        }
    },
    mounted() {
        wx.hideAllNonBaseMenuItem();
        this.getFollowUnderAnditList(this.queryConditions)
    },
    methods: {
        async getFollowUnderAnditList(queryConditions) {
            const res = await api.community.getFollowUnderAnditList(queryConditions)
            if (res.status === 200) {
                if (res.data !== null) {
                    if (res.data.length === 0) {
                        this.$set(this, 'userList', [])
                        return this.$set(this, 'showBlank', true)
                    }
                    if (!res.data.isMore) {
                        this.allLoaded = true
                        this.$refs.checkList.$refs.loadmore.onBottomLoaded()
                    }
                    this.$set(this, 'userList', res.data)
                    return true
                } else {
                    this.$set(this, 'userList', [])
                    return this.$set(this, 'showBlank', true)
                }
            }
        },
        async agree(item) {
            const res = await api.community.agree({
                uid: item.uid,
                topicId: this.topicId,
                followStatus: 1,
                auditStatus: 1
            })
            if (res.status === 200) {
                this.queryConditions.page = 1
                this.getFollowUnderAnditList(this.queryConditions)
                Toast('操作成功')
            }
        },
        async loadTop(queryConditions) {
            this.allLoaded = false
            const status = await this.getFollowUnderAnditList(queryConditions)
            if (status) {
                this.$refs.checkList.$refs.loadmore.onTopLoaded()
            }
        },
        async loadBottom(queryConditions) {
            const res = await api.community.getFollowUnderAnditList(queryConditions)
            if (res.status === 200) {
                if (!res.data.isMore) {
                    this.$set(this, 'allLoaded', true)
                }
                this.$set(this, 'userList', this.userList.concat(res.data))
                this.$refs.checkList.$refs.loadmore.onBottomLoaded()
            }
        }
    }
}
</script>

<style lang="less">
#auditing-member {
    .mint-loadmore-bottom {
        .mint-loadmore-text {
            color: #999;
        }
    }
    .hidden-checkList {
        display: none;
    }
    .blank {
        .image {
            background-image: url('../../assets/images/attorn-authority-blank.png');
        }
    }
    .title {
        padding: 20px 20px 0 20px;
        font-size: 20px;
        margin-bottom: 20px;
    }
    .loadmore {
        margin-top: 40px;
    }
    .checkList {
        .btn {
            width: 75px;
            height: 40px;
            font-size: 20px;
            text-align: center;
            line-height: 40px;
            border-radius: 5px;
            color: #12a4ff;
            font-size: 16px;
            box-shadow: 0px 4px 40px 0px rgba(152, 152, 152, 0.28);
            &:active {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }
    }
}
</style>
