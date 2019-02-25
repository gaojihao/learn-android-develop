<template>
  <div :class="(this.name ? '': 'single_line') + (this.shrinkHeader || this.isShrink ? ' shrink_header': '') ">
    <header class="header" :class="[this.backgroundColor ? 'fff' : '' ]">
      <div class="header-nav">
        <a href="javascript:" @click="go()" class="header_back"></a>
      </div>
      <div class="header-title" v-if="this.name">
        <span class="header-text">{{this.name}}</span>
        <span class="header-action"><slot name="action"></slot></span>
      </div>
    </header>
    <div class="header-upholder"></div>
  </div>
</template>
<script>
    import { Popup, Toast } from 'mint-ui';
export default {
    props: {
        name: {
            type: String,
        },
        backgroundColor: {
            type: String
        },
        canShrink: {
            type: Boolean,
            default: function () {
                return true
            }
        },
        isShrink: {
            type: Boolean,
            default: function () {
                return false
            }
        }
    },


    data () {
        return {
            shrinkHeader: false,
        }
    },
    mounted(){
        if(this.canShrink){
            global.addEventListener('scroll', this.handleScroll);
        }

    },

    methods: {
      go () {
        this.$router.go(-1)
      },

      handleScroll: function () {
          if(!this.isShrink){
              let scrollTop = global.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

              //Toast("scrollTop:" + scrollTop)
              if( scrollTop > 140){
                  this.shrinkHeader = true;
              }else if(scrollTop < 40){
                  this.shrinkHeader = false;
              }
          }
      }
  }
}
</script>
<style lang="scss" scoped>
@import '~static/css/style.sass';


header{
  width: 100%;
  height: 104px;
  text-align: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 88;
  background: #fff;
  padding-top: 5px;
  span{
    font-size: 16px;
    line-height: 38px;
    height: 40px;
  }
  .header_back{
    width: 18px;
    height: 16px;
    background: url('~assets/images/icon_back.png') no-repeat 0 0;
    background-size: 18px 16px;
    display: block;
    margin: 10px 0 10px 20px;
  }
  .header-title{
    color: #000;
    font-size: 24px;
    text-align: left;
    padding: 10px 20px;
    display: flex;
    /*overflow: hidden;*/
    .header-text{
      font-size: 30px;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* 限制在一个块元素显示的文本的行数 */
      -webkit-box-orient: vertical; /* 垂直排列 */
      overflow: hidden;
    }
    .header-action{
      display: inline-block;
      flex: 1;
      text-align: right;
    }
    .header-action:after{
      clear: both;
    }
  }
}

.header-upholder{
  margin-top: 104px;
}
.single_line,
.shrink_header{
  header{
    height: 44px;
    border-bottom: 1px solid #e7e7e7;
  }
  .header-upholder{
    margin-top: 44px;
  }
}
.shrink_header{
  header{
    box-shadow: 0 -4px 10px rgba(152,152,152, 0.28);
    transition: height .1s ease-in-out;

    .header-nav{
      position: absolute;
    }
    .header-title{
      text-align: center;
      padding: 0 10px;
      display: block;
      font-size: 20px;
      .header-text{
        font-size: 20px;
        padding: 0 40px;
        display: inline-block;
      }
      .header-action{
        float: right;
        padding-right: 10px;
      }
    }
  }
}



</style>
