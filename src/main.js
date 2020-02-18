import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import { createProvider } from './vue-apollo' // apollo 的配置文件
import { router } from './router/index' // 路由

Vue.config.productionTip = false

new Vue({
  apolloProvider: createProvider(), // 像 vue-router 或 vuex 一样注入 apolloProvider
  router,
  render: h => h(App)
}).$mount('#app')
