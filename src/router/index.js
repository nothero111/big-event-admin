import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index.js'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/mange',
      children: [
        {
          path: '/article/mange',
          component: () => import('@/views/article/ArticleMange.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// vue3 默认情况是直接通行
// 根据返回值决定，是放行还是拦截
// true/undefined才会放行
// false 回from的地址
// 具体路径 或 路径对象拦截到对应地址
router.beforeEach((to) => {
  // 如果没有token，且访问的是非登录页，拦截到登录
  // 其他情况放行
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
})

export default router
