<template>
  <a-config-provider :theme="themeStore.themeConfig">
    <div
      class="tw:bg-[#bdd2a9] dark:tw:bg-[#0b1f2a] tw:relative tw:grid tw:grid-cols-5 tw:grid-rows-8 tw:w-full tw:h-screen"
    >
      <div class="tw:col-span-4 tw:col-start-2 tw:row-start-1">
        <AppHeader :userName="user?.name" @logout="logout" />
      </div>

      <SideMenu
        :items="items"
        v-model:selectedKeys="state.selectedKeys"
        v-model:openKeys="state.openKeys"
        @select="onMenuClick"
      />

      <div
        class="tw:bg-amber-200 dark:tw:bg-amber-950 tw:col-span-4 tw:row-span-7 tw:col-start-2 tw:row-start-2"
      ></div>

      <ThemeFab />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme";

import AppHeader from "@/components/layout/AppHeader.vue";
import SideMenu from "@/components/layout/slideMenu.vue";
import ThemeFab from "@/components/common/FloatItem.vue";
import { menuItems as items } from "@/features/dashboard/model/menuItems";

defineOptions({ name: "DashboardPage" });

const themeStore = useThemeStore();
const auth = useAuthStore();
const router = useRouter();
const user = auth.user;

function logout() {
  auth.logout(router);
}

const state = reactive({
  selectedKeys: ["1"],
  openKeys: ["sub1"],
});

function onMenuClick(info: { key: string }) {
  state.selectedKeys = [info.key];
  // اینجا می‌تونی روت‌دهی هم انجام بدی
  // if (info.key === '1') router.push('/dashboard');
}
</script>
