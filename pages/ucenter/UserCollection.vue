<template>
    <div class="container">
        <header-top name="我的收藏"></header-top>
        <mt-navbar v-model="selected">
            <mt-tab-item id="1"><span class="navbar-item">动态</span></mt-tab-item>
            <mt-tab-item id="2"><span class="navbar-item">笔记</span></mt-tab-item>
        </mt-navbar>

        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="1">
                <div class="release">
                    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="loadmore">
                        <div is='detail-item' v-for="(item,index) in groupFeedList.data" :key='item.index' :index="index" :item='item' :show-more-action='false' :fromUserCollection='true' >
                        </div>
                    </mt-loadmore>
                    <no-content :content="blankContent"  v-if="!groupFeedList || !groupFeedList.data.length"></no-content>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
                <notesList :userId='this.$route.query.userId' isFromFav='true'></notesList>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>

<script>
    import Vue from 'vue'
    import headerTop from '~/components/common/header.vue'
    import { Navbar, TabItem,TabContainer,TabContainerItem} from 'mint-ui';
    import notesList from '../note/components/notesList'
    import api from '@/api'
    import detailItem from '../groups/components/groupDetailNewItem'
    import noContent from '~/components/common/noContent.vue'
    import { Loadmore, InfiniteScroll } from 'mint-ui';

    import { mapGetters, mapActions } from 'vuex'
    import {wx} from '@/utils/share'

    Vue.component(Loadmore.name, Loadmore);
    Vue.component(TabContainer.name, TabContainer);
    Vue.component(TabContainerItem.name, TabContainerItem);
    Vue.component(Navbar.name, Navbar);
    Vue.component(TabItem.name, TabItem);
    Vue.use(InfiniteScroll);

    export default {
        data () {
            return {
                selected:'1',   // navBar 当前选中项
                currentPage: 1,  // 动态列表当前页
                hasMore: false,     // 上拉更多 - 是否还有数据
                allLoaded: false,   // 上拉更多 - 是否已全部加载
                blankContent: {     // 无数据展示
                    message: '啥都没有，你果然不是一位收藏家~',
                    src: require('../../assets/images/no-collect.png')
                }
            }
        },
        mounted(){
            wx.hideAllNonBaseMenuItem();
            this.fetchGroupFeed()
        },
        components: {
            headerTop,
            notesList,
            detailItem,
            noContent,
        },
        computed: {
            ...mapGetters({
                uid: 'common/uid',
                groupFeedList: 'userCollection/groupFeedList', // 收藏的动态列表,
                tabType: 'userCollection/tabType'
            }),
        },

        methods:{
            ...mapActions({
               getUserCollectedList: 'userCollection/getUserCollectedList',
           }),

          async fetchGroupFeed(page = 1, pos='top'){
            let params = {
              uid: this.uid,
              hostPuid: this.$route.query.userId,   // 当前查看的用户ID
              type: 'collected',
              page: page,    // 第几页
              size: 10,          // 条数限制，默认为10
              feedTypes: 2      // 1-笔记, 2-动态, 4-活动
            }

            let result = await this.getUserCollectedList(params)

            if (pos === 'top') {
                this.$refs.loadmore && this.$refs.loadmore.onTopLoaded();
            } else {
                this.$refs.loadmore && this.$refs.loadmore.onBottomLoaded();
            }

            this.allLoaded = this.groupFeedList.pagination.allLoaded;
          },

          loadTop(){
              this.fetchGroupFeed(1, 'top')
          },

          loadBottom(){
              if (this.groupFeedList.pagination.hasMore) {
                  this.fetchGroupFeed(this.groupFeedList.pagination.currentPage ? this.groupFeedList.pagination.currentPage + 1 : 1, 'bottom');
              }

          }
        }
    }
</script>

<style lang="scss" scoped>
    .mint-navbar{
        margin-top:40px;
        a,a:active{
            text-decoration: none
        }
        .navbar-item{
            font-size:17px;
        }
    }
    .release{
        overflow: hidden;
        font-size: 15px;
        background: #fff
    }
    .mint-navbar .mint-tab-item{
        color:#999;
    }
    .mint-navbar .mint-tab-item.is-selected{
        color:#333;
        border-bottom:none;
        &::after{
            content:'';
            display:inline-block;
            width:25px;
            border-bottom:solid 5px #12a4ff;
        }
    }
</style>
