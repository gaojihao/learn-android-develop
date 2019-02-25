<template>
  <div class="hello">
    <h1>{{ msg2 }}</h1>
    <h1>{{ lifePayment.name }}</h1>
    <mt-cell title="标题文字" icon="more" value="带 icon"></mt-cell>
    <mt-button type="primary" @click="fetch">fetch</mt-button>
    <mt-button type="primary" @click="onNotesClick">笔记</mt-button>
    <mt-button type="primary" @click="noteDetail">笔记详情</mt-button>
    <mt-button type="primary" @click="allComment">全部评论</mt-button>
    <mt-button type="primary" @click="toLearnGroup">圈子</mt-button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { modulePlugin } from '@/utils/utils'
import { MessageBox, Toast } from 'mint-ui'
import api from '@/api'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg2: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
      ...mapGetters({
          lifePayment: 'helloWorld/lifePayment'
      }),
  },
  created () {
    
  },
  methods: {
    ...mapActions({
        getLifePayment: 'helloWorld/getLifePayment'
    }),
    async fetch() {
      this.getLifePayment();
    },
    onNotesClick(){
      this.$router.push('notes')
    },

    noteDetail(){
      this.$router.push('noteDetail')
    },

    allComment(){
      this.$router.push('comments')
    },
    toLearnGroup(){
      this.$router.push('/group')
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.hello {
  width: 375px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 5px;
}
a {
  color: #42b983;
}
</style>
