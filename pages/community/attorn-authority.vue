<template>
    <div id="attorn-authority">
        <head-top :name="this.name"
                  :back="this.back"
                  :className="this.className"
                  :backgroundColor="this.backgroundColor">
            <span v-if="userList.length>0"
                  slot="action"
                  class="btn"
                  @click="aciton">确定</span>
        </head-top>
        <VueCheckList ref="checkList"
                      :class="['checkList',{'hidden-checkList':userList.length===0}]"
                      class="checkList"
                      :queryConditions="queryConditions"
                      :allLoaded="allLoaded"
                      :userList="userList"
                      @loadTop="loadTop"
                      @loadBottom="loadBottom">
            <template slot="right"
                      slot-scope="scope">
                <div :class="['btn',{'active':scope.index === activeIndex}]"
                     @click="activeHandler(scope.item, scope.index)" />
            </template>
        </VueCheckList>
        <Vueblank v-if="showBlank"
                  desc="囧，无可转让的圈友!" />
    </div>
</template>

<script>
import head from '../../components/common/header'
import VueCheckList from '../../components/checkList'
import Vueblank from '../../components/blank'
import { Toast } from 'mint-ui'
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
            name: '圈子管理权转让',
            userList: [],
            queryConditions: {
                topicId: this.$route.query.topicId,
                page: 1,
                size: 10
            },
            allLoaded: false,
            activeIndex: -1,
            userId: 1,
            showBlank: false
        }
    },
    mounted() {
        wx.hideAllNonBaseMenuItem();
        this.getAttornAuthorityList()
    },
    methods: {
        activeHandler(item, index) {
            this.$set(this, 'userId', item.uid)
            this.$set(this, 'activeIndex', index)
        },
        async aciton() {
            const res = await api.community.groupAttornAuthority({
                topicId: this.queryConditions.topicId,
                userId: this.userId
            })
            if (res.status === 200) {
                Toast('转让成功')
                this.$router.go(-3)
            }
        },
        async getAttornAuthorityList() {
            const res = await api.community.getAttornAuthorityList(this.queryConditions)
            if (res.status === 200) {
                if (res.data !== null) {
                    if (res.data.list.length === 0) {
                        return this.$set(this, 'showBlank', true)
                    }
                    if (!res.data.isMore) {
                        this.allLoaded = true
                        this.$refs.checkList.$refs.loadmore.onBottomLoaded()
                    }
                    this.$set(this, 'userList', res.data.list)
                    return true
                } else {
                    return this.$set(this, 'showBlank', true)
                }
            }
        },
        async loadTop(queryConditions) {
            this.allLoaded = false
            const status = await this.getAttornAuthorityList(queryConditions)
            if (status) {
                this.$refs.checkList.$refs.loadmore.onTopLoaded()
            }
        },
        async loadBottom(queryConditions) {
            const res = await api.activity.getAttornAuthorityList(queryConditions)
            if (res.status === 200) {
                if (!res.data.isMore) {
                    this.$set(this, 'allLoaded', true)
                }
                this.$set(this, 'userList', this.userList.concat(res.data.list))
                this.$refs.checkList.$refs.loadmore.onBottomLoaded()
            }
        }
    }
}
</script>

<style lang="less">
#attorn-authority {
    .mint-loadmore-bottom {
        .mint-loadmore-text {
            color: #999;
        }
    }
    .hidden-checkList {
        display: none;
    }
    .header-title {
        .btn {
            font-size: 20px;
            color: #12a4ff;
            &:active {
                color: #3a8ee6;
            }
        }
    }
    .checkList {
        .btn {
            width: 22px;
            height: 22px;
            background-repeat: no-repeat;
            background-image: url('../../assets/images/checkbox.png');
            background-size: cover;
            &.active {
                background-image: url('../../assets/images/checkbox-core.png');
            }
        }
    }
    .blank {
        .image {
            background-image: url('../../assets/images/attorn-authority-blank.png');
        }
    }
}
</style>
