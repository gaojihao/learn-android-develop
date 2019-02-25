import Vue from 'vue';
import initiateLoading from './initiate-loading.vue'
import eventbus from '@/utils/eventbus'

const LoadingConstructor = Vue.extend(initiateLoading);
let instance = null;

let getInstance = () => {
  if (instance !== null){
    return instance;
  }

  instance =  new LoadingConstructor({
      el: document.createElement('div')
  });

  return instance;
};

LoadingConstructor.prototype.close = function() {
  this.visible = false;
  this.closed = true;
  this.styleObject = {};
};

let InitiateLoading = {
  show: (options = {}) => {

    let timeout = options.timeout || 30000;

    getInstance();

    instance.closed = false;
    instance.visible = true;

    if(options.style){
        instance.styleObject = options.style;
    }

    document.body.appendChild(instance.$el);
    instance.timer && clearTimeout(instance.timer);

    eventbus.$on('axios.error', function () {
        instance.timer && clearTimeout(instance.timer);
        instance.close();
    })

    Vue.nextTick(function() {
      ~timeout && timeout > -1 && (instance.timer = setTimeout(function() {
        if (instance.closed) return;
        instance.close();
      }, timeout));
    });
  },
  hide: () => {
      instance && instance.close();
  }
};

export default InitiateLoading;
