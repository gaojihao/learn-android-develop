<template>
  <div>
    <div class="reportItem" v-if="complainStyle != 'x'">
        <div class="report" @click="showActionSheet($event)">举报</div>
        <div class="cancel" @click="closeActionSheet">取消</div>
    </div>
    <div v-if="complainStyle != 'x'" class="complain-mask" @click="closeActionSheet"></div>
    <actionsheet cancel-text="取消" :actions="actions" v-model="show" title="请选择举报类型"></actionsheet>
  </div>
</template>
<script>

import actionsheet from './common/actionsheet.vue'
import { Toast } from 'mint-ui'
import utils from '@/utils/utils'
import { mapGetters, mapActions } from 'vuex'
import api from '@/api'
import bus from '@/utils/eventbus'

export default {
    components: {
        actionsheet
    },

    props: {
        type: {//1是举报，2是评论，3回复
            type: String,
            required: true
        },
        blogId: {
            type: String,
            required: true
        },
        refId: {
            type: String,
            required: true
        },
        propShow: {
            type: Boolean,
            default: function () {
                return false;
            }
        },
        complainStyle: {
            type: String,
        }
    },
    watch:{
        async show(val) {
            if(val){
                await this.getFeedReportType();
            }else{
                this.$emit("hide");
            }
        },

        async propShow(val) {
            this.show = val;
        }
    },
    computed: {

        ...mapGetters({
            uid: 'common/uid',
            feedReportType: 'common/feedReportType'
        }),

        actions: function () {
            let that = this;
            return this.feedReportType.map(function (item) {
                return {
                    ...item,
                    method: that.submit
                }
            })
        },

        images:  function () {
            let images = [];
            if(this.files && this.files.length){
                return this.files.map(function (item) {
                    return item.src;
                })
            }
            return images;
        },
    },

    data() {
        return {
            show: false,
        }
    },

    async mounted(){
//        if(!this.feedReportType.length){
//            await this.getFeedReportType();
//        }
    },

    methods: {
        ...mapActions({
            getFeedReportType: 'common/getFeedReportType'
        }),

        showActionSheet(e){
            e.stopPropagation()
            this.show = true;
        },
        closeActionSheet(){
            bus.$emit('close')
        },
        async submit(e) {
            bus.$emit('close')

            let result = await api.ucenter.feedReport({
                type: this.type,
                blogId: this.blogId,
                refId: this.refId,
                reportType: e.id,
                uid: this.uid,
                reason: e.name
            })

            Toast('举报成功')

            return true;
        },
    }
}
</script>
<style lang="scss">
@import  '../pages/theme.scss';
    .reportItem{
        box-shadow:$itemShadow;
        background:#fff;
        position: absolute;
        z-index: 9;
        left: -70px;
        .report{
            width:75px;
            height:50px;
            font-size:14px;
            text-align:center;
            line-height:50px;
            border-bottom:1px solid #e0e0e0;
        }
        .cancel{
            width:75px;
            height:50px;
            font-size:14px;
            text-align:center;
            line-height:50px;
        }

    }

    .complain-mask{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        z-index: 2;

    }

</style>
