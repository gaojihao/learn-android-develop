<template>
<div>   
    <header-top :name="this.name"></header-top>  
    <div class="detail">         
         <ul class="detail-info ">
            <li><span class="left-text">我的头像</span>
                <span class="right-text">
                    <div  class="detail-img" @click="sheetVisible = true">
                        <img src="~assets/images/touxiang.png"/>
                    </div>
                    <span class="iconfont">&#xe601;</span>
                </span></li>
            <li><span class="left-text">昵称</span>
                <span class="right-text" @click="handleModifyName">
                    李艾<span class="iconfont">&#xe601;</span>
                </span>
            </li>
            <li><span class="left-text">性别</span><span class="right-text">女</span></li>
       </ul>           
        <ul class="detail-zy">
            <li><span class="left-text">专业</span><span class="right-text">计算机专业</span></li>
            <li class="clear-border"><span class="left-text">入学年份</span><span class="right-text">2012年</span></li> 
        </ul> 
        <mt-actionsheet cancel-text="取消" :actions="actions" v-model="sheetVisible"></mt-actionsheet>       
    </div>
</div>
</template>
<script>
import HeaderTop from '~/components/common/header.vue'

import { Toast, MessageBox } from 'mint-ui'

export default {
   name:'PersonalDetail',
   components:{
       HeaderTop, 
   },
   data () {
        return {
            name: '李艾个人主页',           
            sheetVisible: false,
            actions: [
                {
                    name: '拍照',
                    method: this.showToast
                }, {
                    name: '从手机相册选择',
                    method: this.showMsgbox
                }
            ]
        }
   },
   methods: {
      showToast() {
        Toast('这是一个 Toast');
      }, 
      showMsgbox() {
        MessageBox('提示', '这是一个 Message Box');
      },
      handleModifyName (){
        MessageBox.prompt('请输入昵称').then(({ value, action }) => {
            console.log(value)
            console.log(action)
        })
      }


   }
}
</script>
<style lang="less" scoped>
.left-text{
    float:left;
    margin-left:17px;
}
.right-text{
    float:right;
    margin-right:17px;
    color:#999999;
}
.detail-img{
    overflow: hidden;
    width: 50px;
    height: 50px;
    line-height: 48px;
    text-align: center;
    border-radius: 50%;
    margin-top:10px;
}
.detail-img img{
    width: 50px;
    height: 50px;
  
}
.detail{
    overflow: hidden;
    width:100%;
    font-size:16px;
}
.detail-info{
    border-top:1px solid #e0e0e0;
}
.detail li{
    overflow: hidden;
    width: 100%;
    height: 70px;
    background: #fff;
    line-height: 70px;
    border-bottom: 0.5px solid #e0e0e0;
}
.detail-zy{
    background: #f2f2f2;
    padding: 10px 0;
}
.detail-zy .clear-border{
    border: none;
}
</style>
