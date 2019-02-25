
import PDF from './pdf.vue'

var $vm
export default {
  install (Vue, options) {

    Vue.prototype.$showPDF = function (url) {

      if (!$vm) {
        const PDFPlugin = Vue.extend(PDF)
        $vm = new PDFPlugin().$mount()
        document.body.appendChild($vm.$el)
      }

      $vm.showPDF(url)
    }

    // Vue.prototype.$hidePDF = function () {
    //
    //   if ($vm){
    //     var container = document.getElementById("container");
    //     document.body.removeChild(container)
    //   }
    // }

  }
}
