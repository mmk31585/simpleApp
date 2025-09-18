<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="tw:w-full tw:h-full tw:p-4 sm:tw:p-6 tw:space-y-6 tw:bg-white/60 tw:dark:bg-white/5 tw:backdrop-blur"
  >
    <a-page-header :ghost="true" class="tw:p-0" title="آنالیز" sub-title="نمای کلی عملکرد">
      <template #extra>
        <a-segmented
          v-model:value="granularity"
          :options="['ماهانه', 'هفتگی', 'روزانه']"
          style="direction: ltr"
        />
        <a-select v-model:value="channel" style="min-width: 140px">
          <a-select-option value="all">همه کانال‌ها</a-select-option>
          <a-select-option value="organic">ارگانیک</a-select-option>
          <a-select-option value="ads">تبلیغات</a-select-option>
          <a-select-option value="referral">ارجاعی</a-select-option>
        </a-select>
        <a-range-picker v-model:value="range" :allowClear="false" style="direction: ltr" />
      </template>
    </a-page-header>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :xl="6">
        <a-card :bordered="false" class="kpi-card">
          <div class="tw:flex tw:items-start tw:justify-between">
            <a-statistic title="درآمد" :value="fmt.money(kpis.revenue.value)" />
            <a-tag color="green">+{{ kpis.revenue.delta }}%</a-tag>
          </div>
          <Sparkline class="tw:mt-5" :points="kpis.revenue.spark" color="var(--primary, #3b82f6)" />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :xl="6">
        <a-card :bordered="false" class="kpi-card">
          <div class="tw:flex tw:items-start tw:justify-between">
            <a-statistic title="نرخ تبدیل" :value="kpis.cvRate.value" :precision="2" suffix="%" />
            <a-tag :color="kpis.cvRate.delta >= 0 ? 'green' : 'red'">
              {{ kpis.cvRate.delta >= 0 ? "+" : "" }}{{ kpis.cvRate.delta }}%
            </a-tag>
          </div>
          <Sparkline class="tw:mt-5" :points="kpis.cvRate.spark" color="#10b981" />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :xl="6">
        <a-card :bordered="false" class="kpi-card">
          <div class="tw:flex tw:items-start tw:justify-between">
            <a-statistic title="میانگین سبد" :value="fmt.money(kpis.aov.value)" />
            <a-tag color="blue">+{{ kpis.aov.delta }}%</a-tag>
          </div>
          <Sparkline class="tw:mt-5" :points="kpis.aov.spark" color="#6366f1" />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :xl="6">
        <a-card :bordered="false" class="kpi-card">
          <div class="tw:flex tw:items-start tw:justify-between">
            <a-statistic title="بانس‌ریت" :value="kpis.bounce.value" :precision="1" suffix="%" />
            <a-tag color="red">-{{ Math.abs(kpis.bounce.delta) }}%</a-tag>
          </div>
          <Sparkline class="tw:mt-5" :points="kpis.bounce.spark" color="#ef4444" />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :xl="16">
        <a-card :bordered="false" title="ترند ترافیک و تبدیل">
          <a-tabs v-model:activeKey="activeTab" style="direction: ltr">
            <a-tab-pane key="traffic" tab="ترافیک">
              <div class="tw:grid tw:grid-cols-12 tw:gap-2 tw:h-44">
                <div
                  v-for="(v, i) in trafficBars"
                  :key="i"
                  class="tw:col-span-1 tw:flex tw:items-end"
                >
                  <div
                    class="tw:w-full tw:rounded-md tw:bg-gradient-to-t tw:from-blue-500/30 tw:to-blue-500"
                    :style="{ height: v + '%' }"
                  />
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="conversions" tab="تبدیل">
              <div class="tw:grid tw:grid-cols-12 tw:gap-2 tw:h-44">
                <div v-for="(v, i) in convBars" :key="i" class="tw:col-span-1 tw:flex tw:items-end">
                  <div
                    class="tw:w-full tw:rounded-md tw:bg-gradient-to-t tw:from-emerald-500/30 tw:to-emerald-500"
                    :style="{ height: v + '%' }"
                  />
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>

      <a-col :xs="24" :xl="8">
        <a-card :bordered="false" title="منابع ترافیک">
          <div class="tw:space-y-4">
            <div v-for="s in sources" :key="s.name" class="tw:flex tw:items-center tw:gap-3">
              <a-avatar :style="{ background: s.color }" size="small">{{ s.short }}</a-avatar>
              <div class="tw:flex-1">
                <div class="tw:text-sm tw:font-medium">{{ s.name }}</div>
                <a-progress :percent="s.percent" :show-info="false" />
              </div>
              <div class="tw:text-right tw:w-16 tw:text-sm tw:opacity-70">{{ s.percent }}%</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card :bordered="false" title="برترین صفحات" :extra="pagesExtra">
          <a-table
            :columns="pageColumns"
            :data-source="topPages"
            :pagination="{ pageSize: 5 }"
            size="middle"
            row-key="path"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'ctr'">
                <a-progress
                  :percent="record.ctr"
                  size="small"
                  :status="record.ctr > 3 ? 'active' : 'normal'"
                />
              </template>
              <template v-else-if="column.dataIndex === 'views'">
                {{ fmt.num(record.views) }}
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref } from "vue";
import type dayjs from "dayjs";

const Sparkline = defineComponent({
  name: "Sparkline",
  props: {
    points: { type: Array as () => number[], required: true },
    color: { type: String, default: "#3b82f6" },
    height: { type: Number, default: 36 },
  },
  setup(props) {
    const path = computed(() => {
      const pts = props.points;
      if (!pts.length) return "";
      const max = Math.max(...pts);
      const min = Math.min(...pts);
      const norm = (v: number) => {
        if (max === min) return props.height / 2;
        return props.height - ((v - min) / (max - min)) * props.height;
      };
      return pts.map((v, i) => `${i === 0 ? "M" : "L"} ${i * 20} ${norm(v)}`).join(" ");
    });
    const width = computed(() => (props.points.length - 1) * 20 || 40);
    return () =>
      h("svg", { width: width.value, height: props.height, style: "display:block" }, [
        h("defs", [
          h("linearGradient", { id: "sg", x1: "0", y1: "0", x2: "0", y2: "1" }, [
            h("stop", { offset: "0%", "stop-color": props.color, "stop-opacity": 0.9 }),
            h("stop", { offset: "100%", "stop-color": props.color, "stop-opacity": 0.2 }),
          ]),
        ]),
        h("path", { d: path.value, fill: "none", stroke: props.color, "stroke-width": 2 }),
        h("path", {
          d: path.value + ` L ${width.value} ${props.height} L 0 ${props.height} Z`,
          fill: "url(#sg)",
          stroke: "none",
        }),
      ]);
  },
});

const granularity = ref<"روزانه" | "هفتگی" | "ماهانه">("روزانه");
const channel = ref<"all" | "organic" | "ads" | "referral">("all");
const range = ref<[dayjs.Dayjs, dayjs.Dayjs] | []>([]);
const activeTab = ref<"traffic" | "conversions">("traffic");

const rand = (n = 8, base = 50, amp = 40) =>
  Array.from({ length: n }, () => Math.round(base + (Math.random() - 0.5) * amp * 2));

const kpis = computed(() => ({
  revenue: { value: 34200000, delta: 12, spark: rand(10, 60, 25) },
  cvRate: { value: 3.42, delta: 4, spark: rand(10, 50, 20) },
  aov: { value: 375000, delta: 8, spark: rand(10, 55, 22) },
  bounce: { value: 38.7, delta: -3, spark: rand(10, 45, 18) },
}));

const trafficBars = computed(() => rand(12, 60, 35));
const convBars = computed(() => rand(12, 45, 25));

const sources = computed(() => [
  { name: "ارگانیک", short: "O", percent: 48, color: "#10b981" },
  { name: "تبلیغات", short: "A", percent: 32, color: "#f59e0b" },
  { name: "ارجاعی", short: "R", percent: 12, color: "#6366f1" },
  { name: "سوشال", short: "S", percent: 8, color: "#0ea5e9" },
]);

type PageRow = { path: string; title: string; views: number; ctr: number };
const topPages = ref<PageRow[]>([
  { path: "/products", title: "محصولات", views: 26400, ctr: 4.2 },
  { path: "/pricing", title: "قیمت‌ها", views: 18210, ctr: 3.1 },
  { path: "/blog", title: "وبلاگ", views: 15340, ctr: 2.4 },
  { path: "/contact", title: "تماس با ما", views: 9800, ctr: 3.7 },
  { path: "/about", title: "درباره ما", views: 8200, ctr: 1.9 },
]);

const pageColumns = [
  { title: "صفحه", dataIndex: "title", key: "title" },
  { title: "آدرس", dataIndex: "path", key: "path", width: 180 },
  { title: "بازدید", dataIndex: "views", key: "views", width: 140, align: "right" },
  { title: "CTR", dataIndex: "ctr", key: "ctr", width: 180 },
];

const pagesExtra = computed(() =>
  h("div", { class: "tw:text-xs tw:opacity-70" }, "۵ صفحهٔ برتر بر اساس بازدید"),
);

const fmt = {
  money: (n: number) => new Intl.NumberFormat("fa-IR").format(n),
  num: (n: number) => new Intl.NumberFormat("fa-IR").format(n),
};
</script>

<style scoped>
.kpi-card {
  border-radius: 16px;
  box-shadow:
    0 8px 22px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.04);
}

.dark .kpi-card {
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.35),
    0 2px 8px rgba(0, 0, 0, 0.25);
}
</style>
