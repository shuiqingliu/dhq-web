import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
// import VCharts from 'v-charts'
import VeLine from 'v-charts/lib/line'
import VeMap from 'v-charts/lib/map.common'
import VeBar from 'v-charts/lib/bar.common'
import VePie from 'v-charts/lib/pie.common'


import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })
Vue.component(VeBar.name,VeBar)
Vue.component(VeLine.name,VeLine)
Vue.component(VePie.name,VePie)
Vue.component(VeMap.name,VeMap)


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
