<template>
  <div class="container">
    <div class="note-search">
      <div class="note-searchbar">
        <img src="../../assets/images/icon_back.png" alt="" class="close-icon" @click="onClose">
        <div class="note-searchbar-inner">
          <img src="../../assets/images/search_word.png" alt="" class="search-icon">
          <input 
          type="search" 
          ref="searchInput" 
          @change='search($event)' 
          @keyup='search($event)'
          @blur='onBlur($event)'
          placeholder="搜索笔记" 
          class="note-searchbar-core">
        </div>
        
      </div>
    </div>
    <section v-if='searchHistoryShow' class="history-text">
      <h2>历史搜索</h2>
      <ul class="history">
        <li 
        @click='addSearch($event)' 
        v-for="history in records" 
        class="history-cell">
          <span class="history-item">{{history}}</span>
        </li>
      </ul>
    </section>
    <section v-if='!searchHistoryShow'>
      <ul class="searchGroup" v-show='!noResult'>
        <li v-for="(item,index) in resultList" :key="index" @click="gotoArticalDetail(item)">
          <span>{{item.title}}</span>
        </li>
      </ul>
    <div v-show='noResult&&!searchHistoryShow' class="noResult">
      <img :src="noResultPic">
      <h1>搜索的词太高冷换个词试试吧~</h1>
    </div>
    </section>
  </div>
</template>


<script>

import Vue from 'vue'
import storage from '@/utils/storage'
import api from '@/api'

export default {
    name: 'noteSearch',
    data() {
        return {
            searchHistoryShow:true,
            resultList:[],
            noResult:false,
            noResultPic:require('../../assets/images/search_2.png'),
            };
    },
    computed:{
      records: function () {
            return storage.getSearchHistory('noteSearchHistory') || [];
      },
    },

    methods:{
      onClose(){
        this.$router.back()
      },

      search(e){
        let searchValue = this.$refs.searchInput.value
        if (searchValue != ''){
          this.searchHistoryShow = false
          this.searchWord(searchValue)
        }else{
          this.searchHistoryShow = true
          //this.records = storage.getSearchHistory('searchHistory')
        }
      },

      async searchWord(word){

            let params = {types:'1',isContentSearch:'Y',page:1,size:10000,keyword:word}

            const ret = await api.note.getNoteList(params)
            console.log(ret)

            if(ret.status === 200){
              this.resultList = ret.data.feeds
            }

            this.noResult = this.resultList.length == 0?true:false

      },

      onBlur(e){
        let val = e.currentTarget.value
        storage.setSearchHistory('noteSearchHistory',val) 
      },

      addSearch(e){
        let val = e.currentTarget.firstChild.innerHTML
        this.$refs.searchInput.value = val
        console.log(val)
        this.search()
      },
      async gotoArticalDetail(item){
            this.$router.push({path:'/note/ArticalDetail', query:{noteId: item.feedId}})
        },

    },
}

</script>

<style lang="less" scoped>

.container{
    background-color: white;
    padding: 10px;
}

.note-searchbar{
  display: flex;
  justify-content:space-between;
  align-items: center;
  margin-top:20px; 
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
  margin-right:10px;
  color: #666;
  font-size: 16px;
  padding: 5px 20px;
  border-radius:4px;
   
}

.searchGroup{
  margin-top:20px; 

  li{
    height: 44px;
    border-bottom: #F3F3F3 solid 1px;
    justify-content: center;
    display: flex;
    flex-direction: column;

    span{
      font-size: 14px;
      color: #333;
    }
  }
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



</style>