import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Router } from "vue-router";
import type { User } from "@/types/user";
import type { LoginResponse } from "@/types/response";
import { Login, Info } from "@/api/fakeapi";
import { ZodError } from "zod";

const PERSIST_KEY = "auth";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);
    const loading = ref(false);
    const isAuthenticated = computed(() => Boolean(token.value));
    const errorMessage = ref<string | null>(null);

    async function login(email: string, password: string, router: Router) {
      try {
        loading.value = true;
        errorMessage.value = null;
        const res: LoginResponse = await Login(email, password);
        token.value = res.token;
        user.value = res.user;
        router.replace("/dashboard");
      } catch (err) {
        const msg =
          err instanceof ZodError
            ? err.issues.map((i) => i.message).join(", ")
            : err instanceof Error
              ? err.message
              : "خطای ناشناخته";
        errorMessage.value = msg;
        throw new Error(msg);
      } finally {
        loading.value = false;
      }
    }

    function logout(router: Router) {
      token.value = null;
      user.value = null;
      localStorage.removeItem(PERSIST_KEY);
      router.replace("/");
    }

    async function info(tokenValue: string) {
      try {
        loading.value = true;
        errorMessage.value = null;
        user.value = await Info(tokenValue);
      } catch (err) {
        const msg =
          err instanceof ZodError
            ? err.issues.map((i) => i.message).join(", ")
            : err instanceof Error
              ? err.message
              : "خطای ناشناخته";
        errorMessage.value = msg;
        throw new Error(msg);
      } finally {
        loading.value = false;
      }
    }

    return { user, token, loading, isAuthenticated, login, logout, info, errorMessage };
  },
  {
    persist: {
      key: PERSIST_KEY,
      storage: localStorage,
      pick: ["token", "user"],
    },
  },
);
