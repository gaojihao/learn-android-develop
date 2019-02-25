import Vue from 'vue'

export default {
    async getItems() {
        console.log('api/demo/getItems')
        return Vue.axios.get('/demo/items');
    }
}
