import Vue from 'vue'
import App from './App.vue'
import { store } from './store/index.js'

Vue.config.productionTip = false

Vue.filter('truncate', function (value, limit) {
  if (value.length > limit) {
    value = value.substring(0, (limit - 3)) + '...'
  }
  return value
})
Vue.filter('uppercase', function (value) {
  return value.toUpperCase()
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
