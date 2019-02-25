<template>
  <div>


  </div>
</template>

<script>

import Vue from 'vue'
import pdf from '../../plugins/pdf'
Vue.use(pdf)

export default {
    name: 'files',
    // props:{
    //   attachmentUrl:String,
    // },
    data () {
      return {
        attachmentUrl:'',
      }
    },
    created(){
      this.attachmentUrl = this.$route.query.attachmentUrl;
      console.log('param attachmentUrl = ' + this.attachmentUrl)

      // console.log("attachmentUrl = ", this.attachmentUrl)

      this.$showPDF(this.attachmentUrl)

      //this.$showPDF('/media/pucrc/download?fileName=7937F508A30C43BC8ECB4119DD28684F.pdf')

    },
    beforeDestroy(){
      // this.$hidePDF()
      // console.log("PDF is destroyed")
    },

    methods:{

    //   documentClicked(item){
    //     console.log("documentClicked+", this.attachmentUrl)
    //
    //     // //todo
    //     // let aTag = document.createElement('a');
    //     // let blob = new Blob([item.attachment_url]);　　// 这个content是下载的文件内容，自己修改
    //     // aTag.download = item.attachment_name;　　　　　　// 下载的文件名
    //     // aTag.href = URL.createObjectURL(blob);
    //     // aTag.click();　　　　　　　　　　　　　　
    //     // URL.revokeObjectURL(blob);
    //
    //     this.$showPDF(item.attachment_url)
    // },
  }
}

</script>


<style scoped>

</style>
