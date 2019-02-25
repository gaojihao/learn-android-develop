
import Vue from 'vue'
import utils from '../utils'
import api from '../api';
import {mutationTypes} from '../store/common'

let isInitRouterAfterEach = false;

let init = function (router, store) {
    if(!isInitRouterAfterEach){
        router.afterEach(function (to, from) {

        })

        router.beforeEach(function (to, from, next) {


            next();
        })
        isInitRouterAfterEach = true;
    }
}

export default function(context) {
    console.log(context );

    context.store.commit(`common/${mutationTypes.KEEP_ALIVE}`, true);

    init(context.app.router, context.store);
}