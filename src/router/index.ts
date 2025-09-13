
import { createWebHistory, createRouter } from "vue-router";
import LoginPage from "@/view/auth/login.vue";
import Dashboard from "@/view/dashboard/index.vue";
import { useAuthStore } from "@/stores/auth";

const routes = [
  { path: "/", component: LoginPage },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  const persisted = localStorage.getItem("auth");
  const hasToken =
    auth.isAuthenticated || (persisted && JSON.parse(persisted)?.token);

  if (to.meta.requiresAuth && !hasToken) {
    return { path: "/" };
  }
});
