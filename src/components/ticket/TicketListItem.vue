<template>
  <div
    class="tw:p-4 tw:w-full tw:border-b tw:border-[#f0f0f0] tw:dark:border-[#434343] tw:transition-all tw:duration-200 tw:ease-out tw:bg-white tw:dark:bg-[#1a1a1a] tw:hover:bg-gray-100 tw:dark:hover:bg-[#262626]"
  >
    <div class="tw:flex tw:justify-between tw:gap-5 tw:mb-3 tw:flex-col tw:md:flex-row">
      <div class="tw:flex-1 tw:min-w-0">
        <div
          class="tw:flex tw:justify-between tw:items-start tw:gap-3 tw:mb-2 tw:flex-col tw:md:flex-row"
        >
          <div class="tw:flex tw:items-center tw:gap-2 tw:flex-1 tw:min-w-0">
            <PushpinOutlined
              v-if="ticket.isPinned"
              class="tw:!text-[#fa8c16] tw:!text-xs tw:!shrink-0"
            />
            <h4
              class="tw:m-0 tw:text-[15px] tw:font-semibold tw:text-[#262626] tw:dark:text-white tw:truncate"
            >
              {{ ticket.title }}
            </h4>
            <span
              class="tw:text-[11px] tw:text-[#8c8c8c] tw:font-mono tw:bg-[#f5f5f5] tw:dark:bg-[#434343] tw:dark:text-[#a0a0a0] tw:px-1.5 tw:py-0.5 tw:rounded tw:shrink-0"
            >
              {{ ticket.ticketCode }}
            </span>
          </div>
          <div class="tw:flex tw:gap-1 tw:flex-wrap tw:shrink-0">
            <a-tag :color="getStatusColor(ticket.status)" size="small">
              <component :is="getStatusIcon(ticket.status)" />
              {{ getStatusText(ticket.status) }}
            </a-tag>
            <a-tag :color="getPriorityColor(ticket.priority)" size="small">
              <component :is="getPriorityIcon(ticket.priority)" />
              {{ getPriorityText(ticket.priority) }}
            </a-tag>
            <a-tag color="blue" size="small">{{ getServiceText(ticket.service) }}</a-tag>
          </div>
        </div>

        <div
          class="tw:text-[13px] tw:leading-snug tw:text-[#595959] tw:dark:text-[#a0a0a0] tw:mb-3"
        >
          {{ truncateText(ticket.description, 150) }}
        </div>

        <div class="tw:flex tw:items-center tw:flex-wrap tw:gap-4">
          <div class="tw:flex tw:items-center tw:gap-1.5 tw:text-[12px] tw:text-[#8c8c8c]">
            <a-avatar
              size="small"
              :style="{ backgroundColor: getAvatarColor(ticket.assignee?.name || 'U') }"
            >
              {{ (ticket.assignee?.name || "U").charAt(0) }}
            </a-avatar>
            <span>{{ ticket.assignee?.name || "نامشخص" }}</span>
          </div>
          <div class="tw:flex tw:items-center tw:gap-1.5 tw:text-[12px] tw:text-[#8c8c8c]">
            <CalendarOutlined />
            <span>{{ formatDate(ticket.createdAt) }}</span>
          </div>
          <div class="tw:flex tw:items-center tw:gap-1.5 tw:text-[12px] tw:text-[#8c8c8c]">
            <ClockCircleOutlined />
            <span
              >{{ formatTime(ticket.timeSpent) }} /
              {{ formatTime(Math.max(0, (ticket.estimatedHours || 0) * 60)) }}</span
            >
          </div>
        </div>
      </div>

      <div class="tw:flex tw:flex-col tw:gap-3 tw:min-w-[200px] tw:md:min-w-[220px] tw:shrink-0">
        <div class="tw:flex tw:flex-col tw:gap-1">
          <div class="tw:flex tw:justify-between tw:items-center">
            <span class="tw:text-[12px] tw:text-[#8c8c8c]">پیشرفت</span>
            <span class="tw:text-[12px] tw:font-medium tw:text-[#1890ff]"
              >{{ Math.round(getTimeProgress()) }}%</span
            >
          </div>
          <a-progress
            :percent="getTimeProgress()"
            :stroke-color="getProgressColor()"
            size="small"
            :show-info="false"
          />
          <div class="tw:text-[11px] tw:text-[#fa8c16] tw:text-center">
            {{
              formatTime(Math.max(0, (ticket.estimatedHours || 0) * 60 - (ticket.timeSpent || 0)))
            }}
            باقی‌مانده
          </div>
        </div>

        <div class="tw:flex tw:items-center tw:justify-end tw:gap-2 tw:md:justify-end">
          <a-button
            v-if="ticket.isTimerActive"
            type="primary"
            danger
            size="small"
            @click.stop="toggleTimer"
            class="tw:rounded-md tw:text-[11px] tw:h-7 tw:flex tw:items-center tw:gap-1 tw:hover:bg-gray-200 tw:hovdark:er:bg-white tw:animate-pulse"
          >
            <PauseCircleOutlined />
            توقف
          </a-button>
          <a-button
            v-else
            type="primary"
            size="small"
            @click.stop="toggleTimer"
            class="tw:rounded-md tw:text-[11px] tw:h-7 tw:flex tw:items-center tw:gap-1 tw:hover:bg-gray-200 tw:hovdark:er:bg-white"
          >
            <PlayCircleOutlined />
            شروع
          </a-button>

          <a-dropdown :trigger="['click']" @click.stop>
            <a-button
              type="text"
              size="small"
              class="tw:hover:bg-gray-200 tw:hovdark:er:bg-white tw:rounded-md"
            >
              <MoreOutlined />
            </a-button>
            <template #overlay>
              <a-menu @click="handleMenuAction">
                <a-menu-item key="view">
                  <EyeOutlined />
                  مشاهده
                </a-menu-item>
                <a-menu-item key="edit">
                  <EditOutlined />
                  ویرایش
                </a-menu-item>
                <a-menu-item key="pin">
                  <PushpinOutlined />
                  {{ !ticket.isPinned ? "حذف نشان" : "نشان کردن" }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>

    <div
      v-if="(ticket.tags?.length || 0) > 0"
      class="tw:flex tw:items-center tw:flex-wrap tw:gap-1.5 tw:pt-2 tw:border-t tw:border-[#f5f5f5] tw:dark:border-[#434343]"
    >
      <a-tag
        v-for="tag in (ticket.tags || []).slice(0, 4)"
        :key="tag"
        size="small"
        class="tw:text-[10px] tw:rounded"
      >
        {{ tag }}
      </a-tag>
      <span
        v-if="(ticket.tags?.length || 0) > 4"
        class="tw:text-[10px] tw:text-[#8c8c8c] tw:bg-[#f5f5f5] tw:dark:bg-[#434343] tw:dark:text-[#a0a0a0] tw:px-1 tw:py-0.5 tw:rounded"
      >
        +{{ (ticket.tags?.length || 0) - 4 }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTicketStore } from "@/stores/ticket";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import type { Ticket } from "@/types/ticket";
import {
  PushpinOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  IssuesCloseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FlagOutlined,
} from "@ant-design/icons-vue";

interface Props {
  ticket: Ticket;
}
const props = defineProps<Props>();
const ticketStore = useTicketStore();

const getStatusColor = (status: string) =>
  (({ open: "green", "in-progress": "orange", closed: "default" }) as Record<string, string>)[
    status
  ] || "default";
const getStatusIcon = (status: string) =>
  (
    ({
      open: IssuesCloseOutlined,
      "in-progress": ClockCircleOutlined,
      closed: CheckCircleOutlined,
    }) as Record<string, unknown>
  )[status] || IssuesCloseOutlined;
const getStatusText = (s: string) =>
  (({ open: "باز", "in-progress": "در حال انجام", closed: "بسته" }) as Record<string, string>)[s] ||
  s;
const getPriorityColor = (p: string) =>
  (({ low: "green", medium: "orange", high: "red", critical: "purple" }) as Record<string, string>)[
    p
  ] || "default";
const getPriorityIcon = (p: string) =>
  p === "critical" || p === "high" ? ExclamationCircleOutlined : FlagOutlined;
const getPriorityText = (p: string) =>
  (({ low: "پایین", medium: "متوسط", high: "بالا", critical: "حیاتی" }) as Record<string, string>)[
    p
  ] || p;
const getServiceText = (s: string) =>
  (
    ({
      technical: "فنی",
      billing: "مالی",
      general: "عمومی",
      "bug-report": "گزارش باگ",
      "feature-request": "درخواست ویژگی",
    }) as Record<string, string>
  )[s] || s;
const getAvatarColor = (name: string) =>
  ["#1890ff", "#52c41a", "#fa8c16", "#eb2f96", "#722ed1", "#13c2c2"][
    (name || "U").charCodeAt(0) % 6
  ];

const formatTime = (minutes: number) => {
  const safe = Math.max(0, Math.floor(minutes || 0));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
};

const formatDate = (d: string) => (dayjs(d).isValid() ? dayjs(d).format("YYYY/MM/DD") : "-");
const truncateText = (t: string, n: number) => (!t ? "" : t.length > n ? t.slice(0, n) + "..." : t);

const getTimeProgress = () => {
  const est = Math.max(0, (props.ticket.estimatedHours || 0) * 60);
  if (!est) return 0;
  return Math.min(100, ((props.ticket.timeSpent || 0) / est) * 100);
};
const getProgressColor = () => {
  const p = getTimeProgress();
  if (p >= 90) return "#ff4d4f";
  if (p >= 70) return "#fa8c16";
  return "#52c41a";
};

const handleMenuAction = ({ key }: { key: string }) => {
  switch (key) {
    case "view":
      ticketStore.openTicketDrawer?.(props.ticket);
      break;
    case "edit":
      message.info("صفحه ویرایش باز می‌شود");
      break;
    case "pin":
      ticketStore.togglePinTicket(props.ticket.id);
      message.success(props.ticket.isPinned ? "نشان حذف شد" : "تیکت نشان شد");
      break;
  }
};

const toggleTimer = () => {
  ticketStore.toggleTimer(props.ticket.id);
  message.success(!props.ticket.isTimerActive ? "زمان‌سنج متوقف شد" : "زمان‌سنج شروع شد");
};
</script>
