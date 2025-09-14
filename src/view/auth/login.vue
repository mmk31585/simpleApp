<template>
  <div
    class="tw:flex tw:min-h-screen tw:items-center tw:justify-center"
    :class="isDark ? 'tw:bg-[#131d33]' : 'tw:bg-[#d7dbe0]'"
  >
    <div class="tw:z-0">
      <Aurora
        :color-stops="
          isDark
            ? [darkTokens.colorBgBase, darkTokens.colorPrimary, darkTokens.colorBgBase]
            : [lightTokens.colorBgBase, lightTokens.colorPrimary, lightTokens.colorBgBase]
        "
        :amplitude="1.0"
        :blend="0.7"
        :speed="0.5"
        :intensity="0.7"
        class="tw:h-full tw:w-full"
      />
    </div>
    <section
      class="tw:flex tw:justify-center tw:z-10 tw:w-full tw:max-w-md tw:px-4 sm:tw:px-6"
      aria-labelledby="login-title"
    >
      <div
        class="tw:bg-white/50 tw:dark:bg-white/10 tw:backdrop-blur-md tw:w-fit tw:h-fit tw:px-2 tw:py-4 tw:rounded-2xl tw:border tw:border-white/40 tw:dark:border-white/20 tw:shadow-lg tw:text-[#111827]/80 tw:dark:text-[#F9FAFB]/80"
      >
        <h2 class="tw:text-2xl tw:sm:text-3xl tw:font-extrabold tw:text-center tw:mb-4">ورود</h2>
        <p class="tw:text-center tw:text-sm tw:opacity-80">برای ادامه وارد حساب کاربری‌ات شو</p>
        <LoginForm />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { isDark } from "@/stores/theme";
import LoginForm from "@/components/auth/LoginForm.vue";
import Aurora from "@/components/auth/Aura.vue";
import { lightTokens, darkTokens } from "@/plugins/antdv.theme.ts";
defineOptions({ name: "LoginPage" });
</script>
