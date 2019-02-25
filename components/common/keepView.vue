<template>
  <div>
    <div class="rating_page" :name="this.name" :style="this.name == this.$route.name? '': 'visibility:hidden;transform: translate3d(-10000px, 0, 0);position: absolute;'">
      <slot v-if="isRenderView"></slot>
    </div>
    <nuxt v-if="childrenView"></nuxt>
  </div>
</template>
<script>

import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'keep-view',
    props: {
        name: {
            type: String,
        },
        childrenView: {
            type: Boolean,
            default: function () {
                return true
            }
        }
    },
    
    watch: {
      $route(newRoute) {
          this.setRenderView();
          if(this.name === this.$route.name){
            this.$nextTick(function () {
                newRoute.meta.keepView = true;
                global.$nuxt.$emit('triggerScroll');    
            })
          }      
      }
    },

    data () {
        return {
            isRenderView: false,
        }
    },

    mounted(){
        this.setRenderView();
    },

    methods: {


        // 当从children route直接访问过来的时候，先不显示parent route，这样不会渲染parent route.
        // 当只有route相等的时候才开始渲染该route, 并且这个过程不可逆，即当isRenderView设置为true，就不会再变成false;
        setRenderView: function () {
            if(!this.isRenderView){
                //console.log('router: ' + this.$route.name + ';name: ' + this.name);
                if(this.name === this.$route.name){
                    this.isRenderView = true;
                }
            }
        }
    }
}
</script>