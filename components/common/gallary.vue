<template>
    <div class="container" @click="handleGallaryClick">
        <div class="wrapper">
            <swiper :options="swiperOptions">
                <swiper-slide v-for="(item,index) in imgs" :key="index">
                    <img class="gallary-img" :src="item">
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>        
        </div>
    </div>
</template>
<script>
export default {
    name: 'Gallary',
    props:{
        imgs:{
            type: Array,
            default () {
                return []
            }
        },
        activeIndex: {
            type: Number,
        }
    },
    data () {
        return {
            swiperOptions: {
                pagination: '.swiper-pagination',
                paginationType: 'fraction',
                observer:true,     //dom自我刷新一次
                observeParents:true, //解决轮播卡顿问题
                loop:true,
                initialSlide: this.activeIndex //默认第几张开始播放
            },

            defaultImage: 'this.src="' + require('~/assets/images/default-img_x2.png') + '"'
        }
    },
    methods:{
        handleGallaryClick () {
            this.$emit('close')
        }
    }
}
</script>
<style lang="less" scoped>
.container .swiper-container{
    overflow: inherit;

}
.container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;    
    z-index: 89;
    padding: 0;
    margin: 0;
}
.container .wrapper{    
    width: 100%;
    //height: 0;
    //padding-bottom: 100%;//撑出中间展示正方形的样式     
}
.container .wrapper .gallary-img{
    width: 100%;
}
.container .wrapper .swiper-pagination{
    color:#fff;
    bottom: 0;
    left: 0;
    position: fixed;
    text-align: left;
    padding: 5px 10px;

    background: rgba(0,0,0, 0.4);
    width: auto;
    margin-bottom: 5px;
    margin-left:5px;
    border-radius: 5px;
}
</style>
<style lang="scss">
    .swiper-container {
        .swiper-wrapper {
            align-items: center;
        }
        .swiper-slide{
            text-align: center;
        }
    }

</style>
