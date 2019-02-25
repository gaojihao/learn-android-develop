<template>
    <div id="community-member">
        <head-top :name="this.name"
                  :back="this.back"
                  :className="this.className"
                  :backgroundColor="this.backgroundColor"></head-top>
        <VueCheckList v-if='!noData' ref="checkList"
                      class="checkList"
                      :queryConditions="queryConditions"
                      :allLoaded="allLoaded"
                      :userList="userList"
                      @loadTop="loadTop"
                      @loadBottom="loadBottom">
        </VueCheckList>
        <div v-else class="noData">
            <img src="../../assets/images/attorn-authority-blank.png">
            <h1>这里还没有人哦~</h1>
        </div>
    </div>
</template>

<script>
import { CellSwipe, Toast, Loadmore } from 'mint-ui'
import VueCheckList from '../../components/checkList'
import head from '../../components/common/header'
import api from '@/api'

export default {
    components: {
        headTop: head,
        VueCheckList
    },
    data() {
        return {
            back: 0,
            className: 1,
            backgroundColor: '1',
            name: '活动报名成员',
            userList: [],
            queryConditions: {
                blogId: this.$route.query.blogId,
                page: 1,
                size: 10
            },
            allLoaded: false,
            blogId: this.$route.query.blogId,
            noData:false,
        }
    },
    mounted() {
        this.getUserList(this.queryConditions)
    },
    methods: {
        async getUserList(queryConditions) {
            const res = await api.activity.getUserlist(queryConditions)
            if (res.status === 200) {
                if (!res.data.isMore) {
                    this.allLoaded = true
                    this.$refs.checkList.$refs.loadmore.onBottomLoaded()
                    this.noData = res.data.list.length==0?true:false
                }
                this.$set(this, 'userList', res.data.list)
                return true
            }
        },
        async loadTop(queryConditions) {
            this.allLoaded = false
            const status = await this.getUserList(queryConditions)
            if (status) {
                this.$refs.checkList.$refs.loadmore.onTopLoaded()
            }
        },
        async loadBottom(queryConditions) {
            const res = await api.activity.getUserlist(queryConditions)
            if (res.status === 200) {
                if (!res.data.isMore) {
                    this.allLoaded = true
                }
                this.$set(this, 'userList', this.userList.concat(res.data.list))
                this.$refs.checkList.$refs.loadmore.onBottomLoaded()
            }
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
                    width: 50px;
                    height: 50px;
                    border-radius: 25px;
                    background-color: #f0f0f0;
                    background-image: url('../../assets/images/star.png');
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
    .noData{
        overflow:hidden;
        img{
            width:280px;
            margin:40px auto 0;
            display:block;
        }
        h1{
            text-align:center;
            margin-top:50px;
            color:#999;
            font-size:14px;
        }
    }
}
</style>
