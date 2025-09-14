<script setup lang="ts">
import { RouterView } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import { themeConfig } from "@/plugins/antdv.theme";

const themeStore = useThemeStore();
</script>

<template>
  <a-config-provider
    :theme="{ cssVar: true, ...themeConfig(themeStore.isDark) }"
    class="tw:transition-colors tw:duration-150"
    direction="rtl"
  >
    <RouterView />
  </a-config-provider>
</template>

<style scoped></style>
