<template>
    <div class="tab">
        <div v-for="(item,index) in items"
             :key="index"
             :class="['tab-item',{'tab-active':tabIndex === index}]"
             @click="changeTab(item,index)">
            <span>{{ item.name }}</span>
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
        initTabIndex: {
            type: Number,
            default() {
                return 0
            }
        }
    },
    data() {
        return {
            tabIndex: 0
        }
    },
    watch: {
        initTabIndex(val) {
            this.$set(this, 'tabIndex', val)
        }
    },
    methods: {
        changeTab(item, index) {
            this.$set(this, 'tabIndex', index)
            this.$emit('changeTabHandler', index, item)
        }
    }
}
</script>

<style lang="less">
.tab {
    width: 100%;
    display: flex;
    background-color: #fff;
    color: #999;
    .tab-item {
        flex: 1;
        text-align: center;
        line-height: 42px;
        font-size: 25px;
        &.tab-active {
            color: #030303;
            position: relative;
            ::before {
                clear: both;
                content: '';
                position: absolute;
                left: 41%;
                bottom: 0;
                height: 4px;
                width: 18%;
                background-color: #12a4ff;
            }
        }
    }
}
</style>
