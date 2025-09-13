<template>
  <div
    class="tw:flex tw:min-h-screen tw:items-center tw:justify-center tw:bg-blue-400 tw:dark:bg-slate-950"
  >
    <div class="tw:z-0">
      <Aurora
        :color-stops="['#222b21', '#7cff67', '#222b21']"
        :amplitude="1.0"
        :blend="0.7"
        :speed="0.5"
        :intensity="0.8"
        class="h-full w-full"
      />
    </div>
    <div class="tw:bg-white/30 tw:w-fit tw:h-fit tw:px-2 tw:py-4 tw:rounded-2xl tw:z-10">
      <h2 class="tw:text-2xl tw:sm:text-3xl tw:font-extrabold tw:text-center tw:mb-4">ورود</h2>
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from "@/features/auth/ui/LoginForm.vue";
import Aurora from "@/features/auth/ui/Aura.vue";
defineOptions({ name: "LoginPage" });
</script>
