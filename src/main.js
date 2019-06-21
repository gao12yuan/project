import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
// var a = 3
// if (a === 3) {
//   console.log(123)
// }
// function fn () {
//   console.log(333)
// }
// fn()
// var arr = [1, 2, 4, 6, 66, 88]

// for (var i = 1; i < arr.length; i++) {
//   if (arr[i] > 5) {
//     arr[arr.length] = arr[i]
//   }
// }
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
