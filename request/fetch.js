import Vue from 'vue'
//import store from '../store'
import axios from 'axios'

// 使用由库提供的配置的默认值来创建实例
// 此时超时配置的默认值是 `0`

// 将axios添加到vue的实例中
Vue.prototype.$ajax = axios;

var instance = axios.create();
// 覆写库的超时默认值
// 现在，在超时前，所有请求都会等待 2.5 秒
instance.defaults.timeout = 2500;
// 添加请求拦截器
let _showLoading=true
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if(_showLoading){
    //store.commit('TOGGLE_LOADING_BAR', true)
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  //store.commit('TOGGLE_LOADING_BAR', false)
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

/*
* 封装fetch方法
*/

export default async(url = '', data = {}, type = 'GET', showloading=true) => {
    // 是否展示loading展示框
    _showLoading=showloading
    // 页面是否需要做权限校验
   let _Permissions=data.Authorization?{Authorization:`Bearer ${data.Authorization}`}:{}
   return axios({
        method: type,
        url: __baseUrl__+url,
        data: data,
        headers:{
            ..._Permissions
        },
    }).then(res=>{
        return res
    }).catch(err=>{
        return err
    })
}

/*
 * 发送页面GET请求
 */
export const commonGet = function(pam, showLoading = true) {
  // alert('this is mockajax')
  _showLoading = showLoading
  let url=__baseUrl__+pam.url
  return axios.get(url, {
    params: pam.data,
  }).then(res => {
    return res
  }).catch(err=>{
    errorHandle()
    return res
  })
}

export const commonPost = function(pam, showLoading = true) {
  // alert('this is mockajax')
  _showLoading = showLoading
  let url=__baseUrl__+pam.url
  var params = new URLSearchParams(pam.data)
  // params.append('billNo',pam.data.billNo)
  return axios.post(url,params.toString()).then(res => {
    console.log(res)
    return res
  }).catch(err=>{
    errorHandle()
    return res
    // console.log(err)
  })
}

const errorHandle=function(errMsg){
  let res={
    body:{}
  }
  res.body={
    status:999,
    message:'您访问的页面走丢了，请稍候重试！'
  }
  //store.commit('TOGGLE_LOADING_BAR', false)
  window._router.replace({ path: 'error' })
}
/*post页面跳转*/
Vue.prototype.$postUrl = StandardPost
const StandardPost=(url,arg)=>{
  // let form=`<form method='post' action='${url}'></form>`
  var form=document.createElement('form')
  form.method='post'
  form.action=url
  
}
