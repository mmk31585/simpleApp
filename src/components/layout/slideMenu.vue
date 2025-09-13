<template>
  <div
    class="tw:flex tw:items-start tw:gap-2 tw:row-span-8 tw:col-start-1 tw:row-start-1 tw:bg-[#636363] tw:dark:bg-[#0b1f2a] tw:h-screen">
    <div class="tw:overflow-hidden tw:transition-all tw:duration-200 tw:backdrop-blur-md tw:w-full">
      <a-menu :items="items" mode="inline" :inline-collapsed="false" :selectedKeys="selectedKeys" :openKeys="openKeys"
        @update:selectedKeys="(v) => $emit('update:selectedKeys', v as string[])"
        @update:openKeys="(v) => $emit('update:openKeys', v as string[])"
        @click="(info: any) => $emit('select', { key: info.key })" class="tw:!bg-transparent tw:text-amber-100" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuProps } from "ant-design-vue";

defineProps<{
  items: NonNullable<MenuProps["items"]>;
  selectedKeys: string[];
  openKeys: string[];
}>();

defineEmits<{
  (e: "update:selectedKeys", v: string[]): void;
  (e: "update:openKeys", v: string[]): void;
  (e: "select", payload: { key: string }): void;
}>();
</script>
