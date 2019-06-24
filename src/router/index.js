import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [{
    name: '',
    path: '/',
    component: () => import('@/views/layout'),
    children: [{
      name: 'home',
      path: '/',
      component: () => import('@/views/home')
    }]
  },

  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login')
  }
  ]
})
router.beforeEach((to, from, next) => {
  nprogress.start()
  const userInfo = window.localStorage.getItem('user-info')
  // 判断是否是登录页面
  if (to.path !== '/login') {
    // 判断是否是登录
    if (!userInfo) {
      // 跳转到登录页面
      next({
        name: 'login'
      })
    } else {
      next()
    }
  } else {
    // 如果登录了就不允许访问登录页面
    if (userInfo) {
      next(false)
    } else {
      next()
    }
  }
})

// 后置守卫
router.afterEach((to, from) => {
  nprogress.done()
})

export default router
