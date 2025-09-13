import { createMemoryHistory, createRouter } from 'vue-router'
import LoginPage from '@/view/auth/login.vue'
import Dashboard from '@/view/dashbord/index.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

// router.beforeEach(async (to, from, next) => {
//   const token = localStorage.getItem('token')

//   if (to.meta.requiresAuth) {
//     if (!token) {
//       return next('/')
//     }

//     // مثلا چک ساده با سرور
//     const res = await fetch('/api/check-token', {
//       headers: { Authorization: `Bearer ${token}` }
//     })

//     if (res.ok) {
//       next()
//     } else {
//       localStorage.removeItem('token')
//       next('/')
//     }
//   } else {
//     next()
//   }
// })
