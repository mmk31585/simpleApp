

import { Info, Login } from "@/api/fakeapi";
import type { LoginResponse } from "@/types/response";
import type { User } from "@/types/user";
import { ZodError } from "zod";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Router } from 'vue-router'

const JWT_KEY = 'jwt'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem(JWT_KEY));
  const loading = ref<boolean>(false);
  const isAuthenticated = computed(() => !!token.value);
  const errorMessage = ref<string | null>(null);

  async function login(email: string, password: string, router: Router) {
    try {
      loading.value = true;
      errorMessage.value = null;
      const response: LoginResponse = await Login(email, password);
      token.value = response.token;
      user.value = response.user;
      router.replace('/dashboard')
    } catch (error) {
      if (error instanceof ZodError) {
        errorMessage.value = error.issues.map((i) => i.message).join(', ');
      } else if (error instanceof Error) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = 'خطای ناشناخته';
      }
    } finally {
      loading.value = false;
    }
  }
  function logout(router: Router) {
    token.value = null
    user.value = null
    localStorage.removeItem(JWT_KEY)
    router.replace('/')
  }
  async function info(tokenValue: string) {
    try {
      loading.value = true;
      errorMessage.value = null;
      const response: User = await Info(tokenValue)
      user.value = response;
    } catch (error) {
      if (error instanceof ZodError) {
        errorMessage.value = error.issues.map((i) => i.message).join(', ');
      } else if (error instanceof Error) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = 'خطای ناشناخته';
      }
    } finally {
      loading.value = false;
    }

  }
  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    info,
    errorMessage
  };
}, {
  persist: {
    storage: localStorage,
    pick: ["token", "user"],
  },
});
