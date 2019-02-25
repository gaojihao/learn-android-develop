import Vue from 'vue'

export default {
    async getLifePayment(params) {
        return Vue.axios.get('/activity/v1/discount/ismpc', {
            pucid:1000
        });
    }
}
