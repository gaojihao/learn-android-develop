<template>
    <div class="rating_page">
        <div class="container">
            <header-top name="活动" :canShrink=false>
                <div slot="action" class="header-group">
                    <img class="header-icon" v-if="popupVisible" src="~assets/images/icon_up.png" alt="" @click="showPopup">
                    <img class="header-icon" v-if="!popupVisible" src="~assets/images/icon_down.png" alt="" @click="showPopup">
                    <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="popup-menu">
                        <ul>
                            <li @click="toPublishPoster" class="active">动态</li>
                            <li>活动</li>
                        </ul>
                    </mt-popup>
                </div>
            </header-top>

            <div>
                <ul class="input-list">
                    <li>
                        <span>活动主题:</span>
                        <input type="text" v-model.trim="activityTheme" placeholder="请输入活动主题">
                    </li>
                    <li>
                        <span>活动地点:</span>
                        <input type="text" v-model.trim="activityLocation" placeholder="请输入活动地点">
                    </li>
                    <li class="activity-time noflex">
                         <div class="time-cell" @click="startTimeClicked">
                             <span class="time-title">活动开始时间:</span>
                             <div v-bind:class="startDateClassObject">{{activityStartDate | dateFormat}}</div>
                             <div class="icon-right-arrow">
                                <span></span>
                             </div>
                        </div>
                        <div class="time-cell" @click="endTimeClicked">
                            <span class="time-title">活动结束时间:</span>
                            <div v-bind:class="endDateClassObject">{{activityEndDate | dateFormat}}</div>
                            <div v-if="endDateClassObject === 'time-placeholder'" class="time-optional">(可选填)</div>
                            <div class="icon-right-arrow">
                                <span></span>
                            </div>
                        </div>
                    </li>
                    <li class="activity-time noflex">
                         <div class="time-cell" @click="applyStartTimeClicked">
                             <span class="time-title">活动报名开始时间:</span>
                             <div v-bind:class="applyStartDateClassObject">{{activityApplyStartDate | dateFormat}}</div>
                             <div class="icon-right-arrow">
                                <span></span>
                             </div>
                        </div>
                        <div class="time-cell" @click="applyEndTimeClicked">
                            <span class="time-title">活动报名结束时间:</span>
                            <div v-bind:class="applyEndDateClassObject">{{activityApplyEndDate | dateFormat}}</div>
                            <div class="icon-right-arrow">
                                <span></span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <span>活动人数:</span>
                        <input type="number" pattern="[0-9]*" maxlength="6" v-model.number="activityPeopleNum" min='1' placeholder="请输入活动所需人数">
                    </li>
                    <li class="noflex">
                        <div class="activity-intro">
                            <span>活动简介:</span>
                            <textarea v-model.trim="activityIntroduction" cols="20" rows="3" placeholder="请输入活动简介"></textarea>
                        </div>
                        
                        <uploader :src="'/api/imgs'" max="3" @updateFiles="updateFiles"></uploader>
                    </li>
                </ul>

                <button @click="publishActivity">发布</button>
            </div>
            <div class="datePicker">
                <mt-datetime-picker
                            type="datetime"
                            ref="picker"
                            year-format="{value}"
                            month-format="{value}"
                            date-format="{value}"
                            hour-format="{value}时"
                            minute-format="{value}分"
                            @confirm="datetimePickerConfirmClicked"
                            @visible-change="datetimePickerVisibleChanged"
                            :startDate="pickStartDate"
                            :endDate="pickEndDate"
                        >
                </mt-datetime-picker>
            </div>
            <toastMsg v-show="showMsgToast" :title='toastTitle' :content='toastContent' :btn='toastBtn' :type='2' :isShowClose='false'></toastMsg>
        </div>
    </div>
</template>

<script>
    import headerTop from '~/components/common/header.vue'
    import { DatetimePicker, Toast, Popup, Picker, Indicator} from 'mint-ui';
    import formatter from '~/utils/formatter'
    import toastMsg from '@/components/common/toastMsg'
    import uploader from '~/components/uploader.vue'
    import api from '@/api'
    import bus from '@/utils/eventbus'
    import {wx} from '@/utils/share'

    export default {
        data () {
            return {
                activityTheme: '',  // 活动主题
                activityLocation: '',   // 活动地点
                activityStartDate: '',  // 活动开始时间
                activityEndDate: '',   // 活动结束时间（可选）
                activityApplyStartDate: '',   // 活动报名起始时间
                activityApplyEndDate: '',   // 活动报名结束时间
                activityPeopleNum: '', // 活动人数（可选）
                activityIntroduction: '',  // 活动简介（可选）
                file: {
                    finish: true
                },

                currentDatePick: 1, // 日期选择器，开始时间-1， 结束时间-2， 报名起始时间-3, 报名结束时间-4
                popupVisible: false,

                toastTitle: '审核中',
                toastContent: '您发布的活动需要圈主审核通过才能在圈子可见，可以先在“我的发布”进行预览',
                toastBtn:'我知道了',
                showMsgToast: false, // 审核中的toast
                topicId:this.$route.query.topicId
            }
        },
        components: {
            headerTop,
            toastMsg,
            uploader
        },
        filters: {
            dateFormat: function (date) {
                if (!date) {
                    return '请选择'
                }
                return formatter.formatTime(date, 'YYYY-MM-DD HH:mm')
            }
        },
        computed: {
            pickStartDate: function () {
                if (this.currentDatePick === 1) {
                    return new Date()
                } else if (this.currentDatePick === 2) {
                    if (this.activityStartDate != undefined && this.activityStartDate != '') {
                        return this.activityStartDate;
                    } else {
                        return new Date()
                    }
                } else if (this.currentDatePick === 3) {
                    return new Date()
                } else if ( this.currentDatePick === 4) {
                    if (this.activityApplyStartDate != undefined && this.activityApplyStartDate != '') {
                        return this.activityApplyStartDate;
                    } else {
                        return new Date()
                    }
                }
            },
            pickEndDate: function () {
                if ( this.currentDatePick === 4 && this.activityEndDate !== '') {
                    return this.activityEndDate
                }else if(this.currentDatePick === 3 && this.activityEndDate !== ''){
                    return this.activityEndDate
                }
                return undefined
            },
            startDateClassObject: function () {
                if (this.activityStartDate == undefined) {
                    return 'time-placeholder';
                }
                return typeof(this.activityStartDate) === "object" ? 'time-underline' : 'time-placeholder'
            },
            endDateClassObject: function () {
                if (this.activityEndDate == undefined) {
                    return 'time-placeholder';
                }
                return typeof(this.activityEndDate) === "object" ? 'time-underline' : 'time-placeholder'
            },
            applyStartDateClassObject: function () {
                if (this.activityApplyStartDate == undefined) {
                    return 'time-placeholder';
                }
                return typeof(this.activityApplyStartDate) === "object" ? 'time-underline' : 'time-placeholder'
            },
            applyEndDateClassObject: function () {
                if (this.activityApplyEndDate == undefined) {
                    return 'time-placeholder';
                }
                return typeof(this.activityApplyEndDate) === "object" ? 'time-underline' : 'time-placeholder'
            }
        },
        mounted() {
            wx.hideAllNonBaseMenuItem();
            let _self = this;
			bus.$on('btnclick',function(data) {
                // 存到本地，对此用户以后不再弹出提示框
                // const info = {
                //     'userId' : _self.$store.state.common.uid,
                //     'showActivityToast' : true
                // }
                // global.localStorage.setItem('showActivityToastKey', JSON.stringify(info))
                // 关闭提示框并返回上一页，为了上页能刷新，使用replace
                _self.showMsgToast = false
                _self.$router.go(-1)
			})
        },
        methods: {
            showPopup: function () {
                this.popupVisible = true
            },
             async publishActivity () {
                if (this.validatePublishParams()) {
                    let ffan = {
                        'type': 4,
                        'title': this.activityTheme,
                        'activityAddress': this.activityLocation,
                        'activityStartDate': Number(this.activityStartDate),
                        'activityEnrollStartDate': Number(this.activityApplyStartDate),
                        'activityEnrollEndDate': Number(this.activityApplyEndDate), 
                        'content': this.activityIntroduction,
                        'uid': this.$store.state.common.uid,
                        'userId': this.$store.state.common.uid,
                        "blogId": "0",
                        "topicId":[this.$route.query.topicId],
                    }
                    if (this.file.files) {
                        ffan.mediaList=this.file.files.map(function (item) {
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
                        })
                    }
                    var param = {
                        uid: this.$store.state.common.uid,
                        FFAN_JSON_FORM: ffan,
                    }

                    if (this.activityEndDate !== '') {
                        param.FFAN_JSON_FORM.activityEndDate = Number(this.activityEndDate)  // 非必填
                    }
                    if (typeof this.activityPeopleNum == "number" && this.activityPeopleNum > 0) {
                        param.FFAN_JSON_FORM.activityLimitNum = this.activityPeopleNum
                    } else {
                        param.FFAN_JSON_FORM.activityLimitNum = -1
                    }
                    Indicator.open('加载中...')
                    let that = this;
                    await api.groups.publishPoster(param).then(function (response) {
                        Indicator.close()
                        // let showInfo = JSON.parse(global.localStorage.getItem('showActivityToastKey'));
                        // if (showInfo && showInfo != null &&  showInfo.userId === that.$store.state.common.uid && showInfo.showActivityToast === true) {
                        //     that.$router.go(-1)
                        // } else {
                            that.showMsgToast = true
                        // }
                    })
                    .catch(function (error) {
                        Indicator.close()
                    });
                }            
            },
            validatePublishParams () {
                if (this.activityTheme.length <= 0) {
                    this.$toast('请输入活动主题');
                    return false
                } 
                if (this.activityLocation.length <= 0) {
                    this.$toast('请输入活动地点');
                    return false
                }
                if (typeof this.activityStartDate == "string") {
                    this.$toast('请选择活动起始时间');
                    return false
                }
                if (typeof this.activityApplyStartDate == "string") {
                    this.$toast('请选择活动报名起始时间');
                    return false
                }
                if (typeof this.activityApplyEndDate == "string") {
                    this.$toast('请选择活动报名结束时间');
                    return false
                }
                if (typeof this.activityPeopleNum == "number" && this.activityPeopleNum == 0) {
                    this.$toast('活动所需人数不能为0')
                    return false
                }
                // if(!this.file.files || !this.file.files.length ){
                //     this.$toast('请至少上传一张图片');
                //     return false
                // }
                return true
            },
            // 点击选择活动起始时间
            startTimeClicked () {
                this.currentDatePick = 1
                this.$refs.picker.open()
            },
            // 点击选择活动结束时间
            endTimeClicked () {
                this.currentDatePick = 2
                this.$refs.picker.open()
            },
            // 点击选择活动报名开始时间
            applyStartTimeClicked () {
                this.currentDatePick = 3
                this.$refs.picker.open()
            },
            // 点击选择活动报名结束时间
            applyEndTimeClicked () {
                this.currentDatePick = 4
                this.$refs.picker.open()
            },
            // 选择日期后点击“确定”
            datetimePickerConfirmClicked (date) {
                if (this.currentDatePick === 1) {
                    this.activityStartDate = date
                    if (this.activityEndDate && 
                        this.activityStartDate.getTime() > this.activityEndDate.getTime()) {
                        this.activityEndDate = ''
                    }
                } else if (this.currentDatePick === 2) {
                    this.activityEndDate = date
                    if(this.activityApplyStartDate != undefined && this.activityApplyStartDate != ''&&(this.activityApplyStartDate>this.activityEndDate)){
                        this.activityApplyStartDate=''
                        this.activityApplyEndDate=''
                    }
                } else if (this.currentDatePick === 3) {
                    this.activityApplyStartDate = date
                    if (this.activityApplyEndDate && 
                        this.activityApplyStartDate.getTime() > this.activityApplyEndDate.getTime()) {
                        this.activityApplyEndDate = ''
                    }
                } else if (this.currentDatePick === 4) {
                    this.activityApplyEndDate = date
                }
            },
            datetimePickerVisibleChanged (visible) {
                if (visible) {
                    ModalHelper.afterOpen()
                } else {
                    ModalHelper.beforeClose()
                }
            },
            toPublishPoster () {
                this.$router.replace({path:'/groups/PublishPoster', query:{topicId: this.$route.query.topicId}})
            },
            updateFiles(e){
                this.file = e;
            }
        },
        destroyed() {
            ModalHelper.beforeClose()
        },
    }
        var ModalHelper = (function(bodyCls) {
            var scrollTop;
            var originPosition;
            var originWidth;
            return {
                afterOpen: function() {
                    scrollTop = document.scrollingElement.scrollTop;
                    originPosition = document.body.style.position;
                    originWidth = document.body.style.width;
                    document.body.style.position = 'fixed';
                    document.body.style.width = '100%';
                    document.body.style.top = -scrollTop + 'px';
                },
                beforeClose: function() {
                    document.body.style.position = originPosition;
                    document.body.style.width = originWidth;
                    // scrollTop lost after set position:fixed, restore it back.
                    document.scrollingElement.scrollTop = scrollTop;
                }
            };
    })('modal-open');
</script>

<style lang="scss" scoped>
@import '../theme.scss';
    @mixin common-box-shadow {
        border-radius: 2.5px;
        box-shadow: 2px 2px 12px 2px rgba(152,152,152,0.28), -2px -2px 12px 2px rgba(152,152,152,0.28);
    }
    .modal-open {
        position: fixed;
        width: 100%;
    }
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
        .header-icon {
            width: 15px;
            height: 10px;
            margin-left: 10px;
        }
    }
    .container {
        padding-bottom: 50px;
        .input-list {
            padding: 12px 20px;
            li {
                padding: 21px 25px;
                position: relative;
                &:not(.noflex) {
                    display: flex;
                }
                @include common-box-shadow();
                &:not(:first-child) {
                    margin: 18px 0;
                } 
                span:first-child {
                    flex: 0 0 97px;
                    font-size: 15px;
                    color: $baseTitleColor;
                }
                .activity-intro {
                    
                    padding-bottom: 10px;
                    display: flex;
                }
                &.activity-time {
                    @include common-box-shadow();
                    padding: 0;
                    .time-cell {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        padding: 15px 25px;
                        &:not(:first-child) {
                            border-top: 1px solid #e0e0e0;
                        }
                        .time-title {
                            flex: 0 0 132px;
                        }
                        .time-underline {
                            flex: 1;
                            text-align: right;
                            font-size: 15px;
                            color: $baseTitleColor;
                        }
                        .time-placeholder {
                            flex: 1;
                            text-align: right;
                            font-size: 13px;
                            color: #999;
                        }
                        .time-optional {
                            font-size: 10px;
                            color: #999;
                        }
                        .icon-right-arrow {
                            flex: 0 0 20px;
                            text-align: right;
                            span { // 向右箭头
                                display: inline-block;
                                width: 10px;
                                height: 10px;
                                border-right: 1.5px solid #999;
                                border-bottom: 1.5px solid #999;
                                transform: rotate(-45deg);
                            }
                        }
                    }
                }
                .cheack{
                    color:#999;
                    margin-top:7px;
                }
            }

            input, textarea {
                display: block;
                width: 100%;
                box-sizing: border-box;
                border: none;
                color: $baseTitleColor;
                font-size: 15px;
                &::-webkit-input-placeholder { // 修改input placeHolder颜色
                    font-size: 13px;
                    color:    #999;
                }
            }
            textarea {
                // text-indent: 97px;
                line-height: 1.5;
                height: 85px;
            }
            // input不显示上下箭头
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
            }
        }
        textarea {
            resize: none;
            height: 125px;
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