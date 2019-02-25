<template>
  <div>
      <mt-loadmore :top-method="noteLoadTop" :bottom-method="noteLoadBottom" :bottom-all-loaded="noteAllLoaded" :autoFill="false" ref="noteloadmore">
        <ul>
            <li class="note_item" v-for="(item, index) in notes" :key="item.id">
                <div class="note_container">
                    <div @click="gotoNoteDetail(item.feedId)">
                        <div v-if="!isFromFav"　v-bind:class="[index === 0 ? 'mark_1' : (index === 1 ? 'mark_2':(index === 2 ? 'mark_3':'')), 'mark']">
                            <span class="num">{{index+1}}</span>
                            <div class="jiahao"></div>
                        </div>
                        <div class="note_cell_container">
                            <img :src="item.pic.name" alt="">
                            <div class="note_info">
                                <h3>{{item.title}}</h3>
                                <div class="note_auther_date">
                                    <span>{{item.course}}</span>
                                    <span>{{item.publishTime | dateFormat}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="note_cell_bottom">
                        <div class="smallItem" @click="collectAction(item, index)">

                            <img v-if="item.isCollect" class="smallImg" src="../../../assets/images/note/list/fav_highlighted@2x.png" alt="fav">
                            <img v-else class="smallImg" src="../../../assets/images/note/list/fav@2x.png" alt="fav">

                            <span v-bind:class="['smallText', item.isCollect ? 'favtext_selected' : '']">{{item.collectNum}}人</span>
                        </div>
                        <div class="smallItem middleItem" @click="favourAction(item)">

                            <img v-if="item.likeStatus" class="smallImg" src="../../../assets/images/note/list/like_highlighted@2x.png" alt="">
                            <img v-else class="smallImg" src="../../../assets/images/note/list/like@2x.png" alt="">

                            <span v-bind:class="['smallText', item.likeStatus ? 'zantext_selected' : '']">{{item.likeTotal}}人</span>
                        </div>
                        <div class="smallItem">
                            <img class="read_smallImg" src="../../../assets/images/note/list/read@2x.png" alt="">
                            <span class="smallText">{{item.readTotal}}人</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
      </mt-loadmore>
    <no-content :content="blankContent" v-if="!notes || !notes.length"></no-content>
  </div>

</template>


<script >
import Vue from 'vue'
import api from '@/api'
import { Loadmore, InfiniteScroll } from 'mint-ui';
import formatter from '~/utils/formatter'
import moment from 'moment'
import noContent from '~/components/common/noContent.vue'
Vue.component(Loadmore.name, Loadmore);

export default {
    name: 'notesList',
    props:['userId','isFromFav'],
    data(){
        return{
            //data
            notes: [],
            currentPage: 1,
            hasMore: false,
            noteAllLoaded: false,
            blankContent: {     // 无数据展示
                message: '啥都没有，你果然不是一位收藏家~',
                src: require('../../../assets/images/no-collect.png')
            }
        }
    },
    components: {
        noContent
    },
    mounted() {
         //fetch note data
         if (this.notes.length == 0) {
            this.fetch()
         }
    },
    filters: {
        dateFormat: function (date) {
            if (!date) {
                return ''
            } 
            if ((new moment(date)).year() == (new Date()).getFullYear()) {
                return formatter.formatTime(date, 'MM-DD')
            } else {
                return formatter.formatTime(date, 'YYYY-MM-DD')
            }
        }
    },
    methods:{
        async fetch(page = 1, pos = 'top') {     // 获取笔记列表数据
            let params = {
              uid: this.$store.state.common.uid,
              hostPuid: this.userId,   // 当前查看的用户ID
              type: 'collected',
              page: page,    // 第几页
              size: 10,          // 条数限制，默认为10
              feedTypes: 1      // 1-笔记, 2-动态, 4-活动
            }
            const info = await api.groups.getUserCollectedList(params)
            if (info.status == 200) {
                if (page > 1) {
                    this.notes = this.notes.concat(info.data.list)
                } else {
                    this.notes = info.data.list
                }
                this.hasMore = info.data.isMore 
            }
            if (pos === 'top') {
                this.$refs.noteloadmore.onTopLoaded();
            } else {
                this.$refs.noteloadmore.onBottomLoaded();
            }
            this.noteAllLoaded = !this.hasMore
        },
       async collectAction (note, index) {   // 收藏 & 取消
        const info = await api.note.noteCollect(
          {
            blogId: note.feedId,
            uid: this.userId,
            status: (note.isCollect ? '1' : '0')
          }
        )
        if (info.status == 200) {
            if (note.isCollect) {
                note.collectNum -= 1
            } else {
                note.collectNum += 1
            }
            note.isCollect = !note.isCollect;
            this.notes = this.notes.map(function (item, i) {
                if(i !== index){
                    return item;
                }
            })
        }
      },
      async favourAction (note) {    // 赞 & 取消
        const info = await api.note.noteLike(
          {
            blogId: note.feedId,//noteId, todo
            uid: this.userId,
            type: "1",
            status: (note.likeStatus ? '0' : '1')
          }
        )
        if (info.status == 200) {
            if (note.likeStatus) {
                note.likeTotal -= 1
            } else {
                note.likeTotal += 1
            }
            note.likeStatus = !note.likeStatus
        }
      },
      noteLoadTop(){    // 下拉刷新
        this.currentPage = 1
        this.fetch(1, 'top')
      },
      noteLoadBottom(){     // 上拉更多
        if (this.hasMore) {
            this.currentPage += 1
            this.fetch(this.currentPage, 'bottom')
        }
      },
      gotoNoteDetail (noteId) {     // 进入笔记详情
        this.$router.push({path: '/note/ArticalDetail', query: {noteId: noteId}})
      }
    }
}
</script>

<style lang="less" scoped>



    .note_item {
        margin: 25px 20px;
        background-color: white;
        &:first-child {
            margin: 10px 20px;
        }
    }

    .note_container{
        border-radius: 5px;
        box-shadow: 0px 0px 10px 5px #f4f4f4;
        position: relative;
    }

    .mark{
        position: absolute;
        top: 0;
        right: 15px;
        width: 20px;
        height: 30px;
        background-color: #BDBEBE;
        display: flex;
        justify-content: center;
        align-content: center;
    }

    .mark_1{
        background-color: #FC4D34;
    }

    .mark_2{
        background-color: #51CD34;
    }

    .mark_3{
        background-color: #24A6FC;
    }

    .num{
        color: white;
        font-size: 10px;
        align-self: center;
        margin-bottom:5px;
    }

    .jiahao{
        position: absolute;
        height: 0px;
        width: 0px;
        left: 0;
        bottom: -1px;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 9px solid white;
    }


    .note_cell_container{
        padding: 20px 10px;
        display: flex;
        flex-direction: row;
        border-bottom: solid 1px rgba(233,233,233, 0.6);
        img {
            width: 64px;
            height: 64px;
            display: inline-block;
            border-radius: 8px;
            object-fit: cover;
        }
        .note_info{
            margin-left:10px;
            display: flex;
            flex-direction: column;
            flex: 1;

            h3 {
                margin-top: 5px;
                font-size: 16px;
                color: #333;
                font-weight: 600;
            }
        }
    }

    .head{
        width: 20px;
        height: 20px;
        margin-right:4px;
    }

    .note_auther_date{
        display: flex;
        margin-top:6px;
        justify-content:space-between;
        align-items: center;
        color: #999;
        font-size: 12px;
    }

    .note_auther{
        display: flex;
        align-items: center;
    }

    .middleItem{
        border-left:solid 1px rgba(233,233,233, 0.6);
        border-right:solid 1px rgba(233,233,233, 0.6);
    }

    .note_cell_bottom {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: 10px 0;
        align-items: center;
    }

    .smallItem{
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1;
        justify-content: center;
    }

    .smallImg{
        width: 18px;
        height: 18px;
    }

    .read_smallImg{
        width: 18px;
        height: 14.5px;
    }

    .smallText{
        margin-left:5px;
        font-size: 12px;
        color: #999;
    }

    .favtext_selected{
        color: #48a4f8;
    }

    .zantext_selected{
        color: #ff770c;
    }
</style>
