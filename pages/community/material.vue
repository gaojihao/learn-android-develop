<template>
    <div id="material">
        <div class="detailHead">
            <div class="groupPic" :class="type ===1 ? '': 'normalGroup'"  @click.stop="type ===1 && addPic(2)">
                <header class="header">
                    <div class="header-nav">
                        <a href="javascript:" class="header_back"  @click.stop="go()"></a>
                    </div>
                    <div class="header-title">
                        <span class="header-text">{{name}}</span>
                        <span class="header-action">
                        <span v-if="type===1"
                              class="btn"
                              @click.stop="$router.push(`/community/auditing-member?topicId=${topicId}`)">
                            <i v-if="auditShow" />
                        </span>
                    </span>
                    </div>
                </header>
                <div class="group-pic">
                    <img :src="groupCover">
                    <div v-if="type===1" class="material-camera" @click.stop="addPic(1)"><img src="../../assets/images/material-camera.png"></div>
                </div>
                <h1>{{groupMaterial.title}}</h1>
                <div class="group-cover-text" v-if="type===1"><div>轻触修改封面</div></div>
                <div class="bg" v-bind:style="{backgroundImage:'url('+groupCoverBig+')'}"></div>
            </div>
            <uploader style="z-index: 99; position: absolute;top: -10000px;" ref="uploadPic" :src="'/api/imgs'" :isCreate='true' max="1" @updateFiles="updateGroupPic" :usingCropper="true" :cropper="cropper"></uploader>
        </div>
        <div class="introduce">
            <p class="introduce-title">
                <span>圈子介绍</span>
                <span v-if="type===1"
                      class="edit"
                      @click="editIntroduce">{{ introduceReadonly?'编辑':'完成' }}</span>
            </p>
            <textarea id="introduceTextarea"
                      class="introduce-content"
                      :disabled="introduceReadonly"
                      v-model="introduceContent"></textarea>
        </div>
        <div class="notice">
            <p class="notice-title">
                <span>圈子公告</span>
                <span v-if="type===1"
                      class="edit"
                      @click="editNotice">{{ noticeReadonly?'编辑':'完成' }}</span>
            </p>
            <textarea id="noticeTextarea"
                      class="notice-content"
                      :disabled="noticeReadonly"
                      v-model="noticeContent"></textarea>
        </div>
        <div class="member-box">
            <mt-cell class="member"
                     title="圈子成员"
                     :to="type===1?`/community/self-member?topicId=${topicId}`:`/community/client-member?topicId=${topicId}`"
                     :value="groupMemberList.length"
                     is-link></mt-cell>
            <div v-if="groupMemberList.length>0"
                 class="avator-list">
                <div v-for="(item,index) in groupMemberList"
                     class="avator"
                     :key="index"
                     :style="{backgroundImage:formartAvatar(item.avatar)}"></div>
                <div v-if="groupMemberList.length>6"
                     class="line">......</div>
            </div>
        </div>
        <mt-cell v-if="type===1"
                 class="middle noborder auditing-activity"
                 title="圈活动审核"
                 :to="`community/auditing-activity?topicId=${topicId}`"
                 is-link><i v-if='showRed' class="red"></i></mt-cell>
        <mt-cell v-if="type===1"
                 class="middle noborder setting"
                 title="设置"
                 :to="`community/setting?topicId=${topicId}&auditFlag=${groupMaterial.auditFlag}`"
                 is-link></mt-cell>
        <div v-if="type!==1&&groupMaterial.isFollow"
             class="btn-box">
            <div class="btn"
                 @click="exitGroup">退出圈子</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { Field, Toast } from 'mint-ui'
import uitls from '../../utils/formatter'
import head from '../../components/common/header'
import uploader from '~/components/uploader.vue'
import spinner from '~/components/common/loading/initiate-loading'
import api from '@/api'
import Share from '@/utils/share'

export default {
    components: {
        headTop: head,
        uploader
    },
    data() {
        return {
            type: 0,
            back: 0,
            className: 1,
            backgroundColor: '1',
            name: '圈子资料',
            introduceReadonly: true,
            noticeReadonly: true,
            introduceContent: '',
            noticeContent: '',
            auditShow: false,
            topicId: this.$route.query.topicId, //学习圈ID
            groupPic:require('../../assets/images/noCover.png'),
            groupPicBig:require('../../assets/images/group/noCover.png'),
            showRed:false,
            cropper: {
                autoCropWidth: 150,
                autoCropHeight: 150,
            }
        }
    },
    watch: {
        groupMaterial(val) {
            if (val.userId === this.uid) {
                this.type = 1
            } else {
                this.type = 0
            }
            this.$set(this, 'introduceContent', val.content)
            this.$set(this, 'noticeContent', val.announcement)

            this.$nextTick(() => {
                this.autoTextarea(document.getElementById('introduceTextarea'))
                this.autoTextarea(document.getElementById('noticeTextarea'))
            })
        }
    },
    computed: {
        ...mapGetters({
            groupMaterial: 'community/groupMaterial',
            groupMemberList: 'community/groupMemberList',
            uid: 'common/uid'
        }),

        groupCoverBig:function(){
            let cover = this.groupMaterial.cover?this.groupMaterial.cover.name:this.groupPicBig
            return (cover!=''&&cover)?cover:this.groupPicBig
        },
        groupCover:function(){
            let cover = this.groupMaterial.head?this.groupMaterial.head.name:this.groupPic
            return (cover!=''&&cover)?cover:this.groupPic
        },
    },
    mounted() {

        spinner.show({
            style: {
                'z-index': 20
            }
        });


        this.getGroupMaterialHandler({
            ID: this.topicId,
            cityId: '',
            uid: this.uid
        })
        this.getTopicFollowListHandler({
            topicId: this.topicId,
            page: 1,
            size: 6
        })
        this.getFollowUnderAnditList({
            topicId: this.topicId,
            page: 1,
            size: 10
        })
        this.getTopicActivityAuditCount({
            topicId: this.topicId,
            uid: this.uid
        })
        this.autoTextarea(document.getElementById('introduceTextarea'))
        this.autoTextarea(document.getElementById('noticeTextarea'))
    },

    beforeDestroy(){
        spinner.hide();
    },

    methods: {
        ...mapActions({
            getGroupMateria: 'community/getGroupMateria',
            getTopicFollowList: 'community/getTopicFollowList'
        }),
        async getFollowUnderAnditList(queryConditions) {
            const res = await api.community.getFollowUnderAnditList(queryConditions)
            if (res.status === 200) {
                if (res.data.length > 0) {
                    this.$set(this, 'auditShow', true)
                }
            }
        },
        async getTopicActivityAuditCount(queryConditions) {
            const res = await api.community.getTopicActivityAuditCount(queryConditions)
            if (res.status === 200) {
                if (res.data> 0) {
                    this.$set(this, 'showRed', true)
                }
            }
        },
        
        go(){
            this.$router.go(-1)
        },
        async editIntroduce() {
            if (this.introduceReadonly) {
                this.introduceReadonly = false
            } else {
                const res = await api.community.editIntroduce({
                    description: this.introduceContent,
                    topicId: this.topicId,
                    uid: this.uid,
                    uname: ''
                })
                if (res.status === 200) {
                    this.introduceReadonly = true
                    Toast('编辑成功')
                }
            }
        },
        async editNotice() {
            if (this.noticeReadonly) {
                this.noticeReadonly = false
            } else {
                const res = await api.community.editNotice({
                    announcement: this.noticeContent,
                    topicId: this.topicId,
                    uid: this.uid,
                    uname: ''
                })
                if (res.status === 200) {
                    this.introduceReadonly = true
                    Toast('编辑成功')
                }
            }
        },
        async getGroupMaterialHandler(queryCondtions) {
            let result = await this.getGroupMateria(queryCondtions)

            Share({
                title: this.groupMaterial.title,
                desc:  this.groupMaterial.content,
                imgUrl:  this.groupCover
            })

            spinner.hide();
        },
        async getTopicFollowListHandler(queryCondtions) {
            this.getTopicFollowList(queryCondtions)
        },
        async exitGroup() {
            const res = await api.community.exitGroup({
                uid: this.uid,
                topicId: this.topicId,
                followStatus: 0
            })
            if (res.status === 200) {
                Toast('操作成功')
                this.$router.go(-2)
            }
        },
        addPic(type){
            console.log('type', type)
            if(type === 2){
                this.cropper={
                    autoCropWidth: 375,
                    autoCropHeight: 224,
                }
            }else{
                this.cropper={
                    autoCropWidth: 150,
                    autoCropHeight: 150,
                }
            }
            this.updateGroupPicType = type;
            this.$refs.uploadPic.add();
        },
        async updateGroupPic(e){
            console.log(e)
            if(e.finish){
                let url = e.files[0].url;

                if(this.updateGroupPicType === 1){
                    const res = await api.community.editGroupHeadUrl({
                        headUrl: url,
                        topicId: this.topicId,
                        uid: this.uid,
                        headWidth: 0,
                        headHeight: 0,
                        uname: ''
                    }).catch(function () {})
                    if (res && res.status === 200) {
                        this.groupMaterial.head.name = url
                        Toast('编辑成功')
                    }
                }else{
                    const res = await api.community.editGroupCoverUrl({
                        coverUrl: url,
                        topicId: this.topicId,
                        uid: this.uid,
                        coverWidth: 0,
                        coverHeight: 0,
                        uname: ''
                    }).catch(function () {})

                    if (res && res.status === 200) {
                        this.groupMaterial.cover.name = url
                        Toast('编辑成功')
                    }
                }

                this.$refs.uploadPic.reset();
            }else{
                let error = false;
                e.files && e.files.map(function (f) {
                    if(f.error){
                        error = true;
                    }
                })
                if(error) {
                    Toast('上传失败，请稍后重试');
                    this.$refs.uploadPic.reset();
                }
            }
        },
        formartAvatar(data) {
            return data ? `url(${data})` : 'url(/images/avator.png)'
        },
        autoTextarea: (elem, extra, maxHeight) => {
            extra = extra || 0
            var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in global,
                isOpera = !!global.opera && !!global.opera.toString().indexOf('Opera'),
                addEvent = function(type, callback) {
                    elem.addEventListener ? elem.addEventListener(type, callback, false) : elem.attachEvent('on' + type, callback)
                },
                getStyle = elem.currentStyle
                    ? function(name) {
                          var val = elem.currentStyle[name]

                          if (name === 'height' && val.search(/px/i) !== 1) {
                              var rect = elem.getBoundingClientRect()
                              return rect.bottom - rect.top - parseFloat(getStyle('paddingTop')) - parseFloat(getStyle('paddingBottom')) + 'px'
                          }

                          return val
                      }
                    : function(name) {
                          return getComputedStyle(elem, null)[name]
                      },
                minHeight = parseFloat(getStyle('height'))

            elem.style.resize = 'none'

            var change = function() {
                var scrollTop,
                    height,
                    padding = 0,
                    style = elem.style

                if (elem._length === elem.value.length) return
                elem._length = elem.value.length

                if (!isFirefox && !isOpera) {
                    padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'))
                }
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop

                elem.style.height = minHeight + 'px'
                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding
                        style.overflowY = 'auto'
                    } else {
                        height = elem.scrollHeight - padding
                        style.overflowY = 'hidden'
                    }
                    style.height = height + extra + 'px'
                    scrollTop += parseInt(style.height) - elem.currHeight
                    document.body.scrollTop = scrollTop
                    document.documentElement.scrollTop = scrollTop
                    elem.currHeight = parseInt(style.height)
                }
            }

            addEvent('propertychange', change)
            addEvent('input', change)
            addEvent('focus', change)
            change()
        }
    }
}
</script>

<style lang="less">
#material {
    #introduceTextarea,
    #noticeTextarea {
        background-color: #fff;
        width: 100%;
        resize: none;
        height: 24px;
        overflow-y: hidden;
        display: block;
        margin: 0 auto;
        overflow: hidden;
        font-size: 14px;
        line-height: 24px;
        padding: 2px;
    }
    .header-title {
        .btn {
            display: inline-block;
            width: 24px;
            height: 24px;
            background-image: url('../../assets/images/material-member-white.png');
            background-repeat: no-repeat;
            background-size: cover;
            margin-top: 5px;
            position: relative;
            i {
                display: inline-block;
                width: 8px;
                height: 8px;
                background-color: red;
                border-radius: 50%;
                position: absolute;
                right: -3px;
                top: -3px;
            }
        }
    }
    .shrink_header {
        .btn {
            margin-top: 6px;
            width: 20px;
            height: 20px;
        }
    }
    .mint-cell-wrapper {
        background-image: url('');
    }
    .mint-cell:last-child {
        background-image: url('');
    }
    padding-bottom: 2px;
    background-color: #f2f2f2;
    .auditing-activity {
        margin-bottom: 0 !important;
        border-bottom: 1px solid #f0f0f0;
        .red{
            width:10px;
            height:10px;
            border-radius:50%;
            background-color:red;
        }
    }
    .setting {
        margin-top: 0 !important;
    }
    .middle {
        height: 70px;
        line-height: 70px;
        font-size: 20px;
        padding: 10px 10px 10px 20px;
        margin: 10px 0;
        .mint-cell-text {
            font-size: 18px;
        }
        .mint-cell-allow-right::after {
            width: 10px;
            height: 10px;
            border-color: #c8c8cd;
        }
        &::before {
            clear: both;
            content: '';
            position: absolute;
            top: 24px;
            left: 14px;
            width: 6px;
            height: 20px;
            background-color: #f8bf37;
            border-radius: 1px;
        }
        &.noborder{
            padding-left: 10px;
            &::before{
                display: none;
            }
        }
    }
    .detailHead{
        header{
            position: absolute;
            z-index: 11;
            width: 100%;
            text-align: center;
            padding-top: 5px;
            color: #fff;
            span{
                font-size: 16px;
                line-height: 38px;
                height: 40px;
            }
            .header-nav{
                position: absolute;
            }
            .header_back{
                width: 18px;
                height: 16px;
                background: url('~assets/images/icon_back-white.png') no-repeat 0 0;
                background-size: 18px 16px;
                display: block;
                margin: 10px 0 10px 20px;
            }
            .header-title{
                color: #fff;
                text-align: center;
                padding: 0 10px;
                display: block;
                font-size: 20px;
                /*overflow: hidden;*/
                .header-text{
                    font-size: 20px;
                    display: inline-block;
                    -webkit-line-clamp: 1; /* 限制在一个块元素显示的文本的行数 */
                    -webkit-box-orient: vertical; /* 垂直排列 */
                    overflow: hidden;
                    padding: 0 40px;
                }
                .header-action{
                    display: inline-block;
                    text-align: right;
                    position: absolute;
                    right: 10px;
                    padding-right: 10px;
                }
                .header-action:after{
                    clear: both;
                }
            }
        }
        .groupPic{
            height:200px;
            position:relative;
            overflow:hidden;
            background-repeat:no-repeat;
            background-position:center;
            background-size:cover;

            .back{
                position:absolute;
                width: 18px;
                height: 16px;
                z-index:11;
                background: url(../../assets/images/group/back-w@2x.png) no-repeat 0 0;
                background-size: 18px 16px;
                display: block;
                margin: 10px 0 10px 20px;
                filter: blur(-10px)
            }
            .group-pic{
                position:absolute;
                display:block;
                z-index:11;
                width:80px;
                height:80px;
                border:solid 3px #fff;
                border-radius:5px;
                top:48px;
                left:50%;
                margin-left:-40px;

                .material-camera{
                    position: absolute;
                    top: 50%;
                    width: 36px;
                    height: 36px;
                    z-index: 12;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            img{
                width:100%;
                height:100%;
                object-fit:cover;
            }
            h1{
                position:absolute;
                z-index:11;
                color:#fff;
                font-size:15px;
                text-align:center;
                top: 136px;
                width:100%;
            }
            .group-cover-text{
                position:absolute;
                text-align: center;
                top: 166px;
                z-index:11;
                width: 100%;
                color: #fff;

                div{
                    font-size: 10px;
                    display: inline-block;
                    padding: 3px 20px 4px;
                    background-color: rgba(0,0,0, 0.35);
                    border-radius: 10px;
                }
            }

            .bg{
                content:"";
                position:absolute;
                width:100%;
                height:100%;
                top:0;
                left:0;
                filter: blur(2px);
                background-repeat:no-repeat;
                background-position:center;
                background-size:cover;
            }

            &.normalGroup{
                .group-pic{
                    top:68px;
                }
                h1{
                    top: 156px;
                }
            }
        }

        .groupPic:after{
            content:"";
            position:absolute;
            width:100%;
            height:100%;
            top:0px;
            left:0px;
            background:rgba(0,0,0,0.4);
        }


    }
    .material-header {
        background-color: #fff;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0 20px 25px 20px;
        margin-bottom: 10px;
        .avator {
            width: 60px;
            height: 60px;
            background-color: #f0f0f0;
            background-image: url('../../assets/images/star.png');
            background-repeat: no-repeat;
            background-size: cover;
            margin-right: 15px;
            border-radius: 5px;
        }
        .desc {
            display: flex;
            flex-direction: column;
            .desc-title {
                font-size: 20px;
            }
            .desc-time {
                font-size: 12px;
                color: #999;
            }
        }
    }
    .introduce {
        padding: 26px 20px 26px 20px;
        background-color: #fff;
        margin-bottom: 10px;
        .introduce-title {
            margin-left: 14px;
            font-size: 20px;
            margin-bottom: 25px;
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &::before {
                clear: both;
                content: '';
                position: absolute;
                top: 5px;
                left: -14px;
                width: 6px;
                height: 20px;
                background-color: #f8bf37;
                border-radius: 1px;
            }
            .edit {
                font-size: 16px;
                color: #12a4ff;
                &:active {
                    color: #12a4ff;
                }
            }
        }
        .introduce-content {
            text-decoration: none;
            .mint-field-core {
                font-size: 15px !important;
                color: #666 !important;
            }
        }
    }
    .notice {
        padding: 26px 20px 26px 20px;
        background-color: #fff;
        margin-bottom: 10px;
        .notice-title {
            justify-content: space-between;
            align-items: center;
            display: flex;
            margin-left: 10px;
            font-size: 20px;
            margin-bottom: 25px;
            position: relative;
            &::before {
                clear: both;
                content: '';
                position: absolute;
                top: 5px;
                left: -14px;
                width: 6px;
                height: 20px;
                background-color: #f8bf37;
                border-radius: 1px;
            }
            .edit {
                font-size: 16px;
                color: #12a4ff;
                &:active {
                    color: #12a4ff;
                }
            }
        }
        .notice-content {
            text-decoration: none;
            .mint-field-core {
                font-size: 15px !important;
                color: #666 !important;
            }
        }
    }
    .member {
        padding: 10px 18px;
        .mint-cell-wrapper {
            background-image: url();
            &::before {
                clear: both;
                content: '';
                position: absolute;
                left: 14px;
                width: 6px;
                height: 20px;
                background-color: #f8bf37;
                border-radius: 1px;
            }
        }
        .mint-cell-value.is-link {
            margin-right: 10px;
        }
        .mint-cell-allow-right::after {
            width: 10px;
            height: 10px;
        }
        &.mint-cell:last-child {
            background-image: url();
        }
        .mint-cell-text {
            font-size: 20px;
            position: relative;
        }
    }
    .avator-list {
        padding: 0px 20px 34px 20px;
        background: #fff;
        position: relative;
        margin-bottom: 10px;
        .avator {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-color: #eee;
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 30px;
            margin-right: 5px;
        }
        .line {
            position: relative;
            top: -18px;
            left: 6px;
            display: inline-block;
            width: 40px;
            height: 40px;
            line-height: 40px;
            color: #999;
            font-size: 14px;
        }
    }
    .btn-box {
        background-color: #fff;
        height: 250px;
        display: flex;
        align-items: center;
        justify-content: center;
        .btn {
            width: 335px;
            height: 50px;
            background-color: #ff612a;
            box-shadow: 0px 2px 20px 0px rgba(152, 152, 152, 0.28);
            border-radius: 5px;
            font-size: 20px;
            color: #fff;
            text-align: center;
            line-height: 50px;
        }
    }

    a.mint-cell:hover{
        text-decoration: none;
    }
}
</style>
