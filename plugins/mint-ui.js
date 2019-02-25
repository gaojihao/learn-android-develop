import Vue from 'vue'
import Mint from 'mint-ui'

Vue.use(Mint, {
    lazyload: {
        preLoad: 1.3,
        error: '', //require('~/assets/images/default-img_x2.png'),
        loading: '', //require('~/assets/images/default-img_x2.png'),
        attempt: 10,
    },
});