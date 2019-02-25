<template>
    <div id="setting">
        <head-top :name="this.name"
                  :back="this.back"
                  :className="this.className"
                  :backgroundColor="this.backgroundColor"></head-top>
        <mt-cell class='isAgree'
                 title="好友加入是否需要你的同意">
            <mt-switch @change='turn'
                       v-model="isAgree"></mt-switch>
        </mt-cell>
        <mt-cell class="middle"
                 title="圈主管理圈转让"
                 :to="`community/attorn-authority?topicId=${topicId}`"
                 is-link></mt-cell>
        <div class="bottom">
            <div class="btn"
                 @click="downline">圈子下线</div>
            <div class="btn dissolution"
                 @click="dissolve">解散圈子</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import head from '../../components/common/header'
import { Switch, Cell, Button, Toast } from 'mint-ui'
import api from '@/api'

export default {
    components: {
        headTop: head,
        Switch,
        Cell,
        Button
    },
    data() {
        return {
            isAgree: Boolean(Number(this.$route.query.auditFlag)),
            back: 0,
            className: 1,
            backgroundColor: '1',
            name: '设置',
            topicId: this.$route.query.topicId
        }
    },
    computed: {
        ...mapGetters({
            uid: 'common/uid'
        })
    },
    methods: {
        async turn() {
            this.isAgree = this.isAgree ? false : true
            const res = await api.community.isAgreeJoin({
                auditFlag: Number(!this.isAgree),
                topicId: this.topicId,
                uid: this.uid,
                uname: ''
            })
            if (res.status === 200) {
                Toast('操作成功')
            }
        },
        async downline() {
            const res = await api.community.downline({
                topicId: this.topicId,
                uid: this.uid,
                uname: ''
            })
            if (res.status === 200) {
                Toast('操作成功')
                this.$router.go(-3)
            }
        },
        async dissolve() {
            const res = await api.community.dissolve({
                topicId: this.topicId,
                uid: this.uid,
                uname: ''
            })
            if (res.status === 200) {
                Toast('操作成功')
                this.$router.go(-3)
            }
        }
    }
}
</script>

<style lang="less">
#setting {
    background-color: #f2f2f2;
    display: flex;
    flex-direction: column;
    height: 100vh;
    .middle {
        height: 70px;
        line-height: 70px;
        font-size: 20px;
        padding: 10px;
        margin: 10px 0;
        .mint-cell-text {
            font-size: 18px;
        }
        .mint-cell-allow-right::after {
            width: 8px;
            height: 8px;
            border-color: #999;
        }
    }
    .isAgree {
        padding: 0 10px;
        font-size: 18px;
        text-decoration: none;
    }
    .mint-cell-wrapper {
        background-image: url() !important;
    }
    .mint-cell:last-child {
        background-image: url() !important;
    }
    .bottom {
        background: #fff;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .btn {
            box-shadow: 0px 2px 20px 0px rgba(152, 152, 152, 0.28);
            margin: 0 auto;
            height: 50px;
            line-height: 50px;
            width: 335px;
            text-align: center;
            font-size: 20px;
            border-radius: 5px;
            color: #ff612a;
            &.dissolution {
                background-color: #ff612a;
                margin-top: 35px;
                color: #fff;
            }
        }
    }
}
</style>

