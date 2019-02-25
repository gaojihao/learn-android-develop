<template>
  <div class="containerSearch">
    <div class="note-search">
      <div class="note-searchbar">
        <img :src="backIcon" alt="" class="close-icon" @click="onClose">
        <div class="note-searchbar-inner">
          <img :src="searchIcon" alt="" class="search-icon">
          <input ref='searchInput' @change='search($event)' @keyup='search($event)' @blur='onBlur($event)' type="search" name="" id="" placeholder="搜索标签，标题" class="note-searchbar-core">
        </div>
      </div>
    </div>
    <section v-if='searchHistoryShow' class="history-text">
      <h2>历史搜索</h2>
      <ul class="history">
        <li @click='addSearch($event)' v-for="(history ,index) in historys" :key="history.index" class="history-cell">
          <span class="history-item">{{history}}</span>
        </li>
      </ul>
    </section>
    <tagSearchList v-if="!searchHistoryShow&&comeFrom=='searchTagName'" :resultList='this.resultList'></tagSearchList>
    <!-- <notSearchList v-if="!searchHistoryShow&&comeFrom=='noteSearch'" :notes='this.resultList'></notSearchList> -->
    <ul class="searchGroup" v-if="!searchHistoryShow&&comeFrom=='groupDetail'">
      <groupSearchList v-for='(list,index) in resultList' :key='list.index'  :list='list' :isMaster='isMaster'></groupSearchList>
    </ul>
    <div v-show='noResult&&!searchHistoryShow' class="noResult">
      <img :src="noResultPic">
      <h1>搜索的词太高冷换个词试试吧~</h1>
    </div>
    <transition name="picker">
      <div v-if='showPicker' class="pickerAll">
        <ul>
          <li class="cancel"  @click='setCancel'>取消</li>
          <li class="done" @click='setDone'>确定</li>
        </ul>
        <mt-picker ref='picker' :slots="slots" @change="onValuesChange" value-key="name" ></mt-picker>
      </div>
    </transition>
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
    <mt-actionsheet :actions="actionsData" v-model="sheetVisibleReport"></mt-actionsheet>
    <div v-if='showPicker' class="mock"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import storage from '@/utils/storage'
import api from '@/api'
import bus from '@/utils/eventbus'
import tagSearchList from './groupsTagSearchList'
import notSearchList from './notSearchList'
import groupSearchList from '../groups/components/groupDetailItem'
import { mapGetters, mapActions } from 'vuex'
import { InfiniteScroll , Actionsheet , Indicator , Toast , Picker} from 'mint-ui';
Vue.component(Picker.name, Picker);
//noteSearch,searchTagName,groupDetail
export default {
    name: 'search',
    data() {
      return {
          //historys: [],
          value:'123',
          backIcon:require('../../assets/images/icon_back.png'),
          searchIcon:require('../../assets/images/search_word.png'),
          noResultPic:require('../../assets/images/search_2.png'),
          searchHistoryShow:true,
          resultList:[],
          noResult:false,
          comeFrom:this.$route.query.from,
          isMaster:this.$route.query.isMaster,
          sheetVisible:false,
          sheetVisibleReport:false,
          actions:[
            {
              name:"话题置顶",
              method:this.setTop
            },
            {
              name:"删除话题",
              method:this.deleteTopic
            }
          ],
          blogId:null,
          isTop:null,
          pickerDate:[{'name':'日','num':['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']},{'name':'周','num':['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}],
          //auditStatus:null
          slots: [],
          showPicker:false,
      };
    },
    created(){
        
    },
    components:{
      tagSearchList:tagSearchList,
      notSearchList:notSearchList,
      groupSearchList:groupSearchList,
    },
    computed: {
      ...mapGetters({
          uid: 'common/uid',
          userInfo:'common/userInfo',
          feedReportType: 'common/feedReportType'
      }),

      actionsData: function () {
          let that = this;
          return this.feedReportType.map(function (item) {
              return {
                  ...item,
                  method: that.submitReport
              }
          })
      },
      historys:function(){
        return storage.getSearchHistory('searchHistory')||[]
      }
    },
    methods:{
      ...mapActions({
          getFeedReportType: 'common/getFeedReportType'
      }),
      onClose(){
        this.$router.back()
      },
      search(e){
        //let searchValue = e.currentTarget.value;
        let searchValue = this.$refs.searchInput.value
        if(searchValue!=''){
          //笔记搜索
          // if(this.comeFrom == 'noteSearch'){
          //   let param={
          //     puid:this.uid,
          //     type:1,
          //     size:99999,
          //     keyword:searchValue,
          //     page:1,
          //     isContentSearch:'Y',
          //     status:1,
          //     sortField:1,
          //     sortType:1,
          //   }
          //   this.searchResult1(param)
          // }else 
          if(this.comeFrom == 'groupDetail'){
            let param={
              uid:this.uid,
              topicId:this.$route.query.topicId,
              page:1,
              size:99999,
              title:searchValue,
            }
            this.searchResult3(param)
          }else if (this.comeFrom == 'searchTagName') {
            let params={
              puid:this.uid,
              size:99999,
              keyword:searchValue,
              page:1,
            }
            this.searchResult2(params)
          }
          this.searchHistoryShow=false
        }else{
          this.searchHistoryShow=true
          //this.historys = storage.getSearchHistory('searchHistory')
        }
      },
      //笔记搜索
      // async searchResult1(param){
      //   const resultList = await api.groups.getSearchNotResult(param);
      //   this.resultList = resultList.data.feeds
      //   this.noResult=(this.resultList.length ==0)?true:false
      // },
      async searchResult2(param){
        const resultList = await api.groups.getSearchResult(param);
        this.resultList = resultList.data
        this.noResult=(this.resultList.length ==0)?true:false
      },
      async searchResult3(param){
        const resultList = await api.groups.getSearchGroupResult(param);
        this.resultList = resultList.data.list
        this.noResult=(this.resultList.length ==0)?true:false
    
      },
      onBlur(e){
        let val = e.currentTarget.value
        storage.setSearchHistory('searchHistory',val) 
      },
      addSearch(e){
        let val = e.currentTarget.firstChild.innerHTML
        this.$refs.searchInput.value = val
        console.log(val)
        this.search()
      },
      setTop(){
        if(this.complainShow||this.sheetVisible){
          let param ={
            blogId:this.blogId,
            uname:this.userInfo.nickName,
            uid:this.uid,
          }
          if(this.isTop){
            param.reason='取消置顶'
            api.groups.cancelTop(param).then(res=>{
              if(res.status == 200){
                Toast('取消置顶成功')
                this.page=1
                this.detailList=[]
                this.search()
              }
            }).catch(err=>{
              alert(JSON.stringify(err))
            })
          }else{
            this.showPicker=true
          }
        }
        
      },
      deleteTopic(){
        if(this.complainShow||this.sheetVisible){
          let param ={
            blogId:this.blogId,
            uid:this.uid,
          }
          api.groups.deleteTopic(param).then(res=>{
            if(res.status == 200){
              Toast('删除成功')
              this.page=1
              this.detailList=[]
              this.search()
            }
          }).catch(err=>{
            alert(JSON.stringify(err))
          })          
        }
      },
      async report(){
        await this.getFeedReportType()
        //this.actions=this.actionsData
        this.sheetVisibleReport=true
      },
      async submitReport(e) {
          let result = await api.ucenter.feedReport({
              type: 1,
              blogId: this.blogId,
              refId: this.blogId,
              reportType: e.id,
              uid: this.uid,
              reason: e.name
          })
          Toast('举报成功')
          return true;
      },
      onValuesChange(picker, values) {
          console.log(picker)
          console.log(values)
          if (!values[1]) {
            //picker.setValues([this.pickerDate[0].num,this.pickerDate[0]])
          }else{
            picker.setSlotValues(0, values[1].num);
          }
      },
      setCancel(){
        this.showPicker=false
      },
      setDone(){
        let _self=this
        let values = this.$refs.picker.getValues()
        let param ={
          blogId:this.blogId,
          uname:this.userInfo.nickName,
          uid:this.uid,
          type:values[1].name=="日"?1:2,//1是天2是周
          nums:Number(values[0]),
        }
        api.groups.setTop(param).then(res=>{
          Toast('置顶成功')
          _self.showPicker=false
          _self.page=1
          _self.detailList=[]
          _self.search() 
        }).catch(err=>{
          alert(JSON.stringify(err))
        })
      }
    },
    mounted(){
      //this.historys = storage.getSearchHistory('searchHistory')
      console.log(this.comeFrom)
      console.log(this.historys)
      this.slots= [
          {
            flex: 1,
            values: this.pickerDate[0].num,
            className: 'slot1',
            textAlign: 'right'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values:this.pickerDate,
            className: 'slot3',
            textAlign: 'left'
          }
      ]
      let _self = this
      bus.$on('set',function(data){
        _self.isMaster= (typeof(_self.isMaster)=='boolean')?_self.isMaster: eval(_self.isMaster.toLowerCase());
        _self.sheetVisible=data.isSet
        _self.blogId=data.blogId
        if(_self.isMaster){
          debugger
          _self.isTop=data.isTop
          _self.actions[0].name=_self.isTop?'取消置顶':'话题置顶'
          _self.actions[1].name=(data.feedType=='uge')?'删除活动':'删除话题'
        }else{
          _self.actions=[{
            name:"举报话题",
            method:_self.report
          }]
          _self.actions[0].name=(data.feedType=='uge')?'举报活动':'举报话题'
        }
      })
    },
    beforeDestroy () {
        bus.$off()
    },
}

</script>

<style lang="scss" scoped>
@import  '../theme.scss';

.containerSearch{
    background-color: white;
    
}

.note-searchbar{
  display: flex;
  justify-content:space-between;
  align-items: center;
  margin-top:20px;
  padding:0 20px; 
}

.note-searchbar-inner{
  -webkit-box-align: center;
  align-items: center;
  background-color: #EEEEEE;
  display: flex;
  font-size: 16px;
  padding: 0 15px;
  border-radius:20px;
  flex: 1;
  height: 40px; 
}

.note-searchbar-core{
  border: 0;
  background-color: #EEEEEE;
  margin-left:5px; 
  outline: 0;
  width:100%;
}

.search-icon{
  width: 15px;
  height: 15px;
}

.close-icon{
  width: 20px;
  height: 17px;
  margin:0 15px 0 0;  
}

.history-text{
  margin-top:20px;
  font-size: 20px;
  color: #666;  
  padding:0 20px;
}

.history{
  display: flex;
  flex-wrap: wrap;
}

.history-cell{
  margin-top:20px;  
}

.history-item{
  background-color: #F3F3F3;
  margin-right:20px;
  color: #666;
  font-size: 16px;
  padding: 5px 20px;
  border-radius:4px;
   
}
.noResult{
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
.pickerAll{
    position:fixed;
    left:0px;
    right:0px;
    bottom:0px;
    background-color:#fff;
    z-index:2021;
    padding-bottom:20px;
    ul{
      display:block;
      overflow:hidden;
      li{
        display: inline-block;
          width: 50%;
          text-align: center;
          line-height: 1.066667rem;
          font-size: 0.426667rem;
          color: #26a2ff;
      }
      .cancel{
        float:left;
      }
      .done{
        float:right;
      }
    }
  }
  .mock{
    position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      background: #000;
      z-index:2020;
  }
.picker-enter-active {
    animation: bounce-in .5s ease;
}
.picker-leave-active{
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    bottom:-200px;
  }
  100% {
    bottom:0px;
  }
}



</style>