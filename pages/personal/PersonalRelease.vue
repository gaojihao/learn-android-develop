<template>
    <keep-view name="personal-PersonalRelease">
        <personalrelease></personalrelease>
    </keep-view>
</template>
<script>
import personalrelease from './components/PersonalRelease.vue'
import keepView from '~/components/common/keepView.vue'
import { mapGetters, mapActions } from 'vuex'
import api from '@/api'

export default {
    name:'PersonalRelease',
    components:{
        personalrelease,
        keepView
    },
    data () {
        return {

        }
    },
    computed: {

    },

    methods:{

    },

    mounted () {

    },


}
</script>