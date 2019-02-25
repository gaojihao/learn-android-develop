<template>
  <div>
    <!-- <h1 class='headline'>全部评论</h1> -->
    <header-top :name="title">
    </header-top>

    <commentItem :noteId="noteId" v-on:commentItmeFocus="commentItmeFocusHandler" v-on:commentRespondItemFocus="commentRespondItemFocusHandler"/>

    <div class="comment_input_footer" id="footer">
      <div class='comment_textfield_bg'>
          <input id="txtinput" type="text" class="comment_textfield" @keyup.enter="commentSend"  @blur="commentSend" v-model="commentsValue" :placeholder="comentsInputPlaceolder">
      </div>
    </div>

    <!-- 占位符 -->
    <div class='bottom_footer_placeholder'>
    </div>

  </div>
</template>



<script>

import commentItem from './components/commentItem'
import headerTop from '~/components/common/header.vue'
import api from '@/api'
import { mapGetters, mapActions } from 'vuex'
import { Indicator , Toast} from 'mint-ui';
import {wx} from '@/utils/share'

export default {
  name: 'ArticalDetail',
  data () {
    return {
      noteId:'',
      title:'全部评论',
      msg: '细胞的分裂-生物',
      commentsList:[],
      commentsValue:'',
      currentCommentClickData:{},//帖子评论
      currentCommentRespondClickData:{},//回复评论
      comentsInputPlaceolder : "评论"
    }
  },
  components: {
  		commentItem,
      headerTop
  },
  created(){
    wx.hideAllNonBaseMenuItem();
    this.noteId = this.$route.query.noteId;
    console.log('AllCommentsList param noteId = ' + this.noteId)
    //
    // this.fetchCommentsList()
  },
  computed: {
      ...mapGetters({
          uid: 'common/uid'
      })
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



<style scoped>

.headline{
  font-size:27.5px;
  margin:15px;
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
}

.comment_textfield_bg
{
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 2.5px;
  margin-bottom: 2.5px;
  flex:1;
  background-color: #f1f1f1;
  border-radius:5px;
  display:flex;
}

.comment_textfield
{
  border:none;
  flex:1;
  background-color:rgba(0,0,0,0);
  /* margin-left: 10px; */
  text-align: center;
}

.bottom_footer_placeholder
{
  height:40px;
}

</style>
