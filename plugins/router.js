import eventbus from '@/utils/eventbus'
import utils from '@/utils'
import api from '../api';
import {storageKeys, cookieKeys} from  '@/utils/config'
let config = require(`../config/index`)

let auth = async function (to, from, next) {

    if(to.name === 'auth'){
        next();
        return;
    }


    console.log('router auth')

    let jwt = utils.storage.get(storageKeys.JWT);
    let uid = utils.storage.get(storageKeys.UID);

    let removeAuthQuery = function (to) {
        delete to.query.stuempno;
        delete to.query.nickname;
        delete to.query.headimgurl;
        delete to.query.sign_method;
        delete to.query.timestamp;
        delete to.query.sign;

        let params = [];
        for(let p in to.query){
            params.push(`${p}=${to.query[p]}`);
        }

        console.log(to)

        // 微信需要进行注入wx.config，如果采用router跳转，会导致签名失败。
        location.replace(to.path + (params.length > 0?'?' + params.join('&') : '') + to.hash);
    }

    if( jwt && uid ){
        let stuempno = to.query.stuempno;
        if( stuempno ){
            removeAuthQuery(to);
            //next({ path: to.path, query: to.query, hash: to.hash })
        }else{
            next();
        }

        return;
    }

    let stuempno = to.query.stuempno;
    if( stuempno ){

        let error = null;
        let res = await api.ucenter.exchangeJwt(
            {
                ...to.query,
            }
        ).catch(function (err) {
            error = err;
        });

        if(!res || error){
            location.href = '/error?id=1003'
        }else{
            let result =  res.data
            utils.storage.set(storageKeys.JWT, result.token);
            utils.storage.set(storageKeys.UID, result.uid);
            utils.storage.set(storageKeys.USERINFO, result);

            removeAuthQuery(to)
            //next({ path: to.path, query: to.query, hash: to.hash })
        }
    }else{
        location.href = `${config.authUrl}?backUrl=${encodeURIComponent(location.href.split('#')[0])}`;
    }
}

export default ({app,store, nuxt}) => {
    store.$router.beforeEach(auth);
    store.$router.beforeEach(function (from, to ,next) {
        to.meta.keepView = false;
        console.log(to)
        next();
    })

    eventbus.$on('paginationLoading.error', function () {
        store.commit(`common/PAGINATION_LOADING`, {error: true})
    })
}
