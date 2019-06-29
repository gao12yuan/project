import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './styles/index.less'
// 引入nprogress里得css
import 'nprogress/nprogress.css'
// 引入json-bigint包
import JSONbig from 'json-bigint'
// 引入axios
import axios from 'axios'
import store from './store'

// 配置基本路径
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 处理JSONbig返回数据中超出js安全范围的数字
axios.defaults.transformResponse = [function (data) {
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return data
  }
}]
// 请求拦截器
axios.interceptors.request.use(config => {
  // 获取本地储存
  const userInfo = JSON.parse(window.localStorage.getItem('user-info'))
  // console.dir(config)
  // 判断有没有userInfo
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }

  return config
}, error => {
  // Do something with request error
  return Promise.reject(error)
})

// 响应器
axios.interceptors.response.use(response => {
  // 判断返回数据格式是对象
  if (typeof response.data === 'object') {
    return response.data.data
  } else {
    return response.data
  }
  // return response.data.data
}, error => {
  // 如果是401必须删除本地储存
  if (status === 401) {
    // 删除本地储存
    window.localStorage.removeItem('user-info')
    // 跳转到登录界面
    router.push({
      name: 'login'
    })
    return Promise.reject(error)
  }
})

// 往原型对象添加成员
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
