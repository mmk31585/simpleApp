import { createMemoryHistory, createRouter } from "vue-router";
import LoginPage from "@/view/auth/login.vue";
import Dashboard from "@/view/dashbord/index.vue";
import { useAuthStore } from "@/stores/auth";

const routes = [
  { path: "/", component: LoginPage },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
router.beforeEach((to, _, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next("/");
  }
  next();
});
