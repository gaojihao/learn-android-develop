<template>
    <div class="blank">
        <div class="image" />
        <p class="desc">{{ desc }}</p>
    </div>
</template>

<script>
export default {
    props: {
        desc: {
            type: String,
            default: () => ''
        }
    }
}
</script>

<style lang="less">
.blank {
    text-align: center;

    .image {
        width: 250px;
        height: 180px;
        margin: 120px auto 0 auto;
        background-repeat: no-repeat;
        background-size: contain;
    }

    .desc {
        font-size: 15px;
        color: #999;
    }
}
</style>
