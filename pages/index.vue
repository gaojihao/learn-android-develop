<template>
    <div class="container">
        <header-top :name="this.name"
                    :back="this.back">
            <div slot="action"
                 class="header-btn">
                <img src="~assets/images/icon_user.png"
                     alt=""
                     @click="gotoUserProfilePage">
                <span class="messsage-dot">
                    <img src="~assets/images/homepage_message.png"
                         alt=""
                         @click="toMessage">
                    <i v-if="hasNewMessage"></i>
                </span>
            </div>
        </header-top>

        <ul>
            <li v-for="(item, index) in pageItems"
                v-bind:key="item.id"
                @click="gotoNextPage(item.href)">
                <img v-bind:src="item.icon">
                <div>{{item.name}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
import headerTop from '~/components/common/header.vue'
import api from '@/api'
import { mapGetters, mapActions } from 'vuex'

export default {
    data: function() {
        return {
            back: 1,
            name: '学习引导平台',
            hasNewMessage: false,
        }
    },
    computed: {
        ...mapGetters({
            pageItems: 'homepage/actionList',
        }),
    },
    components: {
        headerTop
    },
    mounted: function() {
        this.fetch()
    },
    methods: {
        ...mapActions({
            getActionList: 'homepage/getActionList'
        }),
        async fetch() {
            let params = {
                userId: this.$store.state.common.uid
            }
            const info = await this.getActionList(params)
            const info2 = await api.homepage.getUserNewMessages(params)
            if (info2.status == 200) {
                this.hasNewMessage = info2.data > 0
            }
        },
        gotoNextPage(href) {
            
            if (href.startsWith('shunivapp')) {
                if(href.indexOf('groups/myGroup' > -1)){
                    href = href.replace('groups/myGroup', 'groups')
                } 
                
                if(href.indexOf('note/notes' > -1)){
                    href = href.replace('note/notes', 'note')
                }

                this.$router.push(href.substring('shunivapp://'.length))
            } else if (href.startsWith('http') || href.startsWith('https')) {
                location.href = href
            }
        },
        gotoUserProfilePage() {
            this.$router.push({ path: `/ucenter/UserProfile`, query: { userId: this.$store.state.common.uid } }) // not params
        },
        toMessage() {
            this.$router.push('/ucenter/message')
        }
    }
}
</script>

<style lang="scss" scoped>
@import './theme.scss';
.container {
    text-align: center;
}

.header-btn {
    img {
        width: 25px;
        &:not(:last-child) {
            margin-right: 38px;
        }
    }
    .messsage-dot {
        display: inline-block;
        width: 28px;
        position: relative;
        i {
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: red;
            border-radius: 50%;
            position: absolute;
            right: 0;
            top: 5px;
        }
    }
}

ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    margin-top: 5px;
    padding: 0;
    background-color: white;
    font-size: 15px;
    color: $baseTitleColor;
}

li {
    flex: 0 0 33.3%;
    box-sizing: border-box;
    padding: 20px 0;
    img {
        margin-bottom: 5px;
        width: 45px;
    }
}
</style>
