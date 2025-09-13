<script setup lang="ts">
import { RouterView } from "vue-router";
import { theme, ConfigProvider } from 'ant-design-vue'
import { computed, ref } from 'vue'
const isDark = ref(false)

const lightTokens = {
  colorPrimary: '#a30b7b',
  colorBgContainer: '#ffffff',
  colorText: '#111827',
}

const darkTokens = {
  colorPrimary: '#f59e0b',
  colorBgContainer: '#1f2937',
  colorText: '#f3f4f6',
}

const themeConfig = computed(() => ({
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: isDark.value ? darkTokens : lightTokens,
}))

</script>

<template>
  <main>
    <ConfigProvider :theme="themeConfig">
      <RouterView />
    </ConfigProvider>
  </main>
</template>

<style scoped></style>
