
let wx;
let na;
if (process.browser) {
    wx = require('weixin-js-sdk');
    na = navigator;
}

import api from '../../api'
import {  Toast} from 'mint-ui';

let env = function() {
    let isApp = false,
        isWeiXin = false,
        isMobile = true,
        isPc = false
    let ua = na && na.userAgent ? na.userAgent.toLowerCase(): ''

    if(ua.match(/micromessenger/i)) {
        isWeiXin = true
    }
    
    let weiXinVersion = (function () {
        let regExp = /micromessenger\/([\d|\.]+)/i;
        if (regExp.exec(ua)===null) {return;}
        return regExp.exec(ua)[1];
    })();
    
    let isInitSDKEveryUrl = (function () {
        if(!weiXinVersion){
            return false;
        }
        let v0 = [6,3,31];
        let v1 = weiXinVersion.split('.');
        if (v1.length >= 4) {
            v1 = v1.slice(0,3);
        }
        v1 = v1.map(function(v){
            return parseInt(v, 10);
        });
        if (v1[0] > v0[0]) {
            return true;
        }
        if (v1[0] === v0[0] && v1[1] > v0[1]) {
            return true;
        }

        if (v1[0] === v0[0] && v1[1] === v0[1] && v1[2] >= v0[2]) {
            return true;
        }

        return false;
    })();

    return {
        isApp: isApp,
        isWeiXin: isWeiXin,
        isMobile: isMobile,
        isSafari: !!(ua.match(/iPhone|iPad|iPod/) && ua.match(/Safari/)),
        isPc: isPc,
        isAndroid: !!ua.match(/android/i),
        weiXinVersion: weiXinVersion,
        isInitSDKEveryUrl: isInitSDKEveryUrl

    }
}()


let inited = false;
let url;
let rs;

let initSDK = async function (data, useFirstUrl = true) {

    let configUrl;
    if(useFirstUrl){
        if(!url){
            //使用初次加载的URL进行初始化，即使第一次初始化失败了，后续也采用这个URL初始化wx.config
            configUrl = url = encodeURIComponent(location.href.split('#')[0]);
        }else{
            configUrl = url;
        }
    }else{
        configUrl = data.link || encodeURIComponent(location.href.split('#')[0]);
    }

    rs = await api.weixin.ticketSign({
        url:  configUrl,
    })

    if (rs && rs.status == 200) {

        wx.config({
            debug: false,
            appId: rs.data.appid,
            timestamp: rs.data.timestamp,
            nonceStr: rs.data.noncestr,
            signature: rs.data.signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareQZone',
                'onMenuShareWeibo',
                'hideAllNonBaseMenuItem'
            ]
        })

        wx.ready(function() {

            wx.checkJsApi({
                jsApiList: ['onMenuShareTimeline']
            })

            //朋友圈
            wx.onMenuShareTimeline(data)
            //朋友
            wx.onMenuShareAppMessage(data)
            //qq
            wx.onMenuShareQQ(data)
            //qqzone
            wx.onMenuShareQZone(data)
            //WeiBo
            wx.onMenuShareWeibo(data)

            //debug
            wx.error(function(rs) {
                console.log(JSON.stringify(rs))
            })
        })

        inited = true;
    }

}


let share = async function(shareObj = {}) {
    let params = {
        title: '上海大学学习交流平台',
        imgUrl:  location.origin + require('../../assets/images/logo-w.png'),
        desc: '上海大学学习交流平台提供大家学习交流的环境及资料，促进互相学习，共同进步！',
        link: location.href
    };

    params.title = shareObj.title || params.title;
    params.desc = shareObj.desc  || params.desc;
    params.imgUrl = shareObj.imgUrl || params.imgUrl;
    params.link = shareObj.link || params.link;
    params.content_tencent = params.content_weibo = params.desc;
    params.other = shareObj.other || '';

    delete params.content

    let data = {
        title: params.title,
        desc: params.content_tencent,
        link: params.link,
        imgUrl: params.imgUrl,
        success: function (res) {
        },
    }

    if(env.isAndroid){
        if(env.isInitSDKEveryUrl){
            await initSDK(data, false);
        }else{
            await initSDK(data);
        }
    }else{
        if(!inited){
            await initSDK(data);
        }else{
            wx.ready(function() {
                //朋友圈
                wx.onMenuShareTimeline(data)
                //朋友
                wx.onMenuShareAppMessage(data)
                //qq
                wx.onMenuShareQQ(data)
                //qqzone
                wx.onMenuShareQZone(data)
                //WeiBo
                wx.onMenuShareWeibo(data)
            })
        }
    }
}

export { wx }

export default share;