import { createRouter, createWebHistory } from 'vue-router'
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

export default router
