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
    },
    {
      name: 'article',
      path: '/article',
      component: () => import('@/views/article')
    },
    {
      name: 'publish-edit',
      path: '/publish/:id',
      component: () => import('@/views/publish')
    },
    {
      name: 'publish',
      path: '/publish',
      component: () => import('@/views/publish')
    },
    {
      name: 'comment',
      path: '/comment',
      component: () => import('@/views/comment')
    },
    {
      name: 'user',
      path: '/user',
      component: () => import('@/views/user')
    },
    {
      name: 'image',
      path: '/image',
      component: () => import('@/views/image')
    }

    ]
  },

  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login')
  }
  ]
})
// 拦截守卫
router.beforeEach((to, from, next) => {
  // 进度条
  nprogress.start()
  // 获取本地储存
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
