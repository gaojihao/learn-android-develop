<template>
    <div>
        <header-top :name="this.name"></header-top>
        <personal-header :personalInfo="personalInfo"></personal-header>
        <personal-list></personal-list>
    </div>    
</template>
<script>
import HeaderTop from '~/components/common/header.vue'
import PersonalHeader from './components/PersonalHeader'
import PersonalList from './components/PersonalList'
import { mapGetters, mapActions } from 'vuex'
export default {
    name:'Personal',
    components:{
        HeaderTop,
        PersonalHeader,
        PersonalList
    },
    data () {
        return {
            name: '张三'
        }
    },
    computed:{
        ...mapGetters({
           personalInfo: 'personal/personalInfo'     
        })
    },
    mounted () {
        this.getPersonalInfo()
    },
    methods:{
        ...mapActions({
            getPersonalInfo: 'personal/getPersonalInfo'
        }),
    }
}
</script>
<style lang="less" scoped>

</style>

