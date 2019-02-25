import Vue from 'vue'
import Navigation  from './navigation/index'

export default ({app,store}) => {
    Vue.use(Navigation, {
        router: store.$router,
        store,
        options: {
            include: [
                'personal-PersonalRelease',
                'ucenter-UserCollection',
                'ucenter-message'
            ],
            exclude: [
            ]
        }
    })
}
