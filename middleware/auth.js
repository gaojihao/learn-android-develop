
import Vue from 'vue'
import utils from '../utils'
import {mutationTypes} from '../store/common'
import {storageKeys} from  '../utils/config'
let config = require(`../config/index`)

export default async function({store, route, redirect, error, next}) {
    console.log("auth" );

    if(process.server){
        return;
    }

    if(!Vue.cookies){
        throw new Error("Can't load plugins vue-cookies.")
    }

    let commit = function (jwt, uid, userInfo) {
        store.commit(`common/${mutationTypes.USER_JWT}`, jwt);
        store.commit(`common/${mutationTypes.UID}`, uid);
        store.commit(`common/${mutationTypes.USERINFO}`, userInfo);
    }

    let jwt = utils.storage.get(storageKeys.JWT);
    let uid = utils.storage.get(storageKeys.UID);
    let userInfo = utils.storage.get(storageKeys.USERINFO);
    if( jwt && uid){
        commit(jwt, uid, userInfo)
    }
}