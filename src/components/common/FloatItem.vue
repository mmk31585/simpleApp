<template>
  <a-float-button-group trigger="click" type="primary" :style="{ left: '24px' }">
    <template #icon>
      <CustomerServiceOutlined />
    </template>
    <a-float-button @click="themeStore.toggleTheme"><template #icon>
        <BulbOutlined />
      </template></a-float-button>
  </a-float-button-group>
</template>
<script setup lang="ts">
import { BulbOutlined, CustomerServiceOutlined } from '@ant-design/icons-vue';
import { useThemeStore } from '@/stores/theme';
const themeStore = useThemeStore();
</script>
