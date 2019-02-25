let config = require(`./${process.env.NODE_ENV}.env`)

module.exports = {
    baseUrl: config.baseUrl,
    authUrl: config.authUrl
    // proxyTable: {
    //     '/media': {
    //         // 测试环境
    //         target: 'http://172.168.1.138:8082/',  // 接口域名
    //         changeOrigin: true,  //是否跨域
    //         pathRewrite: {
    //             '^/media': '/media'   //需要rewrite重写的,
    //         }
    //
    //     },
    // }

}
