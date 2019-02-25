
import Routes from './routes'
import Navigator from './navigator'
import NavComponent from './components/Navigation'
import { genKey, isObjEqual, matches, parseQuery, stringifyQuery } from './utils'

function isRouteNavigationOn(route, options) {
    const include = options.include
    const exclude = options.exclude

    let name = route.name
    let excludeFlag = exclude && name && matches(exclude, name)
    if(!excludeFlag){
        if(include && name && matches(include, name)){
            return true;
        }
    }

    return false;
}

export default {
    install: (Vue, { router, store, options} = {}) => {
        if (!router) {
            console.error('vue-navigation need options: router')
            return
        }

        options = Object.assign({
            moduleName: 'navigation',
            keyName: '_nk',  //mode=query的时候使用
        }, options)


        const bus = new Vue()
        const navigator = Navigator(bus, store, options)

        // hack vue-router replace for replaceFlag
        const routerReplace = router.replace.bind(router)
        let replaceFlag = false
        router.replace = (location, onComplete, onAbort) => {
            replaceFlag = true
            routerReplace(location, onComplete, onAbort)
        }

        // init router`s navigation meta
        router.beforeEach((to, from, next) => {

            if(to.meta.navigation && to.meta.navigation.inited){
                next()
                return;
            }

            to.meta.navigation = to.meta.navigation || {};
            to.meta.navigation.inited = true;
            to.meta.navigation.on = isRouteNavigationOn(to, options)

            next()
        })

        // init router`s keyName
        router.beforeEach((to, from, next) => {
            //console.log(to.hash)

            let toQuery = parseQuery(to.hash)
            let fromQuery = parseQuery(from.hash)

            //console.log('toQuery', toQuery)

            if (!toQuery[options.keyName]) {
                let keyName = options.keyName;
                if (to.path === from.path && isObjEqual(
                        { ...toQuery, [keyName]: null },
                        { ...fromQuery, [keyName]: null },
                    ) && fromQuery[keyName]) {
                    toQuery[keyName] = fromQuery[keyName]
                } else {
                    toQuery[keyName] = genKey()
                }

                next({ path: to.path, query: to.query, replace: replaceFlag || !fromQuery[keyName], hash: stringifyQuery(toQuery) })
            } else {
                next()
            }
        })

        // record router change
        router.afterEach((to, from) => {
            navigator.record(to, from, replaceFlag)
            replaceFlag = false
        })

        Vue.component('navigation', NavComponent(options))

        Vue.navigation = Vue.prototype.$navigation = {
            on: (event, callback) => {
                bus.$on(event, callback)
            },
            once: (event, callback) => {
                bus.$once(event, callback)
            },
            off: (event, callback) => {
                bus.$off(event, callback)
            },
            getRoutes: () => Routes.slice(),
            cleanRoutes: () => navigator.reset()
        }
    }
}
