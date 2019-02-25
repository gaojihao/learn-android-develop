<template>
  <div class="rating_page">
    <header-top :name="notesDetail.title">
    </header-top>

    <div class="student_info">
        <p class="course_info">{{notesDetail.course}}</p>
    </div>
    <div class="userinfo_bg">

      <nuxt-link :to="{path:'/ucenter/userprofile', query:{userId: author.uid}}">
          <img class="user_head_image" src="../../assets/images/note/detail/useravatar@2x.png" alt="Smiley face" >
      </nuxt-link>

      <div class="userinfo_name_time_area">
          <div><span class='userinfo_text' v-if="notesDetail.originAuthor">{{notesDetail.originAuthor}}</span></div>
          <div><span class='userinfo_text'>{{notesDetail.publishDate}}</span></div>
      </div>
      <div class="watching_count">
          <img class="user_readed_icon" src="../../assets/images/note/detail/read@2x.png" alt="Smiley face" >
          <div class='read_text'>{{notesDetail.readTotal}}人</div>
      </div>
    </div>

    <div class='artical_content'>
      <p class='contentPara'>
          {{notesDetail.content}}
        <br><br>
      </p>
    </div>

    <documentsList :documents="notesDetail.attachments" />

    <div class='comment_list_header'>
      <div><p class="comment_hint_label">评论</p></div>
        <div class="comment_count_arrow" @click="gotoAllCommentsList(noteId)">
          <p class='coment_count_text'>共{{notesDetail.commentTotal}}条评论</p>
          <img class="arrowImg" src="../../assets/images/note/detail/arrowright@2x.png" alt="arrow">
        </div>
    </div>

    <commentItem 
    :commentsList="commentList" 
    :noteId='noteId'
    :isDataFromOutside='true' 
    v-on:commentItmeFocus="commentItmeFocusHandler" 
    v-on:commentRespondItemFocus="commentRespondItemFocusHandler"/>

    <div class="comment_input_footer" id="footer">
      <div class='comment_textfield_bg'>
        <input id="txtinput" type="text" class="comment_textfield" :placeholder="comentsInputPlaceolder" @keyup.enter="commentSend" @blur="commentSend()" ref="input" v-model="commentsValue">
      </div>
      <div class="commment_footer_zan_star">

        <img v-on:click='zanAction' class="zan_star_img" v-bind:src="zanBtnImageSrc" alt="">
        <p v-bind:class="[isZan ? 'people_count_zan' : 'peogle_count_unselected']">{{notesDetail.likes}}人</p>
      </div>
      <div  class="commment_footer_zan_star">

        <img v-on:click='favAction' class="zan_star_img" v-bind:src="favBtnImageSrc" alt="">
        <p v-bind:class="[isFav ? 'people_count_fav' : 'peogle_count_unselected']">{{notesDetail.collectedTotal}}人</p>
      </div>
    </div>

    <router-link :to="{path: '/note/AllCommentsList',query:{noteId:this.noteId}}" class='foward_all_comment'>
      <p class='foward_all_comment_para'>查看全部评论</p>
    </router-link>


    <div class='bottom_footer_placeholder'>
    </div>

  </div>

</template>

<script>

import commentItem from './components/commentItem'
import documentsList from './components/documentsList'
import api from '@/api'
import headerTop from '~/components/common/header.vue'
import { mapGetters, mapActions } from 'vuex'
import bus from '@/utils/eventbus'
import { Indicator, Toast} from 'mint-ui';
import Share from '@/utils/share'


export default {
  name: 'ArticalDetail',

  data () {
    return {
      noteId:this.$route.query.noteId,

      title:'title',
      notesDetail:{},
      author:{},
      msg: '细胞的分裂-生物',

      clientHeight:0,

      commentsValue:'',
      currentCommentClickData:{},//帖子评论
      currentCommentRespondClickData:{},//回复评论
      comentsInputPlaceolder : "评论",

      commentLength:0,
      commentList:[],

      isZan:false,
      isFav:false,

      // documentsList:[
      //   {
      //       name:'细胞的分裂.pdf',
      //       icon:''
      //   },
      //   {
      //       name:'细胞的分裂.doc',
      //       icon:''
      //   },
      //   {
      //       name:'细胞的分裂.ppt',
      //       icon:''
      //   },
      //   {
      //       name:'细胞的分裂.xls',
      //       icon:''
      //   }
      // ]
    }
  },
  components: {
  		commentItem,
      documentsList,
      headerTop
  },
  computed:{
    ...mapGetters({
        uid: 'common/uid'
    }),
    zanBtnImageSrc:{
      get:function(){
        if( this.isZan == true ){
           return require('../../assets/images/note/detail/zan_selected@2x.png')
        }else {
           return require('../../assets/images/note/detail/zan_normal@2x.png')
        }
      }
    },
    favBtnImageSrc:{
      get:function(){
        if( this.isFav == true )
        {
           return require('../../assets/images/note/detail/fav_selected@2x.png')
        }
        else
        {
           return require('../../assets/images/note/detail/fav_normal@2x.png')
        }
      }
    },
    commentsCount:{
        get:function(){
          //var list = this.notesDetail.commentList
          return Object.keys(this.notesDetail.commentList).length
        }
    }
  },
  mounted () {
   this.clientHeight = document.documentElement.clientHeight;
   const that = this;
   // 安卓手机键盘吊起挡住输入框

   console.log("clientHeight = " + this.clientHeight )

   window.onresize = function() {

     console.log("window.onresize")

     if(document.documentElement.clientHeight < that.clientHeight) {
       // scrollVal为负值
       console.log("scrollVal为负值 = ")

       let scrollVal = document.documentElement.clientHeight-that.clientHeight;
       $(".alert-main").css("marginTop",scrollVal);
       $(".bottom-create").hide();

     }else {

       console.log("scrollVal为正值")

       $(".alert-main").css("marginTop",0);
       $(".bottom-create").show();

     }
   };

    this.fetchDetail();
  },
  created(){
    console.log("created this.noteId = " + this.noteId)
    },
    methods:{
      commentRespondItemFocusHandler(item){
        console.log("commentRespondItemFocusHandler" + item)

        this.currentCommentRespondClickData = item
        document.getElementById("txtinput").focus()

        this.comentsInputPlaceolder = "回复" + this.currentCommentRespondClickData.user.nickName
      },
      commentItmeFocusHandler(item){
        console.log("commentItmeFocusListener" + item)

        this.currentCommentClickData = item

        console.log("to be comment uid = " + this.currentCommentClickData.user.uid + ", curretnUID = " + this.uid)

        document.getElementById("txtinput").focus()

        console.log(""+document.getElementById("txtinput"))

        this.comentsInputPlaceolder = "回复" + this.currentCommentClickData.user.nickName
      },
      async gotoAllCommentsList(params){
          this.$router.push({path:'/note/AllCommentsList',query:{noteId: this.noteId}})
      },
      async fetchDetail(){

        //todo
        const response = await api.note.getNoteDetail({
             // ID: "194038351901691904",
             ID: this.noteId,  // 替换为noteId
             uid: this.uid
         })

         if (response.status == 200) {
               console.log(response.data)
               this.notesDetail = response.data
               this.author = this.notesDetail.author

               this.commentLength =  Object.keys(this.notesDetail.commentList).length
               this.commentList = this.notesDetail.commentList

               this.isZan = Boolean(this.notesDetail.likeStatus)
               this.isFav = Boolean(this.notesDetail.isCollect)

               console.log("this.isZan = ", this.isZan)

               console.log("commentList in detail = " + this.commentList)

               console.log("success loading data")

               Share({
                  title: this.notesDetail.title,
                  desc: this.notesDetail.content,
                  imgUrl: this.notesDetail.mediaList && this.notesDetail.mediaList.length > 0 ? this.notesDetail.mediaList[0].uploadImage.img.name : null,
               })

         }
      },
      async zanRequest(isZan){

        console.log("zanRequest this.noteId = " + this.noteId)

        const response = await api.note.noteLike(
          {
            blogId:this.noteId, //"194042631937265664",todo
            uid:this.uid,
            type:"1",
            status: (isZan?'1':'0')
          }
        )

        if (response.status == 200) {
              console.log(response.data)


              bus.$emit("userInteraction", {
                 blogId : this.noteId,
                 isZan : this.isZan,
                 isFav : this.isFav,
                 zanNum : this.notesDetail.likes,
                 favNum : this.notesDetail.collectedTotal,
              })


        }
      },
      async favRequest(isFav){

        console.log("favRequest this.noteId = " + this.noteId)

        const response = await api.note.noteCollect(
          {
            blogId:this.noteId,//, "194042631937265664" todo
            uid:this.uid,
            status:(isFav?'1':'0')
          }
        )

        if (response.status == 200) {
              console.log(response.data)

              bus.$emit("userInteraction", {
                 blogId : this.noteId,
                 isZan : this.isZan,
                 isFav : this.isFav,
                 zanNum : this.notesDetail.likes,
                 favNum : this.notesDetail.collectedTotal,
              })
        }
      },
      async commentSendRequest(commentContent){

        if( this.currentCommentRespondClickData != null && this.currentCommentRespondClickData.user != null )
        {
            Indicator.open('发表中...')
            const response = await api.note.noteReplyComment(
              {
                blogId: this.noteId,
                commentId: this.currentCommentRespondClickData.commentId,
                uid : this.uid,//TODD,
                toReplyId: this.currentCommentRespondClickData.ID, //回复第一层评论是0， //this.currentCommentClickData.user.uid,
                content: commentContent
              }
            )

            if (response.status == 200) {
                  console.log(response.data)
                  Toast("回复回复成功")

                  //reset status
                  this.commentsValue = ''
                  this.currentCommentRespondClickData = {}
                  this.comentsInputPlaceolder = "评论"
            }
            Indicator.close()

        }
        else if( this.currentCommentClickData.ID != null )//回复评论
        {
          Indicator.open('发表中...')
          const response = await api.note.noteReplyComment(
            {
              blogId: this.noteId,
              commentId: this.currentCommentClickData.ID,
              uid : this.uid,//TODD,
              toReplyId: "0", //回复第一层评论是0， //this.currentCommentClickData.user.uid,
              content: commentContent
            }
          )

          if (response.status == 200) {
                console.log(response.data)
                Toast("回复评论成功")

                //reset status
                this.commentsValue = ''
                this.currentCommentClickData = {}
                this.comentsInputPlaceolder = "评论"
          }
          Indicator.close()

        }
        else //评论帖子
        {

          Indicator.open('发表中...')
          const response = await api.note.noteComment(
            {
              blogId: this.noteId,
              uid:this.uid,
              content:commentContent
            }
          )

          if (response.status == 200) {
                console.log(response.data)
                Toast("评论帖子成功")
                this.commentsValue = ''
                this.comentsInputPlaceolder = "评论"
          }
          Indicator.close()

        }

      },
      zanAction:function(event){

        this.notesDetail.likes += ( this.isZan ? -1 : 1 )
        this.isZan = !this.isZan

        //issue zan request here
        this.zanRequest(this.isZan)
      },

      favAction:function(event){

        this.notesDetail.collectedTotal += ( this.isFav ? -1 : 1 )
        this.isFav = !this.isFav

        //issue fav request here
        this.favRequest(this.isFav)
      },
      commentSend:function(event){

        if( this.commentsValue.length > 0 )
        {
            console.log('reponse comment send , contents = ' + this.commentsValue)

            this.commentSendRequest(this.commentsValue)
        }

      }

    }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h1{
  font-weight: normal;
  font-size: 40px;
  margin-left: 10px;
}



/* ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 5px;
}
a {
  color: #42b983;
} */

.student_info{
  display: flex;
  flex-direction: row;
}

.grade_info{
  margin-left:10px;
  margin-bottom:15px;
  margin-top:10px;
  color: #8e8e8e;
}

.major_info{
  margin-left:8px;
  margin-bottom:15px;
  margin-top:10px;
  color: #8e8e8e;
}

.course_info{
  margin-left:8px;
  margin-bottom:15px;
  margin-top:10px;
  color: #8e8e8e;
}



.hello{
  display: flex;
  flex-direction: column;
}

.userinfo_bg{
  display: flex;
  justify-content: flex-flex-start;
  flex-direction: row;
}

.user_head_image{
  margin-left: 10px;
  width:30px;
  height:30px;
  flex-basis: auto;
}

.userinfo_name_time_area{
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  flex:1;
}

.userinfo_text{
  color: #999999;
}

.read_text{
  color: #999999;
  margin-left: 5px;
  line-height: 14px;
}

.watching_count{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  margin-right: 10px;
  flex:1;
}

.user_readed_icon
{
  width: 16.25px;
  height: 13px;
}

.artical_content
{
  margin: 10px;
}

.contentPara{
  color: #333333;
  font-size:13px;
  line-height: 22px;
  text-indent:30px;
}

.comment_list_header{
  display:flex;
  justify-content: space-between;
  margin:10px;
}

.comment_hint_label
{
  font-size: 17px;
  color:#3d3d3d;
  font-weight: bold;
}

.coment_count_text{
  font-size: 10px;
  color:#999999;
}

.comment_count_arrow{
  display:flex;
  align-items: flex-end;
}

.arrowImg{
  width: 5px;
  height: 9px;
  margin-left: 5px;
  margin-bottom: 4px;
}

.comment_input_footer {
  width: 100%;
  height: 40px;
  position: fixed;
  bottom:0;
  left:0;
  right:0;
  background-color: white;
  display:flex;

  box-shadow: 0px 0px 5px #e9e9e9;
}

.comment_textfield_bg
{
  margin-left: 15px;
  margin-top: 2.5px;
  margin-bottom: 2.5px;
  flex:0.6;
  background-color: #f1f1f1;
  border-radius:5px;
  display:flex;
}

.comment_textfield
{
  border:none;
  flex:1;
  background-color:rgba(0,0,0,0);
  margin-left: 10px;
}

.commment_footer_zan_star
{
  display:flex;
  flex-direction: column;
  flex:0.2;
  justify-content: center;
  align-items: center;
}

.zan_star_img
{
  width:15px;
  height:15px;
}

.people_count_zan
{
  color:#ff832a;
}

.people_count_fav
{
  color:#119aff;
}

.peogle_count_unselected
{
  color:#7d7d7d;
}

.bottom_footer_placeholder
{
  height:40px;
}

.foward_all_comment
{
  display:flex;
  margin: 15px;
  background-color: #f6f5f6;
  border-radius:5px;
  height:40.5px;
  justify-content: center;
  align-items: center;
}

.foward_all_comment_para
{
  font-size: 15px;
  color:#5b5b5b;
}


</style>
