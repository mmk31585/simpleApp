<template>
  <a-card
    class="tw:mb-6 tw:rounded-xl tw:border tw:!border-[#f0f0f0] tw:dark:!border-[#434343] tw:!bg-white tw:dark:!bg-[#1a1a1a]"
    :body-style="{ padding: '20px' }">
    <template #title>
      <div class="tw:flex tw:items-center tw:gap-2 tw:justify-between">
        <div class="tw:flex tw:items-center tw:gap-2 tw:font-semibold">
          <FilterOutlined />
          <span>فیلترها و جستجو</span>
        </div>
        <!-- <a-button type="link" size="small" @click="resetAllFilters"
          class="tw:p-0 tw:text-[12px] tw:rounded tw:hover:bg-gray-200 tw:dark:hover:bg-white">
          <ReloadOutlined />
          پاک کردن فیلترها
        </a-button> -->
      </div>
    </template>

    <a-form layout="vertical">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :md="6">
          <a-form-item label="وضعیت" class="tw:mb-0">
            <a-select v-model:value="ticketStore.statusFilter" placeholder="انتخاب وضعیت" allow-clear
              @change="onFilterChange">
              <a-select-option value="all">همه</a-select-option>
              <a-select-option value="open"><a-tag color="green"
                  class="tw:m-0 tw:text-[11px]">باز</a-tag></a-select-option>
              <a-select-option value="in-progress"><a-tag color="orange" class="tw:m-0 tw:text-[11px]">در حال
                  انجام</a-tag></a-select-option>
              <a-select-option value="closed"><a-tag color="default"
                  class="tw:m-0 tw:text-[11px]">بسته</a-tag></a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="12" :md="6">
          <a-form-item label="اولویت" class="tw:mb-0">
            <a-select v-model:value="ticketStore.priorityFilter" placeholder="انتخاب اولویت" allow-clear
              @change="onFilterChange">
              <a-select-option value="all">همه</a-select-option>
              <a-select-option value="low"><a-tag color="green"
                  class="tw:m-0 tw:text-[11px]">پایین</a-tag></a-select-option>
              <a-select-option value="medium"><a-tag color="orange"
                  class="tw:m-0 tw:text-[11px]">متوسط</a-tag></a-select-option>
              <a-select-option value="high"><a-tag color="red"
                  class="tw:m-0 tw:text-[11px]">بالا</a-tag></a-select-option>
              <a-select-option value="critical"><a-tag color="purple"
                  class="tw:m-0 tw:text-[11px]">حیاتی</a-tag></a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="12" :md="6">
          <a-form-item label="سرویس" class="tw:mb-0">
            <a-select v-model:value="ticketStore.serviceFilter" placeholder="انتخاب سرویس" allow-clear
              @change="onFilterChange">
              <a-select-option value="all">همه</a-select-option>
              <a-select-option value="technical">فنی</a-select-option>
              <a-select-option value="billing">مالی</a-select-option>
              <a-select-option value="general">عمومی</a-select-option>
              <a-select-option value="bug-report">گزارش باگ</a-select-option>
              <a-select-option value="feature-request">درخواست ویژگی</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="12" :md="6">
          <a-form-item label="بازه زمانی" class="tw:mb-0">
            <a-range-picker v-model:value="dateRange" format="YYYY/MM/DD" @change="onDateRangeChange" :locale="locale"
              style="width: 100% " />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16" class="tw:mt-4 tw:pt-4 tw:border-t tw:!border-[#f0f0f0] tw:dark:!border-[#434343]">
        <a-col :span="12">
          <div class="tw:flex tw:items-center tw:gap-3">
            <label class="tw:text-[14px] tw:font-medium tw:!text-[#595959] tw:dark:!text-[#a0a0a0]">نمایش:</label>
            <a-segmented v-model:value="viewMode" :options="segmentedOptions" @change="onViewModeChange"
              style="direction: ltr" />
          </div>
        </a-col>
        <a-col :span="12">
          <div class="tw:flex tw:items-center tw:gap-3 tw:justify-end">
            <label class="tw:text-[14px] tw:font-medium tw:!text-[#595959] tw:dark:!text-[#a0a0a0]">مرتب‌سازی:</label>
            <a-select v-model:value="sortBy" @change="onSortChange" style="width: 180px">
              <a-select-option value="created-desc">جدیدترین</a-select-option>
              <a-select-option value="created-asc">قدیمی‌ترین</a-select-option>
              <a-select-option value="priority-desc">اولویت بالا</a-select-option>
              <a-select-option value="status">وضعیت</a-select-option>
              <a-select-option value="title">عنوان</a-select-option>
            </a-select>
          </div>
        </a-col>
      </a-row>

      <div class="tw:mt-4 tw:pt-4 tw:border-t tw:!border-[#f0f0f0] tw:dark:!border-[#434343]">
        <span class="tw:block tw:mb-2 tw:text-[14px] tw:font-medium tw:text-[#595959] tw:dark:text-[#a0a0a0]">فیلترهای
          سریع:</span>
        <div class="tw:flex tw:flex-wrap tw:gap-2">
          <a-button size="small" :type="quickFilter === 'my-tickets' ? 'primary' : 'default'"
            @click="setQuickFilter('my-tickets')"
            class="tw:rounded-md tw:text-[12px] tw:h-7 tw:flex tw:items-center tw:gap-1 tw:hover:bg-gray-200 tw:dark:hover:bg-white">
            <UserOutlined />
            تیکت‌های من
          </a-button>
          <a-button size="small" :type="quickFilter === 'urgent' ? 'primary' : 'default'"
            @click="setQuickFilter('urgent')"
            class="tw:rounded-md tw:text-[12px] tw:h-7 tw:flex tw:items-center tw:gap-1 tw:hover:bg-gray-200 tw:dark:hover:bg-white">
            <ExclamationCircleOutlined />
            فوری
          </a-button>
          <a-button size="small" :type="quickFilter === 'overdue' ? 'primary' : 'default'"
            @click="setQuickFilter('overdue')"
            class="tw:rounded-md tw:text-[12px] tw:h-7 tw:flex tw:items-center tw:gap-1 tw:hover:bg-gray-200 tw:dark:hover:bg-white">
            <ClockCircleOutlined />
            عقب‌افتاده
          </a-button>
          <a-button size="small" :type="quickFilter === 'pinned' ? 'primary' : 'default'"
            @click="setQuickFilter('pinned')"
            class="tw:rounded-md tw:text-[12px] tw:h-7 tw:flex tw:items-center tw:gap-1 tw:hover:bg-gray-200 tw:dark:hover:bg-white">
            <PushpinOutlined />
            نشان‌شده
          </a-button>
        </div>
      </div>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { ref, watch, h } from "vue";
import { useTicketStore } from "@/stores/ticket";
import dayjs, { Dayjs } from "dayjs";
import {
  FilterOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  PushpinOutlined,
  TableOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons-vue";
import locale from 'ant-design-vue/es/date-picker/locale/fa_IR';
dayjs.locale('fa_IR');
const ticketStore = useTicketStore();

const dateRange = ref<[Dayjs, Dayjs] | null>(null);
const viewMode = ref("table");
const sortBy = ref("created-desc");
const quickFilter = ref("");

const segmentedOptions = [
  { label: "لیست", value: "list", icon: h(UnorderedListOutlined) },
  { label: "کارت", value: "card", icon: h(AppstoreOutlined) },
  { label: "جدول", value: "table", icon: h(TableOutlined) },
];

const emit = defineEmits(["view-mode-change", "sort-change"]);

watch(dateRange, (r) => {
  if (r && r.length === 2) {
    ticketStore.dateRange = [r[0].format("YYYY-MM-DD"), r[1].format("YYYY-MM-DD")];
  } else {
    ticketStore.dateRange = null;
  }
});

const onFilterChange = () => { };

const onDateRangeChange = (r: [Dayjs, Dayjs] | null) => {
  if (r && r.length === 2) {
    ticketStore.dateRange = [r[0].format("YYYY-MM-DD"), r[1].format("YYYY-MM-DD")];
  } else {
    ticketStore.dateRange = null;
  }
};

const onViewModeChange = (mode: string) => {
  emit("view-mode-change", mode);
};
const onSortChange = (s: string) => {
  emit("sort-change", s);
};

const resetAllFilters = () => {
  ticketStore.resetFilters();
  dateRange.value = null;
  quickFilter.value = "";
};

const setQuickFilter = (filter: string) => {
  if (quickFilter.value === filter) {
    quickFilter.value = "";
    resetAllFilters();
    return;
  }
  quickFilter.value = filter;
  switch (filter) {
    case "my-tickets":
      break;
    case "urgent":
      ticketStore.priorityFilter = "critical";
      break;
    case "overdue":
      ticketStore.statusFilter = "open";
      break;
    case "pinned":
      break;
  }
};
</script>

<style>
:root .ant-select-dropdown {
  border-radius: 8px;
}

:root .ant-select-item {
  border-radius: 6px;
  margin: 2px 4px;
}

:root .ant-select-item-option-selected {
  background: #e6f7ff;
}

:root .dark .ant-select-item-option-selected {
  background: #111a2c;
}
</style>
