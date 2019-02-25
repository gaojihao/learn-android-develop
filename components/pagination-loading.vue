<template>
  <div>
      <div class="ws-pagination-loading" v-if="!paginationLoading.allLoaded && !paginationLoading.error && paginationLoading.loading">
          <slot name="loading">正在努力加载...</slot>
      </div>
      <div class="ws-pagination-loaded" v-if="paginationLoading.allLoaded">
          <slot name="loaded">已经到底了...</slot>
      </div>
      <div class="ws-pagination-error" v-if="paginationLoading.error">
          <slot name="error">加载失败...</slot>
      </div>
  </div>
</template>
<script>

import utils from '~/utils/utils'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'pagination-loading',
    components: {
    },

    props: {

    },
    watch:{

    },
    computed: {
        ...mapGetters({
            paginationLoading: 'common/paginationLoading',
        }),
    },

    data() {
        return {
            show: false,
        }
    },

    async mounted(){
    },

    methods: {

    }
}
</script>
<style lang="scss">
    .ws-pagination-loading,
    .ws-pagination-loaded,
    .ws-pagination-error{
        text-align: center;
        padding: 10px 0;
        font-size: 12px;
        background: rgba(236,236,236, 0.8)
    }

</style>
