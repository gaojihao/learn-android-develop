<template>
  <div class="allComment">
    <header-top :name="title">
    </header-top>
    <write :blogId='blogId' :isAllComment='true'></write>
    <ul class="content"  v-infinite-scroll="loadMore" infinite-scroll-disabled="loaded" infinite-scroll-distance="10">
        <commentItem v-for='(item,index) in commentList' :key='item.index' :replyList="item"/>
    </ul>
    <!-- 占位符 -->
    <div class='bottom_footer_placeholder'>
    </div>
    <div v-if='noData' class="noData">
      <img :src="noDataImg">
      <h1>沙发等你来抢</h1>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import Vue from 'vue'
import headerTop from '@/components/common/header'
import commentItem from './components/commentItem'
import sendComment from '@/components/sendComment'
import write from '~/components/common/write.vue'
import {wx} from '@/utils/share'

import { InfiniteScroll , Actionsheet , Indicator , Toast} from 'mint-ui';
Vue.use(InfiniteScroll);
export default {
  name: 'allComment',
  data () {
    return {
      title:'全部评论',
      commentList:[],
      blogId:this.$route.query.id,
      loading:false,
      isMore:false,
      page:1,
      noData:false,
      noDataImg:require('../../assets/images/no-publish.png')
    }
  },
  components: {
      commentItem,
      headerTop,
      sendComment,
      write,
  },
  mounted(){
      wx.hideAllNonBaseMenuItem();
      this.fetch()
  },
  computed:{
    loaded:function(){
        return !this.isMore ||(this.loading && this.isMore)
    },
  },
  methods:{
    async fetch(){
     this.loadMore()
    },
    async loadMore(){
      Indicator.open('加载中...');
      let _self = this
      let params = {
        uid:this.uid,
        blogId:this.blogId,
        sortFlag:1,
        page:_self.page,
        size:10,
      }
      const commentList = await api.groups.getComments(params).then(res=>{
        if(res.status == 200){
          Indicator.close()
          _self.loading = false,
          _self.commentList =_self.commentList.concat(res.data.uisCommentOutput)
          _self.noData=_self.commentList.length==0?true:false
          _self.isMore = res.isMore
          _self.page++
        }
      }).catch(err=>{
        Indicator.close()
      })
    },
  }
}

</script>



<style lang="scss" scoped>
@import  '../theme.scss';
.allComment{
  padding:0 20px;
  .noData{
    margin-top:100px;
    height:200px;
    font-size:20px;
    text-align:center;
    color:#999;
    padding:0 20px;
    img{
        width:225px;
    }
    h1{
        font-size:14px;
        color:#999;
        text-align:center;
        margin-top:32px;
        height:30px;
        line-height:30px;
    }
  }
}
.headline{
  font-size:27.5px;
  margin:15px;
}

.comment_input_footer {
  width: 100%;
  position: fixed;
  bottom:0;
  left:0;
  right:0;

  background-color: white;
  display:flex;
}

.comment_textfield_bg{
  padding:5px 20px;
  flex:1;
  display:flex;
  box-shadow:$itemShadow;
  input{
    background-color: #f1f1f1;
    border-radius:5px;
  }
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
