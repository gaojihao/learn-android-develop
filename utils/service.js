
import utils from './utils';
import Vue from 'vue'

function post(url, data, config) {

    let requestObj = {
        url: url,
        method: 'post',
        data: data,
        transformRequest: [function (data) {
            let ret = [];
            for(let it in data){
                let v = data[it];
                if (utils.isObject(v)) {
                    v = JSON.stringify(v);
                }
                ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(v));
            }
            return ret.join('&')
        }],
    }

    if(config && config.headers){
        for(let k in config){
            requestObj[k] = config[k];
        }
    }

    return Vue.axios(requestObj);
}

function get(url, data, config = {}) {
    config.params = data;
    return Vue.axios.get(url,config)
}

function put(url, data){
    let requestObj = {
        url: url,
        method: 'put',
        data: data,
        transformRequest: [function (data) {
            let ret = [];
            for(let it in data){
                let v = data[it];
                if (utils.isObject(v)) {
                    v = JSON.stringify(v);
                }
                ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(v));
            }
            return ret.join('&')
        }],
    }

    return Vue.axios(requestObj);
}

function encode(val) {
    return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

export { post, get ,put}

export default {
    post,
    get,
    put
}
