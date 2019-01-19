import Vue from 'vue'
import App from './App.vue'
import { store } from './store/index.js'

Vue.config.productionTip = false

Vue.filter('capitalize', function(val) {
  return val? val.toUpperCase() : ''
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
