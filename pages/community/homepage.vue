<template>
    <div id="community">
        <head-top :back="this.back"
                  :className="this.className"
                  :backgroundColor="this.backgroundColor"></head-top>
        <VueTab :items="tabs"
                :init-tab-index="initTabIndex"
                @changeTabHandler="changeTabHandler" />
        <mt-search class="search"
                   cancel-text="取消"
                   placeholder="搜索圈子名称"
                   @click.native="$router.push('../search/search')">
        </mt-search>
        <VueSidebar class="sidebar"
                    :items="menu"
                    :init-sidebar-index="initSidebarIndex"
                    @changeSidebarHandler="changeSidebarHandler" /> 
        <div class="main">
            <div class="product"
                 @click="$router.push('/groups/trendsDetail')">
                <div class="pruduct-item product-left" />
                <div class="pruduct-item product-middle">
                    <div class="title">市场营销</div>
                    <div class="sub-title">222人加入</div>
                </div>
                <div class="pruduct-item product-right">
                    <div class="btn">加入圈子</div>
                </div>
            </div>
            <div class="product"
                 @click="$router.push('/groups/trendsDetail')">
                <div class="pruduct-item product-left" />
                <div class="pruduct-item product-middle">
                    <div class="title">文学</div>
                    <div class="sub-title">222人加入</div>
                </div>
                <div class="pruduct-item product-right">
                    <div class="btn already-enter">已加入</div>
                </div>
            </div>
            <div class="product"
                 @click="$router.push('/groups/trendsDetail')">
                <div class="pruduct-item product-left" />
                <div class="pruduct-item product-middle">
                    <div class="title">文学</div>
                    <div class="sub-title">222人加入</div>
                </div>
                <div class="pruduct-item product-right">
                    <div class="btn auditing">审核中</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import VueTab from '../../components/tab'
import head from '../../components/common/header'
import VueSidebar from '../../components/sidebar'
import api from '@/api'
import { Search } from 'mint-ui'

export default {
    components: {
        headTop: head,
        VueTab,
        VueSidebar
    },
    data() {
        return {
            back: 0,
            className: 1,
            backgroundColor: '1',
            name: '圈子资料',
            tabs: [
                {
                    id: 1,
                    name: '我的'
                },
                {
                    id: 2,
                    name: '圈社区'
                }
            ],
            menuConditions: {
                tagTypes: 1,
                page: 1,
                size: 100
            },
            menu: [],
            activeMenu: {},
            activeTab: {},
            initTabIndex: 0,
            initSidebarIndex: 0
        }
    },
    mounted() {
        this.getMenu()
    },
    methods: {
        async getMenu() {
            const res = await api.community.getMenu(this.menuConditions)
            if (res.status === 200) {
                this.$set(this, 'menu', res.data.list)
                this.$set(this, 'activeMenu', res.data[0])
                this.$set(this, 'activeTab', this.tabs[0])
                this.getHomePageList()
            }
        },
        async getHomePageList() {
            const homePageList = await api.community.getHomePageList()
            this.$set(this, 'homePageList', homePageList)
        },
        changeTabHandler(idnex, item) {
            this.$set(this, 'activeTab', item)
            this.getHomePageList()
        },
        changeSidebarHandler(index, item) {
            this.$set(this, 'activeMenu', item)
            this.getHomePageList()
        }
    }
}
</script>

<style lang="less">
#community {
    .sidebar {
        top: 160px;
    }
    .search {
        height: 40px;
        margin: 15px 20px 20px 20px;
        .mint-searchbar {
            border-radius: 5px;
            height: 40px;
            background-color: #f2f2f2;
            padding: 0;
            .mint-searchbar-inner {
                background-color: #f2f2f2;
                padding: 0 10px;
                .mintui {
                    &.mintui-search {
                        font-size: 18px;
                        margin-right: 5px;
                    }
                }
                .mintui.mintui-search {
                    color: #999;
                }
                .mint-searchbar-core {
                    &::placeholder {
                        color: #999;
                    }
                    background-color: #f2f2f2;
                    height: 30px;
                }
            }
            .mint-searchbar-cancel {
                display: none;
            }
        }
    }
    .main {
        width: 100%;
        position: absolute;
        top: 160px;
        bottom: 0px;
        left: 0px;
        padding-left: 120px;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            display: none;
        }
        .product {
            margin-top: 1px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fff;
            box-shadow: 0px 2px 20px 0px rgba(152, 152, 152, 0.28);
            border-radius: 5px;
            padding: 15px 20px 15px 15px;
            margin-bottom: 16px;
            &:active {
                background-color: rgba(0, 0, 0, 0.1);
            }
            .product-left {
                width: 60px;
                height: 60px;
                background-image: url('../../assets/images/avator.png');
                background-repeat: no-repeat;
                background-size: cover;
                border-radius: 5px;
            }
            .product-middle {
                display: flex;
                flex-direction: column;
                .title {
                    font-size: 15px;
                }
                .sub-title {
                    font-size: 13px;
                    color: #999;
                }
            }
            .product-right {
                .btn {
                    width: 75px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    background-color: #12a4ff;
                    box-shadow: 0px 2px 20px 0px rgba(152, 152, 152, 0.28);
                    color: #fff;
                    border-radius: 5px;
                    font-size: 13px;
                    &.already-enter {
                        background-color: #fff;
                        color: #999;
                    }
                    &.auditing {
                        background-color: #fff;
                        color: #ff612a;
                    }
                }
            }
        }
    }
}
</style>
