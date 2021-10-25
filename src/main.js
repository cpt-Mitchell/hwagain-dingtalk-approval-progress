import Vue from 'vue'
import App from './App'
import router from './router'
import vuet from '@/vuet'
import { initPlugins } from '@/utils/commonPlugins'
import './permission'

Vue.config.productionTip = false
initPlugins(Vue)

/* eslint-disable no-new */
new Vue({
  vuet,
  router,
  render: h => h(App)
}).$mount('#app')
