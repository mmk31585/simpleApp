<template>
  <a-config-provider :theme="themeStore.themeConfig">
    <a-layout class="tw:h-screen tw:bg-[#bdd2a9] tw:dark:bg-[#0b1f2a]">
      <a-layout-sider :width="260" class="tw:bg-[#1f2937]">
        <SideMenu :items="items" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" @select="onSelect" />
      </a-layout-sider>

      <a-layout>
        <a-layout-header class="tw:bg-transparent tw:flex tw:items-center tw:justify-between tw:px-4">
          <AppHeader :userName="user?.name" @logout="logout" />
        </a-layout-header>

        <a-layout-content>
          <keep-alive include="DashboardHome,AnalyticsPage,MessagesPage">
            <router-view />
          </keep-alive>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <ThemeFab />
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import AppHeader from '@/components/layout/AppHeader.vue';
import SideMenu from '@/components/navigation/slideMenu.vue';
import ThemeFab from '@/components/common/FloatItem.vue';
import { menuItems as items, menuRouteMap } from '@/features/navigation/menuItems';

const themeStore = useThemeStore();
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const user = auth.user;

const selectedKeys = ref<string[]>(['1']);
const openKeys = ref<string[]>(['sub1']);

function logout() { auth.logout(router); }
function onSelect(payload: { key: string }) {
  selectedKeys.value = [payload.key];
  const path = menuRouteMap[payload.key];
  if (path && route.path !== path) router.push(path);
}
</script>
