import Routes from '../routes'
import { getKey, matches } from '../utils'

function getComponentName (opts){
    return opts && (opts.Ctor.options.name || opts.tag)
}

export default (options) => {
    return {
        name: 'navigation',
        abstract: true,
        props: {},
        data: () => ({
            routes: Routes
        }),
        computed: {},
        watch: {
            routes(val) {
                for (const key in this.cache) {
                    if (!matches(val, key)) {
                        const vnode = this.cache[key]
                        vnode && vnode.componentInstance.$destroy()
                        delete this.cache[key]
                    }
                }
            },
        },
        created() {
            this.cache = {}
        },
        destroyed() {
            for (const key in this.cache) {
                const vnode = this.cache[key]
                vnode && vnode.componentInstance.$destroy()
            }
        },
        render() {
            const vnode = this.$slots.default ? this.$slots.default[0] : null
            if (vnode) {

                if(!this.$route.meta.navigation.on){
                    return vnode;
                }

                const componentOptions = vnode ? vnode.componentOptions: null;
                const name = getComponentName(componentOptions)
                const { include, exclude } = this
                if (
                    // not included
                (include && (!name || !matches(include, name))) ||
                // excluded
                (exclude && name && matches(exclude, name))
                ) {
                    return vnode
                }

                vnode.key = vnode.key || (vnode.isComment
                        ? 'comment'
                        : vnode.tag)
                // prevent vue-router reuse component

                const key = getKey(this.$route, options);
                if (vnode.key.indexOf(key) === -1) {
                    vnode.key = `__navigation-${key}-${vnode.key}`
                }

                if (this.cache[key]) {
                    if (vnode.key === this.cache[key].key) {
                        // restore vnode from cache
                        console.log('hint cache:', this.cache[key].componentInstance)
                        vnode.componentInstance = this.cache[key].componentInstance


                    } else {
                        console.log('$destroy')
                        // replace vnode to cache
                        this.cache[key].componentInstance.$destroy()
                        this.cache[key] = vnode
                    }
                } else {
                    // cache new vnode
                    this.cache[key] = vnode
                }
                vnode.data.keepAlive = true
            }
            return vnode
        }
    }
}
