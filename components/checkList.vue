<template>
    <div class="loadmore-box">
        <mt-loadmore :autoFill="false"
                     :top-method="loadTop"
                     :bottomMethod="loadBottom"
                     :bottom-all-loaded="allLoaded"
                     :bottomPullText="bottomPullText"
                     ref="loadmore">
            <div id="checkList"
                 v-for="(item,index) in userList"
                 :key="index">
                <div class="checkList-left">
                    <div class="left-box">
                        <div :style="{backgroundImage:formartAvatar(item.avatar)}"
                             class="avator"
                             @click="toPersonal($event,item.uid)"></div>
                        <div class="name">{{ item.nickName }}</div>
                    </div>
                </div>
                <div class="checkList-right">
                    <slot :item="item"
                          :index="index"
                          name="right" />
                </div>
            </div>
        </mt-loadmore>
    </div>
</template>

<script>
import { Loadmore } from 'mint-ui'

export default {
    props: {
        bottomPullText: {
            type: String,
            default: () => ''
        },
        allLoaded: {
            type: Boolean,
            default: () => false
        },
        queryConditions: {
            type: Object,
            default: () => {}
        },

        userList: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        toPersonal(e, uid) {
            e.stopPropagation()
            this.$router.push({ name: 'ucenter-UserProfile', query: { userId: uid } })
        },
        formartAvatar(data) {
            return data ? `url(${data})` : 'url(/images/avator.png)'
        },
        loadTop() {
            this.$set(this.queryConditions, 'page', 1)
            this.$emit('loadTop', this.queryConditions)
        },
        loadBottom() {
            this.$set(this.queryConditions, 'page', this.queryConditions.page + 1)
            this.$emit('loadBottom', this.queryConditions)
        }
    }
}
</script>

<style lang="less">
.loadmore-box {
    padding: 6px 0px;
    overflow: scroll;
    .mint-loadmore {
        min-height: 82vh;
    }

    #checkList {
        padding: 15px 20px 15px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e0e0e0;
        .checkList-left {
            .left-box {
                display: flex;
                align-items: center;
                .avator {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    background-color: #f0f0f0;
                    background-repeat: no-repeat;
                    background-size: cover;
                    margin-right: 15px;
                }
                .name {
                    color: #333333;
                    font-size: 20px;
                }
            }
        }
        .checkList-right {
        }
    }
}
</style>
