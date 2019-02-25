<template>
    <div class="rating_page">
        <div class="bg">
            <header-top :name="this.name">
                <div slot="action" class="header-group">
                    <img class="header-icon" v-if="popupVisible" src="~assets/images/icon_up.png" alt="" @click="showPopup">
                    <img class="header-icon" v-if="!popupVisible" src="~assets/images/icon_down.png" alt="" @click="showPopup">
                    <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="popup-menu">
                        <ul>
                            <li>动态</li>
                            <li @click="toPublishActivity" class="active">活动</li>
                        </ul>
                    </mt-popup>
                </div>
            </header-top>
            <div class="container">
                <div class="input-list">
                    <textarea v-model="content" name="" id="" cols="30" rows="3" placeholder="随便说点什么吧......"></textarea>
                    <uploader :src="'/api/imgs'" max="3" @updateFiles="updateFiles"></uploader>
                </div>
                <button @click="publishActivity">发布</button>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api'
import { Popup, Toast , Indicator} from 'mint-ui';
import { mapGetters, mapActions } from 'vuex'
import headerTop from '~/components/common/header.vue'
import uploader from '~/components/uploader.vue'
import {wx} from '@/utils/share'

export default {
    middleware: 'auth',
    components: {
        headerTop,
        uploader
    },
    data(){
        return{
            name: '动态',
            popupVisible: false,
            content: '',
            submitting : false,
            file: {
                finish: true
            },
        }
    },
    computed: {
        ...mapGetters({
            uid: 'common/uid',
        })
    },
    mounted(){
        wx.hideAllNonBaseMenuItem();
    },
    methods:{
        showPopup: function () {
            this.popupVisible = true;
        },
        toPublishActivity: function () {
            this.$router.replace({path: '/groups/PublishActivity', query:{topicId: this.$route.query.topicId}})
        },

        async publishActivity () {

            if(this.submitting){
                return;
            }

            if(this.validateParams()){

                this.submitting = true;

                let formObject = {
                    "blogId": 0,
                    "topicId": [this.$route.query.topicId || 0],
                    "content": this.content.replace(/\n/g, "<br/>"),
                    "contentType":"1",
                    "title": this.content.replace(/\n/g, "<br/>")
                }

                if(this.file.files && this.file.files.length > 0){
                    formObject['mediaList'] = this.file.files.map(function (item) {
                        return {
                            "type":"img",
                            "uploadImage":{
                                "img": {
                                    "height":0,
                                    "name":item.url,
                                    "width":0
                                }
                            }
                        }
                    });
                }

                let result = await api.groups.publishPoster({
                    uid: this.uid,
                    FFAN_JSON_FORM: formObject
                })
                .catch(err => {
                    
                    this.submitting = false;

                    if(err.status != 200){
                        this.$toast('发布失败');
                    }
                });


                if(result){
                    let _self=this
                    Indicator.open('加载中...');
                    setTimeout(function(){
                        Toast('发布成功');
                        _self.$router.go(-1);
                        _self.Indicator.close()
                    },6000);
                    
                }
            }
        },

        validateParams () {
            if (this.content.length < 5) {
                this.$toast('内容太少啦！');
                return false
            }

            if(!this.file.finish){
                this.$toast('图片上传中，请稍等！');
                return false
            }

//            if(!this.file.files || !this.file.files.length ){
//                this.$toast('请至少上传一张图片');
//                return false
//            }

            return true
        },

        updateFiles(e){
            this.file = e;
        }

    }
}
</script>

<style lang="scss" scoped>
    @import '../theme.scss';
    .header-group {
        width: 100%;
        text-align: left;
        position: relative;
        .popup-menu {
            position: absolute;
            top:52px;
            left: -50px;
            transform: translate3d(0%, 0%, 0);
            background:transparent;
            ul {
                color: #c0c0c0;
                background: #fff;
                opacity: 1;
                border-radius: 5px;
                box-shadow: 2px 2px 12px 2px rgba(152,152,152,0.28), -2px -2px 12px 2px rgba(152,152,152,0.28);
                text-align: center;
                font-size: 20px;
                li {
                    padding: 20px 10px;
                    min-width: 130px;
                    border-bottom: solid 1px #e0e0e0;
                    &.active {
                        color: $baseTitleColor;
                    }
                    &:last-child {
                        border-bottom: none;
                    }
                }
            }
        }
        .header-icon{
            width: 15px;
            height: 10px;
            margin-left: 10px;
        }
    }

    .container {
        padding: 5px 0 50px;

        .input-list {
            margin: 12px 20px;
            border-radius: 3px;
            font-size: 15px;
            box-shadow: 0 4px 40px 0 rgba(152,152,152,0.28);
        }
        input, textarea {
            display: block;
            padding: 12px 20px;
            width: 100%;
            &:not(:first-child) {
                margin: 18px 0;
            }
            box-sizing: border-box;
            border: none;
            color: $baseTitleColor;
            &::-webkit-input-placeholder { // 修改input placeHolder颜色
                color:    #666;
            }
        }
        textarea {
            resize: none;
            height: 180px;
        }
        button {
            background-color: white;
            font-size: 20px;
            color: #12a4ff;
            display: block;
            width: 100%;
            padding: 15px;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            border: none;
            background: #fff;
            box-shadow: 0 -2.5px 5px 2.5px rgba(0, 0, 0, $alpha: 0.05);
        }
    }
</style>
<style lang="scss">
    .header-group{
        .v-modal{
            background:transparent;
        }
    }
</style>
