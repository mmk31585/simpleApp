import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/view/auth/login.vue';
import DashboardLayout from '@/layouts/Dashboard.vue';
import { useAuthStore } from '@/stores/auth';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard/home' },
        { path: 'home', name: 'DashboardHome', component: () => import('@/view/dashboard/DashboardHome.vue') },
        { path: 'analytics', name: 'AnalyticsPage', component: () => import('@/view/dashboard/AnalyticsPage.vue') },
        { path: 'messages', name: 'MessagesPage', component: () => import('@/view/dashboard/MessagesPage.vue') },

        { path: 'nav/5', component: () => import('@/view/dashboard/Nav5.vue') },
        { path: 'nav/6', component: () => import('@/view/dashboard/Nav6.vue') },
        { path: 'nav/7', component: () => import('@/view/dashboard/Nav7.vue') },
        { path: 'nav/8', component: () => import('@/view/dashboard/Nav8.vue') },
        { path: 'nav2/9', component: () => import('@/view/dashboard/Nav2_9.vue') },
        { path: 'nav2/10', component: () => import('@/view/dashboard/Nav2_10.vue') },
        { path: 'nav2/11', component: () => import('@/view/dashboard/Nav2_11.vue') },
        { path: 'nav2/12', component: () => import('@/view/dashboard/Nav2_12.vue') },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { path: '/' };
});
