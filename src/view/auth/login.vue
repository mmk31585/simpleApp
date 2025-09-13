<template>
  <div class="tw:flex tw:min-h-screen tw:items-center tw:justify-center">
    <div class="">
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from "@/features/auth/ui/LoginForm.vue";

defineOptions({ name: "LoginPage" });
</script>
