<template>

<section class="load_more_bg">
  <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="loadmore">

    <ul class='comment_list_bg' >
      <!-- <li v-if="commentsList.lenth != 0" class='comment_item_bg' v-for="item in commentsList"> -->
      <li class='comment_item_bg' v-for="(item, key) in commentsListData">
         <div class="avatar_name_label_container" >
          <nuxt-link :to="{path:'/ucenter/userprofile', query:{userId: item.user.uid}}">
               <img class="user_head_image" src="../../../assets/images/note/detail/useravatar@2x.png" alt="user avartar">
          </nuxt-link>
          <div class='user_name_commenttime'>
              <p class='user_name_para' v-if="item.user.nickName != null && item.user.nickName.length > 0 ">{{item.user.nickName}} </p>
              <p class='user_name_para' v-else>用户</p>

              <p class='comment_time_para'>{{ Number(item.createTime) | formatTime('YYYY-MM-DD HH:mm') }}</p>
          </div>
          <!-- index={{key}} -->
          <div class="setReport" @click='setReport(item, key, item.blogId, item.id)'></div>
         </div>
         <p class='content_container' v-on:click="commentItemContentClick(item)">{{item.content}}</p>

         <div class='feedback_list_bg'>
           <div class='feedback_list_item' v-for="feedbackitem in item.replyList" v-on:click="commentRespondItemContentClick(feedbackitem)">

              <!-- <p class='feedback_content'>{{feedbackitem.content}}</p> -->
              <p class='feedback_content'>
                <span class='feedback_username'>{{feedbackitem.user?feedbackitem.user.nickName:''}}</span>
                <span class='feedback_label'>回复</span>
                <span class='feedback_username2'>{{feedbackitem.replyUser?feedbackitem.replyUser.nickName:''}}</span>
                :
                {{feedbackitem.content}}
              </p>
           </div>
         </div>

         <complain class='complain' v-if='item.complainShow'  :type='item.complainType' :blogId='item.complainBlogId' :refId='item.complainRefId'></complain>

      </li>
    </ul>

  </mt-loadmore>
</section>

</template>


<script>

import Vue from 'vue'
import api from '@/api'
import { Loadmore } from 'mint-ui';
Vue.component(Loadmore.name, Loadmore);
import { mapState, mapGetters, mapActions } from 'vuex'

import filters from '@/utils/filters'
import formatTime from '@/utils/formatter'
import complain from '~/components/complain.vue'
import bus from '@/utils/eventbus'

export default {
    name: 'commentItem',
    props:{
      commentsList:{
        type:[Array],
        required:false,
      },
      noteId:String,
      isDataFromOutside:Boolean,
    },
    components:{
      complain,
    },
    data () {
      return {
        currentPage:1,
        commentsListData:[],
        allLoaded:false,

        // //report relevant
        currentFocusComplainIndex:-1,
      }
    },
    computed: {
        ...mapGetters({
            uid: 'common/uid'
        })
    },
    filters:Object.assign(filters, formatTime),
    methods:{
      closeHandler(){
          //_self.currentFocusComplainItem.complainShow=false
          let _self=this

          if( _self.currentFocusComplainIndex != -1 )
          {
            var index = _self.currentFocusComplainIndex
            var item = _self.commentsListData[_self.currentFocusComplainIndex]
            item.complainShow = false
            this.$set(_self.commentsListData, index, item)

            console.log(item)
          }
      },
      setReport(item, index, blogId, id, e){

        //if exist, close others popup menu
        this.closeHandler()

        if ( item.complainShow == null )
        {
          item.complainShow = true
          item.complainType = '2'
          item.complainBlogId = blogId
          item.complainRefId = id

          //console.log(item)
        }else {
          item.complainShow = true
        }

        this.$set(this.commentsListData, index, item)

        //console.log(this.commentsListData)

        this.currentFocusComplainIndex = index

        console.log(this.currentFocusComplainIndex)

      },
      commentRespondItemContentClick(item){
        console.log('commentItemContentClick + ', item)
        this.$emit('commentRespondItemFocus', item)
      },
      commentItemContentClick(item){
        console.log('commentItemContentClick + ', item)
        this.$emit('commentItmeFocus', item)
      },
      async fetchCommentsList(page, isBottomPullFresh){

        //var currentpage = this.currentPage.toString()
        //todo this.noteId, //
        const response = await api.note.moreNoteComment({
             blogId: this.noteId,//"194042631937265664",
             uid: this.uid,
             sortFlag:"1",
             page: page.toString(),
             size:"10",
         })

         if (response.status == 200) {
               var commentsData = response.data.uisCommentOutput
               console.log(commentsData)

               if( isBottomPullFresh ){

                 if (!response.isMore) {
                     //todo
                     //document.querySelector('.mint-loadmore-bottom .mint-loadmore-text').innerText = '没有更多啦~'
                     this.allLoaded = true
                     console.log('allLoded set tobe true')
                 }

                this.commentsListData.concat(commentsData)

                this.$set(this, 'commentsListData', this.commentsListData.concat(commentsData))
                this.$refs.loadmore.onBottomLoaded();
               }
               else
               {
                 this.commentsListData = commentsData
                 this.$refs.loadmore.onTopLoaded();
                 this.allLoaded = false;
               }
         }
      },
      loadTop(){
          this.currentPage = 1
          this.fetchCommentsList(this.currentPage ,false)
      },
      loadBottom(){
          this.currentPage += 1
          this.fetchCommentsList(this.currentPage ,true)
      },
    },
    watch:{
      commentsList:function(val)
      {
        this.commentsListData = val
        console.log("commentsList changed")
      }
    },
    created(){

      bus.$on('close', this.closeHandler)
    },
    mounted(){
      // this.noteId = this.$route.query.noteId;

      console.log('AllCommentsList param noteId = ' + this.noteId)
      console.log("this.commentsList = "+this.commentsList)
      console.log("this.isDataFromOutside = "+this.isDataFromOutside)

      //if( this.noteId != null && this.noteId.length > 0  )
      if( !this.isDataFromOutside )
      {
        this.fetchCommentsList(this.currentPage, false)
        console.log("data from inside")
      }
      else
      {
        this.commentsListData = this.commentsList
        console.log("data from outside")
      }

    },
}
</script>


<style lang="scss"  scoped>
@import  '../../theme.scss';

.comment_list_bg{
  display: flex;
  /* background-color: green; */
  margin:10px;
  flex-direction: column;
}

.load_more_bg{
    height:100%;
    overflow:auto;
}

.comment_item_bg{
  margin-top: 15px;
  display: flex;
  flex-direction: column;

  position:relative;

  // min-height:100px;
}

.avatar_name_label_container{
  display: flex;
  flex-direction: row;
}

.content_container{
  margin-left:38px;
  margin-top: 10px;
}

.user_head_image{
  width: 30.5px;
  height: 30.5px;
}

.user_name_para
{
  margin-left: 10px;
}

.comment_time_para
{
  margin-left: 10px;
  color:#8e8e8e;
}

.user_name_commenttime
{
  display: flex;
  flex-direction: column;

  flex:1;
}

.feedback_list_bg
{
  display: flex;
  flex-direction: column;
  margin-left:38px;
  margin-top:10px;

  background-color: #f7f7f7;
}

.feedback_list_item
{
  display: flex;
  flex-direction: row;
  margin-top:10px;
  margin-bottom: 10px;
  align-items: top;

  // background-color: red;

}


.feedback_content
{
  color: #333333;
  margin-left:5px;
  word-wrap:break-word;
  word-break:break-all;

  .feedback_username
  {
    color:#00a4fb;
    margin-right:5px;
    margin-bottom:5px;
  }

  .feedback_username2
  {
    color:#00a4fb;
    margin-right:0px;
    margin-bottom:5px;
  }
}


.feedback_label{
  margin-right:5px;
}



.setReport{
  width:20px;
  height:20px;
  margin-right:5px;
  background:url(../../../assets/images/more.png);
  background-repeat:no-repeat;
  background-position:center;
  background-size:20px 20px;
}

.complain{
  position:absolute;
  top:0px;
  right:0px;
  z-index:200;
}








</style>
