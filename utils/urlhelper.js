
const APP_ABSOLUTE_PREFIX = 'shunivapp://';

let startWith = function(str, c){
    let reg=new RegExp("^"+c);
    return reg.test(str);
}

let transitionUrl = function (url) {
    if(!url)return url;

    if(startWith(url, APP_ABSOLUTE_PREFIX)){
        return '/' + url.substring(APP_ABSOLUTE_PREFIX.length)
    }

    return url;
}

let isRelativeUrl = function (url) {
    return !(startWith(url, 'http') || startWith(url, 'https'))
}

let navigateTo = function (params) {
    if(!params || !params.url){
        throw new Error('param is error!')
    }

    let url = transitionUrl(params.url);
    if(isRelativeUrl(url)){
        this.$router.push(url)
    }
    else{
        location.href = url;
    }
}

let redirectTo = function (params) {
    if(!params || !params.url){
        throw new Error('param is error!')
    }

    let url = transitionUrl(params.url);
    if(isRelativeUrl(url)){
        this.$router.replace(url)
    }
    else{
        location.replace(url);
    }
}

export { transitionUrl, navigateTo, redirectTo}

export default {
    transitionUrl,
    navigateTo,
    redirectTo,
}
