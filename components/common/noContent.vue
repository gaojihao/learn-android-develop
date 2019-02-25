<template>
  <div class="no_content">
    <img :src="content.src">
    <p class="message-title">{{content.message}}</p>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: ['content']
  }
</script>

<style lang="scss" scoped>
   .no_content{
     text-align: center;
      img{
        width: 70%;
      }
     .message-title{
        font-size: 14px;
        margin-top: 20px;
     }
   }
</style>
