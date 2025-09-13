<script setup lang="ts">
import { RouterView } from "vue-router";
import { ConfigProvider } from "ant-design-vue";
import { useThemeStore } from "@/stores/theme";

const themeStore = useThemeStore();
</script>

<template>
  <main>
    <ConfigProvider :theme="themeStore.themeConfig">
      <!-- <a-button @click="themeStore.toggleTheme">Toggle Theme</a-button> -->
      <RouterView />
    </ConfigProvider>
  </main>
</template>

<style scoped></style>
