

import { Info, Login } from "@/api/fakeapi";
import type { LoginResponse } from "@/types/response";
import type { User } from "@/types/user";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Router } from 'vue-router'

const JWT_KEY = 'jwt'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem(JWT_KEY));
  const loading = ref<boolean>(false);
  const isAuthenticated = computed(() => !!token.value);

  async function login(email: string, password: string, router: Router) {
    try {
      loading.value = true;
      const response = (await Login(email, password)) as LoginResponse;
      token.value = response.token;
      user.value = response.user;
      router.replace('/dashboard')
    } catch (error) {
      console.log(error);
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
  async function info(token: string) {
    try {
      loading.value = true;
      const response = (await Info(token)) as User
      user.value = response;
    } catch (error) {
      console.log(error);
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
    info
  };
}, {
  persist: {
    storage: localStorage,
    paths: ["token", "user"],
  },
});
