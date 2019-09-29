import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router/index.js'
import store from '@/store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import '@/common/stylus/index.styl'

fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('@/common/image/lazy.png')
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})