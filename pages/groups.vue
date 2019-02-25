<template>
    <div>
        <keep-view name="groups">
            <header-top :name="!this.shrinkHeader ? '学习圈' : selected==1?'我的': '圈社区'" :is-shrink="true"></header-top>
            <mt-navbar v-model="selected">
                <mt-tab-item id="1"><span class="navbar-item">我的</span></mt-tab-item>
                <mt-tab-item id="2"><span class="navbar-item">圈社区</span></mt-tab-item>
            </mt-navbar>
            <mt-tab-container v-model="selected">
                <mt-tab-container-item id="1">
                    <v-home></v-home>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    <v-grouplist></v-grouplist>
                </mt-tab-container-item>
            </mt-tab-container>
        </keep-view>
    </div>
</template>
<script>
import Vue from 'vue'
import { Navbar, TabItem,TabContainer,TabContainerItem, Toast} from 'mint-ui';
import mygrouplist from './groups/myGroupList'
import grouplist from './groups/groupList'
import { mapGetters, mapActions } from 'vuex'
import headerTop from '~/components/common/header.vue'
import keepView from '~/components/common/keepView.vue'

Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);

export default {
    name:'mygroup',
    components:{
        "v-home":mygrouplist,
        "v-grouplist":grouplist,
        headerTop,
        keepView
    },
    data(){
        return {
            shrinkHeader: false
        }
    },
    computed: {
        ...mapGetters({
            groupIndexType: 'groups/groupIndexType',
        }),

        selected: {
            get: function() {
                return this.groupIndexType.toString() === '2' ? '2': '1'
            },
            set: function (value) {
                this.setGroupIndexType(value)
            }
        }

    },
    mounted(){
        let type = 1;
        if(this.$route.query.type){
            type = this.$route.query.type;
        }
        this.setGroupIndexType(type);
        global.addEventListener('scroll', this.handleScroll);
    },
    methods:{

        ...mapActions({
            setGroupIndexType: 'groups/setGroupIndexType',
        }),

        handleScroll: function () {
            let scrollTop = global.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

            //Toast("scrollTop:" + scrollTop)
            if( scrollTop > 40){
                this.shrinkHeader = true;
            }else if(scrollTop < 30){
                this.shrinkHeader = false;
            }
        },

        go () {
          this.$router.go(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'groups/theme';
    /*.rating_page{*/
        /*position: absolute;*/
        /*top: 0;*/
        /*left: 0;*/
        /*right: 0;*/
        /*bottom: 0;*/
        /*background-color: #fff;*/
        /*z-index: 202;*/
    /*}*/
    .mint-navbar{
        margin-top:40px;
        a,a:active{
            text-decoration: none
        }
        .navbar-item{
            
            font-size:17px;
        }
        
    }
    .mint-navbar .mint-tab-item{
        color:$baseFontNormal;
    }
    .mint-navbar .mint-tab-item.is-selected{
        color:$baseFontColor;
        border-bottom:none;
        &::after{
            content:'';
            display:inline-block;
            width:25px;
            border-bottom:solid 4px $basePageColor;
        }
    }
    
</style>
