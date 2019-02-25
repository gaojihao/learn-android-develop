import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import utils from '../utils'
import {storageKeys} from '../utils/config'
import eventbus from '@/utils/eventbus'

import {
    Toast
} from 'mint-ui';

export default ({
    app,
    store
}) => {
    let options = {}
    let config = require(`../config/index`)
    options.baseURL = config.baseUrl;
    console.log('baseUrl', options.baseURL)

    const customAxios = axios.create(options);
    customAxios.defaults.timeout = 10000
    customAxios.defaults.headers.common['Cache-Control'] = 'no-cache'
    customAxios.defaults.headers.get['If-Modified-Since'] = '0'
    customAxios.defaults.cache = false

    Vue.use(VueAxios, customAxios)

    customAxios.interceptors.request.use(
        config => {
            let jwt = utils.storage.get(storageKeys.JWT);
            if( jwt ){
                config.headers['Authorization'] = `Bearer ${jwt}`;
            }
            return config
        },function(error){
            return Promise.reject(error)
        }
    )

    let toAuth = function () {
        utils.storage.remove(storageKeys.JWT);
        // eventbus.$emit('axios.noauth');
        //location.href = `${config.authUrl}?backUrl=${encodeURIComponent(location.href.split('#')[0])}`;
    }

    customAxios.interceptors.response.use(
        res => {
            if (res.status === 200) {
                if(!res.data){
                    Toast('服务端异常')
                }else if(res.data.http_status_code === 401){
                    toAuth();
                }else{
                    if (res.data.status === 200) {
                        return Promise.resolve(res.data)
                    } else {
                        Toast(res.data.message)
                    }
                }
            } else if(res.status === 401){
                toAuth();
                return;
            } else if (res.status === 500) {
                Toast('服务端异常')
            } else {
                Toast(`${res.status} ${res.data.message}`)
            }
            eventbus.$emit('axios.error', res);
            return Promise.reject(res)
        },
        (res) => {

            if(res.response.status === 401){
                toAuth();
                return;
            } else if (res.response.status === 500) {
                Toast('服务端异常')
            } else {
                Toast(`${res.response.status} ${res.response.data.message}`)
            }

            eventbus.$emit('axios.error');
            return Promise.reject(res)
        }
    )
}
