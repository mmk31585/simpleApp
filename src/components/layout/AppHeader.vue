<template>
  <div class="tw:w-full tw:flex tw:items-center tw:justify-between">
    <h2 class="tw:text-xl tw:font-bold">داشبورد</h2>
    <div class="tw:flex tw:items-center tw:gap-3">
      <p v-if="userName" class="tw:text-sm">خوش آمدی، {{ userName }}</p>
      <a-button size="small" @click="$emit('logout')">خروج</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ userName?: string }>();
defineEmits<{ (e: "logout"): void }>();
</script>
