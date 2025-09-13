<template>
  <div class="tw:flex tw:min-h-screen tw:items-center tw:justify-center"
    :class="isDark ? 'tw:bg-[#0b1f2a]' : 'tw:bg-[#f7f8fb]'">

    <div class="tw:z-0">
      <Aurora :color-stops="isDark
        ? [darkTokens.colorBgBase, darkTokens.colorPrimary, darkTokens.colorBgBase]
        : [lightTokens.colorBgBase, lightTokens.colorPrimary, lightTokens.colorBgBase]
        " :amplitude="1.0" :blend="0.7" :speed="0.5" :intensity="0.8" class="h-full w-full" />
    </div>
    <div class="tw:bg-white/30 tw:w-fit tw:h-fit tw:px-2 tw:py-4 tw:rounded-2xl tw:z-10">
      <h2 class="tw:text-2xl tw:sm:text-3xl tw:font-extrabold tw:text-center tw:mb-4">ورود</h2>
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { isDark } from "@/stores/theme";
import LoginForm from "@/components/auth/LoginForm.vue";
import Aurora from "@/components/auth/Aura.vue";
import { lightTokens, darkTokens } from "@/plugins/antdv.theme.ts";
defineOptions({ name: "LoginPage" });
</script>
