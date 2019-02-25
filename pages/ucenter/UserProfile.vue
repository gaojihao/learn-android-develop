<template>
    <div class="container">
        <header-top :name="user.nickName || ' '" :canShrink="false"></header-top>
        <div class="user-info">
            <img class="avatar" :src="user.avatar" alt="" :onerror='defaultAvatar'>
            <div class="basicinfo">
                <span>{{user.nickName}}</span>
                <img v-if="user.gender == 2" src="~/assets/images/gender_female.png" alt="">
                <img v-else src="~/assets/images/gender_male.png" alt="">
            </div>
            <div class="specialty">{{user.major}}</div>
            <!-- <div class="my-profile-arrow" v-if="isMyself" @click="myProfile">
                <img src="~/assets/images/arrowright.png" alt="">
            </div> -->
        </div>
        <ul class="user-others">
            <li @click="myPublish">
                <span v-if="isMyself">我的发布</span>
                <span v-else>TA的发布</span>
                <img src="~/assets/images/arrowright.png" alt="">
            </li>
            <li @click="myCollection" v-if="isMyself">
                <span>我的收藏</span>
                <img src="~/assets/images/arrowright.png" alt="">
            </li>
        </ul>
    </div>
</template>

<script>
    import headerTop from '~/components/common/header.vue'
    import api from '@/api'
    import Share from '@/utils/share'
    export default {
        components: {
            headerTop
        },
        data () {
            return {
                user: {
                    'avatar': require('~/assets/images/defaultHead.png'),
                },
                defaultAvatar: 'this.src="' + require('~/assets/images/defaultHead.png') + '"'
            }
        },
        computed: {
            isMyself () {
                return this.$store.state.common.uid === this.$route.query.userId
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                if (this.$route.params.user) {
                    this.user = this.$router.query.user
                    console.log(this.user)
                } else if (this.$route.query.userId) {
                    this.fetch()
                }
            })
        },
        methods: {
            async fetch () {
                let params = {
                    hostPuid: this.$route.query.userId, // 要查看的人的uid
                    uid: this.$store.state.common.uid   // 自己的uid
                }
                const info = await api.personal.getPersonalInfo(params)
                if (info.status == 200) {
                    this.user = info.data

                    Share({
                        desc: this.user.nickName ? this.user.nickName + '的个人主页': '个人主页',
                        imgUrl: this.user.avatar
                    })
                }
            },
            myPublish () {  // 我的/TA的发布
                this.$router.push({path: '/personal/PersonalRelease', query: {userId: this.$route.query.userId}})
            },
            myCollection () {   // 我的/TA的收藏
                this.$router.push({path: '/ucenter/UserCollection', query: {userId: this.$route.query.userId}})
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../theme.scss';
    .container {
        padding: 0 0 10px 0;
        margin: 0;
        background-color: #f2f2f2;
    }
    .user-info {
        position: relative;
        background-color: white;
        text-align: center;
        padding: 16px 0 46px 0;
        margin-bottom: 10px;
        .avatar {
            width: 76px;
            height: 76px;
            border-radius: 50%;
            font-size: 0;
        }
        .my-profile-arrow {
            display: inline-block;
            padding: 20px;
            position: absolute;
            right: 0;
            top: 50%;
            margin-top: -17px;
            img {
                width: 14px;
                height: 14px;
            }
        }
        .basicinfo {
            text-align: center;
            margin-top: 13px;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                font-size: 20px;
                color: $baseTitleColor;
                margin-right: 5px;
            }
            img {
                width: 20px;
                height: 20px;
                padding: 3px;
                border-radius: 5px;
                background-color: #12a4ff;
            }
        }
        .specialty {
            font-size: 14px;
            color: $baseNoticeColor;
            margin-top: 5px;
        }
    }

    .user-others {
        position: relative;
        background-color: white;
        font-size: 20px;
        color: $baseTitleColor;
        li {
            padding: 23px 20px;
        }
        li:not(:first-child) {
            border-top: 1px solid #e0e0e0;
        }
        img {
            width: 15px;
            position: absolute;
            right: 20px;
        }
    }
</style>
