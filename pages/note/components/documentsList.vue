<template>
  <ul class='list_container' >
    <li class='list_item_bg'  v-for="item in documents" @click="documentClicked(item)">

       <!-- <img class="item_icon_img" src="../../../assets/images/note/detail/document_pdf@2x.png" alt="document icon" > -->

       <img class="item_icon_img" :src="fileIconByFileName(item.attachment_url)" alt="document icon" >

       <div class='item_name_para'>
          {{item.attachment_name}}
       </div>
       <div class='item_download_btn'>
          下载
       </div>

    </li>
  </ul>
</template>

<script>


//JavaScript根据文件名判断文件类型
// var imgExt = new Array(".png",".jpg",".jpeg",".bmp",".gif");//图片文件的后缀名
var docExt = new Array(".doc",".docx");//word文件的后缀名
var pdfExt = new Array(".pdf");//pdf文件的后缀名
var xlsExt = new Array(".xls",".xlsx");//excel文件的后缀名
var pptExt = new Array(".ppt");//ppt文件的后缀名
// var cssExt = new Array(".css");//css文件的后缀名
// var jsExt = new Array(".js");//js文件的后缀名

//获取文件名后缀名
String.prototype.extension = function(){
    var ext = null;
    var name = this.toLowerCase();
    var i = name.lastIndexOf(".");
    if(i > -1){
    var ext = name.substring(i);
    }
    return ext;
}

//判断Array中是否包含某个值
Array.prototype.contain = function(obj){
    for(var i=0; i<this.length; i++){
        if(this[i] === obj)
            return true;
    }
    return false;
};

String.prototype.extMatch = function(extType){
    if(extType.contain(this.extension()))
        return true;
    else
        return false;
}



export default {
    name: 'documentsList',
    props:['documents'],
    methods:{
      documentClicked(item){

        console.log("documentClicked+", item.attachment_url)

        // //todo
        // let aTag = document.createElement('a');
        // let blob = new Blob([item.attachment_url]);　　// 这个content是下载的文件内容，自己修改
        // aTag.download = item.attachment_name;　　　　　　// 下载的文件名
        // aTag.href = URL.createObjectURL(blob);
        // aTag.click();　　　　　　　　　　　　　　
        // URL.revokeObjectURL(blob);

        //this.$showPDF(item.attachment_url)

        //this.$router.push({path:'/note/PdfViewer', query:{attachmentUrl: item.attachment_url}})

        //window.document.location.href = "http://view.officeapps.live.com/op/view.aspx?src=" + item.attachment_url

        location.href = item.attachment_url

    },
    fileIconByFileName(fileName){
       console.log("fileIconByFileName function")
      if( fileName.extMatch(pdfExt) ){
        console.log("pdf type")
        return require("../../../assets/images/note/detail/document_pdf@2x.png")
      }
      else if( fileName.extMatch(docExt) )
      {
        console.log("doc type")
        return require("../../../assets/images/note/detail/document_word@2x.png")
      }
      else if( fileName.extMatch( xlsExt ) ) {
        return require("../../../assets/images/note/detail/document_excel@2x.png")
      }
      else if( fileName.extMatch( pptExt ) ) {
        return require("../../../assets/images/note/detail/document_ppt@2x.png")
      }
      else {
        return require("../../../assets/images/note/detail/document_pdf@2x.png")
      }
      console.log("unexpected end")
    }
}
}
</script>


<style scoped>

.list_container
{
  display:flex;
  flex-direction: column;
}

.list_item_bg
{
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 70.5px;

  border-radius: 10px;
  background-color: white;
  margin: 13.5px;
  box-shadow: 0px 0px 10px 5px #f4f4f4;
}

.item_icon_img
{
  width:39px;
  height: 40px;
  margin-left: 10px;
}

.item_name_para
{
  margin-left: 10px;
  font-size: 14px;
  color:#2d2d2d;

  flex:1;
}

.item_download_btn
{
  border-radius: 5px;

  border-style:solid;
  border-color: #119dff;
  border-width: 1px;
  color: #119dff;

  padding: 5px 10px 5px 10px;
  margin-right: 10px;
}


</style>
