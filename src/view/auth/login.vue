<template>
  <div class="tw:flex tw:min-h-screen tw:items-center tw:justify-center">
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/features/auth/model/LoginForm.vue';

defineOptions({ name: 'LoginPage' })
</script>
