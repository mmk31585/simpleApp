<template>
  <div class="tw:mb-6">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :lg="6" v-for="card in summaryData" :key="card.key">
        <a-card
          :body-style="{ padding: '20px' }"
          class="tw:rounded-xl tw:border tw:border-[#f0f0f0] tw:dark:border-[#434343] tw:transition-all tw:duration-300 tw:overflow-hidden tw:relative tw:bg-white tw:dark:bg-[#1a1a1a] hover:tw:-translate-y-1 hover:tw:shadow-2xl tw:cursor-pointer focus-within:tw:ring-2 focus-within:tw:ring-[#1890ff]"
          :class="card.cardClass"
          :tabindex="0"
          :aria-label="`کارت ${card.title}`"
          :title="`اعمال فیلتر: ${card.title}`"
          @click="handleCardClick(card.key)"
          @keydown.enter.prevent="handleCardClick(card.key)"
          @keydown.space.prevent="handleCardClick(card.key)"
        >
          <div class="tw:flex tw:justify-between tw:items-start tw:mb-4">
            <div class="tw:min-w-0 tw:flex-1">
              <a-statistic
                :title="card.title"
                :value="card.value"
                :value-style="{ color: card.valueColor, fontSize: '28px', fontWeight: '600' }"
              />
              <div class="tw:text-[#8c8c8c] tw:dark:text-[#999] tw:text-[12px] tw:mt-1 tw:truncate">
                {{ card.description }}
              </div>
            </div>
            <div
              class="tw:w-12 tw:h-12 tw:rounded-xl tw:flex tw:items-center tw:justify-center tw:text-2xl tw:opacity-80"
              :class="card.iconClass"
            >
              <component :is="card.icon" />
            </div>
          </div>

          <div v-if="card.showProgress" class="tw:mb-3">
            <a-progress
              :percent="card.progressPercent"
              :stroke-color="card.progressColor"
              :show-info="false"
              size="small"
            />
            <div
              class="tw:flex tw:justify-between tw:text-[11px] tw:text-[#8c8c8c] tw:dark:text-[#999] tw:mt-1"
            >
              <span>{{ card.progressText }}</span>
              <span>{{ card.progressPercent }}%</span>
            </div>
          </div>

          <div v-if="card.trend" class="tw:flex tw:items-center tw:gap-2">
            <div
              class="tw:flex tw:items-center tw:gap-1 tw:text-[12px] tw:font-medium tw:px-1.5 tw:py-0.5 tw:rounded"
              :class="card.trend.class"
            >
              <component :is="card.trend.icon" />
              <span>{{ card.trend.value }}%</span>
            </div>
            <span class="tw:text-[11px] tw:text-[#8c8c8c] tw:dark:text-[#999]">{{
              card.trend.text
            }}</span>
          </div>

          <div
            class="tw:absolute tw:inset-0 tw:pointer-events-none tw:opacity-0 hover:tw:opacity-100 tw:transition-opacity tw:duration-300 tw:bg-gradient-to-br tw:from-transparent tw:to-white/10 tw:dark:to-white/5"
          />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTicketStore } from "@/stores/ticket";
import {
  IssuesCloseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons-vue";

const ticketStore = useTicketStore();

const summaryData = computed(() => {
  const counts = ticketStore.ticketCounts || { total: 0, open: 0, "in-progress": 0, closed: 0 };
  const total = Math.max(0, counts.total || 0);
  const pct = (n: number) => (total > 0 ? Math.round((Math.max(0, n || 0) / total) * 100) : 0);

  return [
    {
      key: "open",
      title: "تیکت‌های باز",
      value: Math.max(0, counts.open || 0),
      description: "تیکت‌های در انتظار بررسی",
      icon: IssuesCloseOutlined,
      valueColor: "#52c41a",
      showProgress: true,
      progressPercent: pct(counts.open),
      progressColor: "#52c41a",
      progressText: "از کل تیکت‌ها",
      iconClass: "tw:bg-gradient-to-br tw:from-[#52c41a] tw:to-[#73d13d] tw:text-white",
      cardClass: "tw:border-t-[3px] tw:border-[#52c41a]",
    },
    {
      key: "in-progress",
      title: "در حال انجام",
      value: Math.max(0, counts["in-progress"] || 0),
      description: "تیکت‌های در دست اقدام",
      icon: ClockCircleOutlined,
      valueColor: "#fa8c16",
      showProgress: true,
      progressPercent: pct(counts["in-progress"]),
      progressColor: "#fa8c16",
      progressText: "از کل تیکت‌ها",
      iconClass: "tw:bg-gradient-to-br tw:from-[#fa8c16] tw:to-[#ffa940] tw:text-white",
      cardClass: "tw:border-t-[3px] tw:border-[#fa8c16]",
    },
    {
      key: "closed",
      title: "تیکت‌های بسته",
      value: Math.max(0, counts.closed || 0),
      description: "تیکت‌های حل شده",
      icon: CheckCircleOutlined,
      valueColor: "#8c8c8c",
      showProgress: true,
      progressPercent: pct(counts.closed),
      progressColor: "#8c8c8c",
      progressText: "از کل تیکت‌ها",
      iconClass: "tw:bg-gradient-to-br tw:from-[#8c8c8c] tw:to-[#bfbfbf] tw:text-white",
      cardClass: "tw:border-t-[3px] tw:border-[#8c8c8c]",
    },
    {
      key: "total",
      title: "کل تیکت‌ها",
      value: total,
      description: "مجموع تمام تیکت‌ها",
      icon: ExclamationCircleOutlined,
      valueColor: "#1890ff",
      showProgress: false,
      iconClass: "tw:bg-gradient-to-br tw:from-[#1890ff] tw:to-[#40a9ff] tw:text-white",
      cardClass: "tw:border-t-[3px] tw:border-[#1890ff]",
      trend: {
        type: "down",
        icon: ArrowDownOutlined,
        value: "3",
        text: "نسبت به هفته گذشته",
        class: "tw:text-[#ff4d4f] tw:bg-[#fff2f0] tw:dark:bg-[rgba(255,77,79,0.15)]",
      },
    },
  ];
});

const handleCardClick = (key: string) => {
  switch (key) {
    case "open":
      ticketStore.statusFilter = "open";
      break;
    case "in-progress":
      ticketStore.statusFilter = "in-progress";
      break;
    case "closed":
      ticketStore.statusFilter = "closed";
      break;
    case "total":
      ticketStore.resetFilters();
      break;
  }
};
</script>

<style></style>
