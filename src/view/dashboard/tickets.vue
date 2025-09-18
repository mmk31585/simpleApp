<template>
  <div class="tw:flex tw:flex-col tw:gap-5 ">

    <a-collapse ghost expand-icon-position="end" :active-key="filtersOpen ? ['filters'] : []" @change="onCollapseChange"
      class="tw:bg-transparent">
      <a-collapse-panel key="filters" :show-arrow="false">
        <template #header>
          <div
            class="tw:flex tw:items-center tw:justify-between tw:w-full tw:gap-3 tw:px-4 tw:py-3 tw:bg-white tw:dark:bg-[#1a1a1a] tw:rounded-xl tw:border tw:border-[#f0f0f0] tw:dark:border-[#434343]">
            <div class="tw:flex tw:items-center tw:gap-2">
              <FilterOutlined />
              <span class="tw:text-[14px] tw:font-semibold">فیلترها و جستجو</span>
              <a-badge :count="activeFilterCount"
                :number-style="{ backgroundColor: activeFilterCount ? '#1890ff' : '#d9d9d9' }" />
            </div>
            <div class="tw:flex tw:items-center tw:gap-2">
              <a-button size="small" @click.stop="resetAllFilters"
                class="tw:rounded-md tw:hover:bg-gray-200 tw:dark:hover:bg-white">
                <ReloadOutlined />
                پاک کردن
              </a-button>
              <a-button type="text" @click.stop="toggleFilters"
                class="tw:rounded-md tw:hover:bg-gray-200 tw:dark:hover:bg-white">
                <component :is="filtersOpen ? UpOutlined : DownOutlined" />
              </a-button>
            </div>
          </div>
        </template>

        <div class="tw:mt-3">
          <TicketFilters @view-mode-change="handleViewModeChange" @sort-change="handleSortChange" />
        </div>
      </a-collapse-panel>
    </a-collapse>
    <SummaryCards />
    <div
      class="tw:flex tw:flex-col tw:md:flex-row tw:items-start md:tw:items-center tw:justify-between tw:gap-3 tw:px-5 tw:py-4 tw:bg-white tw:dark:bg-[#1a1a1a] tw:rounded-xl tw:border tw:border-[#f0f0f0] tw:dark:border-[#434343] tw:shadow tw:sticky tw:top-4 tw:z-10">
      <div>
        <h3 class="tw:m-0 tw:text-[16px] tw:font-semibold">نتایج جستجو</h3>
        <p class="tw:m-0 tw:text-[13px] tw:text-[#8c8c8c]">
          {{ ticketStore.filteredTickets.length }} تیکت یافت شد
        </p>
      </div>
      <div class="tw:w-full tw:md:w-auto">
        <a-segmented v-model:value="viewMode" :options="viewOptions"
          class="tw:w-full tw:md:w-auto tw:bg-[#f5f5f5] tw:dark:bg-[#141414] tw:rounded-lg" style="direction: ltr;" />
      </div>
    </div>

    <div class="tw:flex-1">
      <TicketsTable v-if="viewMode === 'table'" />

      <div v-else-if="viewMode === 'card'"
        class="tw:bg-white tw:dark:bg-[#1a1a1a] tw:rounded-xl tw:border tw:border-[#f0f0f0] tw:dark:border-[#434343] tw:p-5 tw:shadow">
        <a-row :gutter="[16, 16]">
          <a-col v-for="ticket in ticketStore.filteredTickets" :key="ticket.id" :xs="24" :sm="12" :lg="8" :xl="6">
            <TicketCard :ticket="ticket" @click="openTicket(ticket)" class="tw:h-full" />
          </a-col>
        </a-row>
        <a-empty v-if="ticketStore.filteredTickets.length === 0" description="هیچ تیکتی یافت نشد" class="tw:py-14">
          <a-button type="primary" @click="createNewTicket"
            class="tw:rounded-md tw:hover:bg-gray-200 tw:dark:hover:bg-white">
            <PlusOutlined />
            ایجاد تیکت جدید
          </a-button>
        </a-empty>
      </div>

      <div v-else-if="viewMode === 'list'"
        class="tw:bg-white tw:dark:bg-[#1a1a1a] tw:rounded-xl tw:border tw:border-[#f0f0f0] tw:dark:border-[#434343] tw:shadow">
        <a-list :data-source="ticketStore.filteredTickets" :pagination="listPagination" class="tw:p-0">
          <template #renderItem="{ item }">
            <a-list-item
              class="tw:cursor-pointer tw:transition-colors tw:rounded-lg tw:mx-3 tw:my-1 tw:px-4 tw:py-3 hover:tw:bg-[#f5f5f5] tw:dark:hover:bg-[#262626]"
              @click="openTicket(item)">
              <TicketListItem :ticket="item" />
            </a-list-item>
          </template>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from "vue";
import { useTicketStore } from "@/stores/ticket.ts";
import { message } from "ant-design-vue";
import type { Ticket } from "@/types/ticket.ts";
import TicketFilters from "@/components/ticket/TicketFilters.vue";
import TicketsTable from "@/components/ticket/TicketsTable.vue";
import TicketCard from "@/components/ticket/TicketCard.vue";
import TicketListItem from "@/components/ticket/TicketListItem.vue";
import {
  TableOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  FilterOutlined,
  ReloadOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons-vue";
import SummaryCards from "@/components/ticket/SummaryCards.vue";

const ticketStore = useTicketStore();
const viewMode = ref<"table" | "card" | "list">("table");
const filtersOpen = ref(true);

const viewOptions = [
  { label: "لیست", value: "list", icon: h(UnorderedListOutlined) },
  { label: "کارت", value: "card", icon: h(AppstoreOutlined) },
  { label: "جدول", value: "table", icon: h(TableOutlined) },
];

const formatListTotal = (total: number, range: [number, number]) =>
  `${range[0]}-${range[1]} از ${total} تیکت`;

const listPagination = {
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: formatListTotal,
};
const activeFilterCount = computed(() => {
  const s = ticketStore.statusFilter;
  const p = ticketStore.priorityFilter;
  const sv = ticketStore.serviceFilter;
  const dr = ticketStore.dateRange;
  let c = 0;
  if (s && s !== "all") c++;
  if (p && p !== "all") c++;
  if (sv && sv !== "all") c++;
  if (dr && dr.length === 2) c++;
  return c;
});

const handleViewModeChange = (mode: "table" | "card" | "list") => {
  viewMode.value = mode;
};
const handleSortChange = (_: string) => { };

const onCollapseChange = (keys: string[] | string) => {
  filtersOpen.value = Array.isArray(keys) ? keys.includes("filters") : !!keys;
};
const toggleFilters = () => (filtersOpen.value = !filtersOpen.value);
const resetAllFilters = () => ticketStore.resetFilters();

const openTicket = (ticket: Ticket) => {
  ticketStore.openTicketDrawer(ticket);
};
const createNewTicket = () => {
  message.info("مودال ایجاد تیکت باز می‌شود");
};
</script>

<style></style>
