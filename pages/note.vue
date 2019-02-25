<template>
    <keep-view name="note">
        <header-top :name="this.name" ></header-top>
        
        <div class="note-searchbar">
            <div class="note-searchbar-inner">
                <input 
                type="inputType" 
                ref="searchInput" 
                @change='search($event)' 
                @keyup='search($event)'
                placeholder="搜索课程名称" 
                class="note-searchbar-core">
                <img src="../assets/images/search_word.png" alt="" class="search-icon">
            </div>
            <span class="chooseActive" @click="allNotes">全部笔记</span>
        </div>

        <div class="category sort_list">
            <div class="sort_item">
                <div class="sort_item_container" @click="chooseType(0)">
                    <span v-bind:class="sortField===0? 'chooseActive':''">最新</span>
                </div>
            </div>
            <div class="sort_item">
                <div class="sort_item_container" @click="chooseType(1)">
                    <span v-bind:class="sortField===1? 'chooseActive':''">阅读量</span>
                </div>
            </div>
            <div class="sort_item">
                <div class="sort_item_container" @click="chooseType(2)">
                    <span v-bind:class="sortField===2? 'chooseActive':''">点赞量</span>
                </div>
            </div>
        </div>

    <section class="note-section">
        <mt-loadmore
        :auto-fill="false"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        ref="loadmore">
        <ul>
            <li class="note_item" v-for="(item,index) in noteList" :key='index'>
                <div class="note_container" @click="gotoArticalDetail(item)">
                    <div v-bind:class="[index === 0 ? 'mark_1' : (index === 1 ? 'mark_2':(index === 2 ? 'mark_3':'')), 'mark']">
                        <span class="num">{{index+1}}</span>
                        <div class="jiahao"></div>
                    </div>
                    <div class="note_cell_container">
                        <img :src=item.pic.name class="note_cell_container_img">
                        <div class="note_info">
                            <h3>{{item.title}}</h3>
                            <div class="note_auther_date">
                                <span>{{courseCombination(item)}}</span>
                                <span class="item-data">{{dateformatTime(item.publishTime)}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="note_cell_bottom">
                        <div class="smallItem">
                            <img  v-if="item.isCollect" class="smallImg" src="../assets/images/star_hightlight.png">
                            <img v-else class="smallImg" src="../assets/images/star.png" >
                            <span class="smallText" v-bind:class="{starActive:item.isCollect}">{{item.collectNum}}人</span>
                        </div>
                        <div class="smallItem middleItem">
                            <img v-if="item.likeStatus" class="smallImg" src="../assets/images/zan_highlight.png" >
                            <img v-else class="smallImg" src="../assets/images/zan.png">
                            <span class="smallText" v-bind:class="{zanActive:item.likeStatus}">{{item.likeTotal}}人</span>
                        </div>
                        <div class="smallItem">
                            <img class="readImg" src="../assets/images/read.png" alt="">
                            <span class="smallText">{{item.readTotal}}人</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        </mt-loadmore>
        <no-content :content="content" v-if="(!noteList || !noteList.length) && loaded">
        </no-content>
    </section>
    <router-view></router-view>
  </keep-view>
</template>

<script>
import headerTop from "~/components/common/header.vue";
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import { Loadmore, InfiniteScroll, Toast, Indicator } from "mint-ui";
import api from "@/api";
import keepView from "~/components/common/keepView.vue";
import formatter from "~/utils/formatter";
import noContent from "~/components/common/noContent.vue";
import bus from "@/utils/eventbus";
import Share from '@/utils/share'

export default {
  name: "notes",

  components: {
    headerTop,
    Loadmore,
    keepView,
    noContent
  },
  data() {
    return {
      name: "课程笔记",
      pageIndex: 1,
      allLoaded: false,
      isInSearch: false,
      loaded: false,
      sortField: 0,
      noteList: [],
      backupNotes: [],
      content: {
        message: "还没有笔记，一会儿再来看看吧~",
        src: require("../assets/images/no_note.png")
      }
    };
  },
  computed: {
    ...mapGetters({
      uid: "common/uid"
    })
  },

  created() {
    Share({
      title: '优秀课程笔记分享站',
      desc: '不动笔墨不读书。优秀的课程笔记能让你事半功倍。那么，你的笔记做对了吗？'
    })

    this.getNoteList(false);
  },

  mounted() {
    let _self = this;
    bus.$on("userInteraction", function(data) {
      let index = 0;
      let tempArray = _self.noteList;

      for (let i = 0; i < tempArray.length; i++) {
        const value = tempArray[i];
        if (value.feedId === data.blogId) {
          index = i;
          break;
        }
      }
      let temp = tempArray[index];
      temp["collectNum"] = data.favNum;
      temp["isCollect"] = data.isFav;
      temp["likeStatus"] = data.isZan;
      temp["likeTotal"] = data.zanNum;

      tempArray[index] = temp;
      _self.noteList = tempArray;
    });
  },

  methods: {
    async getNoteList(isLoadMore) {
      Indicator.open("加载中...");
      let params = {
        types: "1",
        isContentSearch: "Y",
        showMyCollect: this.uid,
        showMyLiked: this.uid,
        page: this.pageIndex,
        size: 10
      };

      if (this.sortField > 0) {
        params["sortField"] = this.sortField; //1-阅读, 2-点赞, 0-最新
      }

      await api.note
        .getNoteList(params)
        .then(res => {
          this.loaded = true;
          Indicator.close();
          if (res.status === 200) {
            this.allLoaded = !res.data.isMore;
            this.pageIndex = this.pageIndex + 1;
            this.loaded = true;

            if (isLoadMore) {
              this.noteList = this.noteList.concat(res.data.feeds);
              this.$refs.loadmore.onBottomLoaded();
              this.backupNotes = this.noteList.concat();
            } else {
              this.noteList = res.data.feeds;

              this.backupNotes = this.noteList.concat();
            }
          }
        })
        .catch(err => {
          this.loaded = true;
          Indicator.close();
        });
    },

    //日期格式化
    dateformatTime(timestamp) {
      var date = new Date(timestamp - 0);
      return formatter.formatTime(date, "YYYY-MM-DD");
    },

    courseCombination(item) {
      const nickName = item.author.nickName.length > 0? item.author.nickName:'匿名'
      return `作者:${nickName} | ${item.course}`;
    },

    allNotes() {
      this.$refs.searchInput.value = "";
      this.isInSearch = false;
      this.allLoaded = false;
      
      this.pageIndex = 1;
      this.getNoteList(false);
    },

    async search(e) {
      let searchValue = this.$refs.searchInput.value;
      this.isInSearch = true;
      this.allLoaded = true;

      let params = {
        types: "1",
        isContentSearch: "Y",
        page: 1,
        size: 10000,
        courseName: searchValue
      };

      if (this.sortField > 0) {
        params["sortField"] = this.sortField; //1-阅读, 2-点赞, 0-最新
      }

      const ret = await api.note.getNoteList(params);

      if (ret.status === 200) {
        this.noteList = ret.data.feeds;
      }
    },

    async chooseType(type) {
      if (this.sortField !== type) {
        this.sortField = type;
        this.pageIndex = 1;
        this.isInSearch === false? this.getNoteList(false):this.search();
      } else {
        // this.sortField = 0;
      }
    },

    async gotoArticalDetail(item) {
      this.$router.push({
        path: "/note/ArticalDetail",
        query: { noteId: item.feedId }
      });
    },

    loadBottom() {
      this.getNoteList(true);
    }
  }
};
</script>

<style lang="scss" scoped>

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  color: #333;
  font-size: 19px;
  margin: 20px 0;
}

h3 {
  color: #000;
  font-size: 15px;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.searchicon {
  height: 20px;
  width: 20px;
}

.category {
  display: flex;
  font-size: 16px;
  padding: 0 20px;
  color: #333;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.sort_list {
  width: 100%;
  z-index: 999;
  background-color: #fff;
  height: 40px;
}
.sort_item {
  background-color: white;
  height: 100%;
  flex: 1;
}

.sort_item_container {
  flex: 1;
  display: flex;
  width: 100%;
  align-items: center;
  height: 100%;
}

.chooseActive {
  color: #0099fe;
}

.note-section {
    position: absolute;
    left:0;
    top:0;
    width: 100%;
    height:72%;
    overflow: auto;
    margin-top: 5.2rem;
    -webkit-overflow-scrolling: touch;
}

.note_item {
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  background-color: white;
}
.item-data {
  font-size: 13px;
}
.mark {
  position: absolute;
  top: 0;
  right: 15px;
  width: 22px;
  height: 30px;
  background-color: #bdbebe;
  display: flex;
  justify-content: center;
  align-content: center;
}

.mark_1 {
  background-color: #fc8327;
}

.mark_2 {
  background-color: #facd44;
}

.mark_3 {
  background-color: #48aefb;
}

.num {
  color: white;
  font-size: 10px;
  align-self: center;
  margin-bottom: 5px;
}

.jiahao {
  position: absolute;
  height: 0px;
  width: 0px;
  left: 0;
  bottom: -1px;
  border-left: 11px solid transparent;
  border-right: 11px solid transparent;
  border-bottom: 6px solid white;
}

.note_container {
  border-radius: 5px;
  background-color: white;
  box-shadow: 0px 4px 20px 0px rgba(200, 200, 200, 0.48);
  position: relative;
}

.note_cell_container {
  padding: 20px 10px;
  display: flex;
  flex-direction: row;
  border-bottom: 0.5px solid #fafafa;
}
.note_cell_container .note_cell_container_img {
  width: 60px;
  height: 60px;
  border-radius: 5px;
}

.note_category {
  width: 50px;
  height: 50px;
}

.head {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}

.note_info {
  margin-left: 7px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.note_auther_date {
  display: flex;
  margin-top: 4px;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 12px;
}

.note_cell_bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 0;
  align-items: center;
}

.smallItem {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.middleItem {
  border-left: 0.5px solid #eee;
  border-right: 0.5px solid #eee;
}

.smallImg {
  width: 16px;
  height: 16px;
}

.readImg {
  width: 16px;
  height: 13px;
}

.smallText {
  margin-left: 4px;
  font-size: 10px;
  color: #999;
}

.starActive {
  color: #48aefb;
}

.zanActive {
  color: #fc8327;
}

.note-searchbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 10px;

  span {
    font-size: 16px;
    padding-left: 10px;
  }
}

.note-searchbar-inner {
  -webkit-box-align: center;
  align-items: center;
  background-color: #efefef;
  display: flex;
  font-size: 16px;
  padding: 0 15px;
  border-radius: 4px;
  flex: 1;
  height: 40px;
}

.note-searchbar-core {
  border: 0;
  background-color: #efefef;
  margin-left: 5px;
  outline: 0;
  width: 100%;
}

.search-icon {
  width: 15px;
  height: 15px;
}
</style>
