<template>
  <a-menu
    :items="items"
    mode="inline"
    :selectedKeys="selected"
    :openKeys="opened"
    @update:selectedKeys="(v: string[]) => $emit('update:selectedKeys', v)"
    @update:openKeys="(v: string[]) => $emit('update:openKeys', v)"
    @click="(info: any) => $emit('select', { key: info.key })"
    class="tw:!bg-transparent tw:!text-white"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { MenuProps } from "ant-design-vue";
const props = defineProps<{
  items: NonNullable<MenuProps["items"]>;
  selectedKeys?: string[];
  openKeys?: string[];
}>();
defineEmits<{
  (e: "update:selectedKeys", v: string[]): void;
  (e: "update:openKeys", v: string[]): void;
  (e: "select", p: { key: string }): void;
}>();
const selected = computed(() => props.selectedKeys ?? []);
const opened = computed(() => props.openKeys ?? []);
</script>
