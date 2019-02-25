<template>
    <div>
        消息详情 id:{{ this.$route.params.id }}
    </div>
</template>

<script>
export default {
    mounted() {
        console.log(this.$route.params.id)
    }
}
</script>
