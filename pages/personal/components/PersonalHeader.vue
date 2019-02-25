<template>
<div >
    <div class="header"> 
        <nuxt-link to="/personal/personaldetail"><span class="iconfont header-icon">&#xe601;</span></nuxt-link>     
        <div class="header-tou">
            <div class="head-img">
                <img class="head-img-content" src="~assets/images/touxiang.png" >
            </div>
            <div class="head-info">
                <p class="face-info">{{personalInfo.name}} <span class="face"><span class="iconfont">&#xe68d;</span> {{personalInfo.age}}</span></p>
                <p class="face-txt">15级-美术专业</p>
            </div>    
        </div>        
    </div>
</div>
</template>
<script>
export default {
    name:'PersonalHeader',
    props:{
        personalInfo:Object
    }
}
</script>
<style lang="less" scoped>
.header{
    width: 100%;
    height: 210px;
    position: relative;   
}
.header-icon{
    position: absolute;
    top:98px;
    right:12px;
    font-size: 16px;
}
.header-tou{    
    overflow: hidden;
    width:100%;
    height: 210px;
    text-align: center;    
}
.head-img{
    box-sizing: border-box;
    width:100%;
    text-align: center;  
}
.head-img-content{
    width:124px;
    height:124px;
    border-radius: 50%;     
}

.head-info p{   
    width:100%;  
    height: 40px;
    line-height: 40px;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align:center; 
}
.face-info{
    font-size:16px;
}
.face-txt{
    font-size: 14px;
    color:#bdbdbd;
}
.face{ 
    background:#12a4ff;
    color:#fff;     
    border-radius:5px;
    padding: 0 8px;
}
</style>
