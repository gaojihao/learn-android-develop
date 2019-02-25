let isMock = process.env.NODE_ENV === 'mock'

let plugins = [
    '~plugins/babel-polyfill.js',
    '~plugins/navigation.js',
    '~plugins/router.js',
    '~plugins/mint-ui.js',
    '~plugins/axios.js',
    '~plugins/vue-cookie.js',
    '~plugins/swiper.js',
]

if(isMock){
    plugins.push('~plugins/mock.js')
}


module.exports = {
    /*
     ** Headers of the page
     */
    head: {
        title: '上海大学学习交流平台',
        meta: [{
            charset: 'utf-8'
        }, {
            name: 'viewport',
            content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover'
        }, {
            hid: 'description',
            name: 'description',
            content: '上海大学学习交流平台'
        },{
            name: 'format-detection',
            content: 'telephone=no,email=no'
        },{
            name: 'apple-touch-fullscreen',
            content: 'yes'
        },{
            name: 'apple-mobile-web-app-capable',
            content: 'yes'
        }],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: '/css/common.css' }],
        script: [{
            src: '/js/flexible.js',
            type: 'text/javascript',
            charset: 'utf-8'
        }],
    },
    /*
     ** Customize the progress bar color
     */
    loading: {
        color: '#3B8070'
    },

    css: [
        {src : 'mint-ui/lib/style.css'} ,
        {src : '~assets/font-awesome-4.7.0/css/font-awesome.min.css'},
        {src : '~assets/styles/iconfont.css'},
        {src : '~assets/styles/border.css'},
        {src : 'swiper/dist/css/swiper.css'}
    ],

    // router: {
    //     middleware: 'auth'
    // },

    /*
     ** 第三方组件
     */
    plugins: plugins,

    env: {
        NODE_ENV: process.env.NODE_ENV
    },

    /*
     ** Build configuration
     */
    build: {
        vendor: ['axios', 'weixin-js-sdk'],
        postcss: [
            require('postcss-px2rem')({
                remUnit: 37.5
            })
        ],
        /*
         ** Run ESLint on save
         */
        extend(config, {
            isDev,
            isClient
        }) {
            config.node = {
                fs: 'empty'
            }
            if (isDev && isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
                // config.module.rules.push({
                //     test:  /\.js$/,
                //     loader: 'babel-loader',
                //     exclude: /(node_modules)/
                // })
            }
        },
    },
    serverMiddleware: [
        // MOCK middleware
        '~/mock/index.js',
    ]
}
