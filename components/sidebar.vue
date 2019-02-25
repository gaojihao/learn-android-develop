<template>
    <div class="sidebar">
        <div v-for="(item,index) in items"
             :key="index"
             :class="['sidebar-item',{'sidebar-active':sidebarIndex === index}]"
             @click="changeSidebar(item,index)">
            <span>{{ item.tagDesc }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default() {
                return []
            }
        },
        initSidebarIndex: {
            type: Number,
            default() {
                return 0
            }
        }
    },
    data() {
        return {
            sidebarIndex: 0
        }
    },
    watch: {
        initSidebarIndex(val) {
            this.$set(this, 'sidebarIndex', val)
        }
    },
    methods: {
        changeSidebar(item, index) {
            this.$set(this, 'sidebarIndex', index)
            this.$emit('changeSidebarHandler', index, item)
        }
    }
}
</script>

<style lang="less">
.sidebar {
    width: 104px;
    display: flex;
    flex-direction: column;
    background-color: #f2f2f2;
    color: #333;
    position: absolute;
    z-index: 998;
    top: 0px;
    bottom: 0px;
    left: 0px;
    overflow: scroll;
    .sidebar-item {
        text-align: center;
        line-height: 65px;
        font-size: 18px;
        &.sidebar-active {
            color: #030303;
            background-color: #fff;
        }
    }
}
</style>
