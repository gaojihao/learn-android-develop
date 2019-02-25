<template>
    <div>
        <div class="list">
            <ul class="list-li ">
                <li class="border-bottom">我的发布<nuxt-link to="/personal/personalrelease"><span class="iconfont list-icon">&#xe601;</span></nuxt-link></li>
                <li class="border-bottom">我的收藏<span class="iconfont list-icon">&#xe601;</span></li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name:'PersonalList'
}
</script>
<style lang="less" scoped>
.list{
    overflow: hidden;
    width: 100%;
    font-size:18px;
    background:#f2f2f2;
    padding: 10px 0;
}
.list-li li{
    width: 100%;
    height: 72px;
    line-height: 72px;
    text-indent: 12px;
    font-weight: normal; 
    background:#fff;   
}
.list-icon{
    float:right;
    margin-right: 12px;
    font-size: 18px;
}
</style>
