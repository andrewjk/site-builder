import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlus
} from '@fortawesome/free-solid-svg-icons'
// import {
// } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Normalize.css
// HACK: We have to refer to its location explicitly to avoid import errors
require('../../node_modules/normalize.css/normalize.css')

// Add the FontAwesome icons that we will use
library.add(faPlus)

Vue.component('fa', FontAwesomeIcon)

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
}
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
