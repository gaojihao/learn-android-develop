<template>
    <div class="container" style="margin-top: 20px">
        <mt-field label="请输入用户ID:" placeholder="" v-model="uid"></mt-field>
        <mt-button size="normal"  @click="setCookie">确定</mt-button> &nbsp;&nbsp;
        <mt-button size="normal"  @click="clearStorage">清除用户信息</mt-button>
    </div>
</template>

<script>
import headerTop from '~/components/common/header.vue'
import api from '@/api'
import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'
import { Popup, Toast } from 'mint-ui';

import utils from '../utils'

export default {
    layout: 'noauth',
    data: function() {
        return {
            uid: 1
        }
    },
    computed: {

    },
    components: {
    },
    mounted: function() {
        this.uid =   utils.storage.get("uid") || '1'
    },
    methods: {
        setCookie: function () {
            Toast('设置成功')
            location.href = '/?stuempno=' + this.uid + "&nickname=1&headimgurl=1&sign_method=1&timestamp=1&sign=1";
        },

        clearStorage: function () {
            utils.storage.clear();
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
