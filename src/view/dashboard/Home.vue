<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="tw:w-full tw:h-full tw:p-4 tw:sm:p-6 tw:space-y-6 tw:bg-white/60 tw:dark:bg-white/5 tw:backdrop-blur"
  >
    <a-page-header
      :ghost="true"
      class="tw:p-0"
      title="خانهٔ داشبورد"
      sub-title="مرور سریع وضعیت امروز"
    >
      <template #extra>
        <div class="tw:w-full tw:flex tw:flex-wrap tw:gap-2 tw:justify-end">
          <a-segmented v-model:value="range" :options="ranges" style="direction: ltr" />
          <a-button type="primary" :icon="h(PlusOutlined)" @click="onPrimaryAction">
            <span> جدید</span>
          </a-button>
        </div>
      </template>
    </a-page-header>

    <a-row :gutter="[16, 16]">
      <a-col
        v-for="(k, i) in kpis"
        :key="i"
        :xs="k.col.xs"
        :sm="k.col.sm"
        :md="k.col.md"
        :lg="k.col.lg"
        :xl="k.col.xl"
      >
        <a-card :bordered="false" class="stat-card">
          <a-statistic
            :title="k.title"
            :value="k.value"
            :precision="k.precision"
            :suffix="k.suffix"
          />

          <div
            v-if="k.type === 'badge'"
            class="tw:flex tw:items-center tw:gap-2 tw:mt-3"
            :class="k.class"
          >
            <a-badge :status="k.badgeStatus || 'default'" />
            <span class="tw:text-xs sm:tw:text-sm">{{ k.text }}</span>
          </div>

          <div v-else-if="k.type === 'progress'" class="tw:mt-3">
            <a-progress :percent="k.percent || 0" size="small" />
            <div class="tw:text-xs tw:opacity-70 tw:mt-1">{{ k.text }}</div>
          </div>

          <div v-else-if="k.type === 'tag'" class="tw:mt-3">
            <a-tag :color="k.tagColor || 'default'">{{ k.text }}</a-tag>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="16">
        <a-card :bordered="false" title="سفارشات اخیر" :extra="tableExtra">
          <a-table
            :columns="columns"
            :data-source="rows"
            :pagination="{ pageSize: 5 }"
            size="middle"
            row-key="id"
            :scroll="{ x: 640 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'status'">
                <a-tag :color="statusColor(record.status)">{{ record.status }}</a-tag>
              </template>
              <template v-else-if="column.dataIndex === 'amount'">
                <span>{{ intl.format(record.amount) }} تومان</span>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="8">
        <a-card :bordered="false" title="کارهای اخیر">
          <a-timeline>
            <a-timeline-item v-for="(it, i) in timelineItems" :key="i" :color="it.color">
              {{ it.text }}
            </a-timeline-item>
          </a-timeline>

          <a-divider />

          <div class="tw:space-y-3">
            <a-typography-text type="secondary" class="tw:block">اکشن‌های سریع</a-typography-text>

            <div class="tw:flex tw:flex-wrap tw:gap-2">
              <a-button
                v-for="(act, i) in quickActions"
                :key="i"
                :type="act.type || 'default'"
                @click="act.onClick"
              >
                {{ act.label }}
              </a-button>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref } from "vue";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
type Row = {
  id: number;
  customer: string;
  status: "جدید" | "ارسال شده" | "لغو";
  amount: number;
  date: string;
};
type KPICol = { xs: number; sm: number; md: number; lg: number; xl: number };
type KPIItem =
  | {
      title: string;
      value: number;
      precision?: number;
      suffix?: string;
      type: "badge";
      text: string;
      class?: string;
      badgeStatus?: "success" | "processing" | "default" | "warning" | "error";
      col: KPICol;
    }
  | {
      title: string;
      value: number;
      precision?: number;
      suffix?: string;
      type: "progress";
      text: string;
      percent: number;
      col: KPICol;
    }
  | {
      title: string;
      value: number;
      precision?: number;
      suffix?: string;
      type: "tag";
      text: string;
      tagColor?: string;
      col: KPICol;
    };

const kpiCol: KPICol = { xs: 24, sm: 12, md: 12, lg: 6, xl: 6 };

const kpis = ref<KPIItem[]>([
  {
    title: "سفارشات امروز",
    value: 128,
    type: "badge",
    text: "+12% نسبت به دیروز",
    class: "tw:text-green-600",
    badgeStatus: "success",
    col: kpiCol,
  },
  {
    title: "درآمد (تومان)",
    value: 34_200_000,
    precision: 0,
    type: "progress",
    text: "۷۲٪ هدف ماه",
    percent: 72,
    col: kpiCol,
  },
  {
    title: "کاربران فعال",
    value: 912,
    type: "badge",
    text: "آنلاین: ۱۲۰ نفر",
    class: "tw:text-blue-600",
    badgeStatus: "processing",
    col: kpiCol,
  },
  {
    title: "تسک‌های باز",
    value: 18,
    type: "tag",
    text: "اهمیت بالا: ۳",
    tagColor: "orange",
    col: kpiCol,
  },
]);

const ranges = ["این ماه", "این هفته", "امروز"];
const range = ref<string>("امروز");

const rows = ref<Row[]>([
  { id: 241, customer: "علی رضایی", status: "جدید", amount: 820000, date: "1404/06/22" },
  { id: 240, customer: "سارا راد", status: "ارسال شده", amount: 1260000, date: "1404/06/22" },
  { id: 239, customer: "مهدی کریمی", status: "لغو", amount: 460000, date: "1404/06/21" },
  { id: 238, customer: "آرزو محمدی", status: "جدید", amount: 980000, date: "1404/06/21" },
  { id: 237, customer: "بهار کاظمی", status: "ارسال شده", amount: 540000, date: "1404/06/21" },
]);

const columns = [
  { title: "شناسه", dataIndex: "id", key: "id", width: 90 },
  { title: "مشتری", dataIndex: "customer", key: "customer" },
  { title: "وضعیت", dataIndex: "status", key: "status", width: 120 },
  { title: "تاریخ", dataIndex: "date", key: "date", width: 140 },
  { title: "مبلغ", dataIndex: "amount", key: "amount", align: "right", width: 140 },
];
type TimelineItem = {
  color: "green" | "blue" | "red" | "orange" | "gray" | "default";
  text: string;
};
const timelineItems = ref<TimelineItem[]>([
  { color: "green", text: "پرداخت سفارش #241 انجام شد" },
  { color: "blue", text: "کاربر جدید «سارا راد» ثبت نام کرد" },
  { color: "orange", text: "هشدار موجودی برای «کالا A»" },
]);

type QuickBtn = {
  label: string;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  onClick: () => void;
};
const quickActions = ref<QuickBtn[]>([
  { label: "ایجاد سفارش", type: "primary", onClick: () => message.info("ایجاد سفارش") },
  { label: "تعریف کاربر", onClick: () => message.success("تعریف کاربر") },
  { label: "گزارش مالی", onClick: () => message.warning("گزارش مالی") },
]);

const statusColor = (s: Row["status"]) =>
  s === "جدید" ? "blue" : s === "ارسال شده" ? "green" : "red";

const intl = {
  format: (n: number) => new Intl.NumberFormat("fa-IR").format(n),
};

const tableExtra = computed(() =>
  h("div", { class: "tw:flex tw:items-center tw:gap-2" }, [
    h("span", { class: "tw:text-xs tw:opacity-70" }, "۵ مورد آخر"),
    h("div", { class: "tw/w-px tw/h-4 tw/bg-black/10 dark:tw:bg-white/20" }),
    h("button", { class: "tw/text-sm tw:text-primary-600" }, "مشاهده همه"),
  ]),
);

const onPrimaryAction = () => {
  message.info("ایجاد مورد جدید کلیک شد");
};
</script>

<style scoped>
.stat-card {
  border-radius: 16px;
  box-shadow:
    0 8px 22px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.04);
}

.dark .stat-card {
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.35),
    0 2px 8px rgba(0, 0, 0, 0.25);
}
</style>
