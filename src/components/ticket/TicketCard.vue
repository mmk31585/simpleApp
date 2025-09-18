<template>
  <a-card
    class="tw:relative tw:h-full tw:rounded-xl tw:!border tw:!border-[#f0f0f0] tw:dark:!border-[#434343] tw:transition-all tw:duration-300 tw:ease-out tw:hover:shadow-lg tw:hover:shadow-[#1890ff] tw:hover:-translate-y-1  tw:hover:!border-[#1890ff] tw:dark:!bg-[#1a1a1a] group"
    :class="{
      'tw:!border-[#fa8c16] tw:!bg-gradient-to-br tw:from-[#fff7e6] tw:to-white tw:dark:from-[#2b1d00] tw:dark:to-[#1a1a1a]':
        ticket.isPinned,
    }" :body-style="{ padding: '16px' }" blehovera>
    <!-- Card Header -->
    <div class="tw:flex tw:justify-between tw:items-start tw:mb-3">
      <div class="tw:flex tw:flex-col tw:gap-1">
        <div class="tw:flex tw:items-center tw:gap-1.5 tw:mb-1">
          <PushpinOutlined v-if="ticket.isPinned" class="tw:text-xs tw:text-[#fa8c16]" />
          <h4 class="tw:m-0 tw:text-[15px] tw:font-semibold tw:leading-tight tw:text-[#262626] tw:dark:text-white">
            {{ ticket.title }}
          </h4>
        </div>
        <div
          class="tw:text-[11px] tw:text-[#8c8c8c] tw:font-mono tw:bg-[#f5f5f5] tw:dark:bg-[#434343] tw:dark:text-[#a0a0a0] tw:px-1.5 tw:py-0.5 tw:rounded">
          {{ ticket.ticketCode }}
        </div>
      </div>

      <a-dropdown :trigger="['click']" @click.stop>
        <a-button type="text" size="small" class="tw:!opacity-0 tw:group-hover:!opacity-100 tw:transition-opacity">
          <MoreOutlined />
        </a-button>
        <template #overlay>
          <a-menu @click="handleMenuAction">
            <a-menu-item key="pin">
              <PushpinOutlined />
              {{ ticket.isPinned ? "حذف نشان" : "نشان کردن" }}
            </a-menu-item>
            <a-menu-item key="edit">
              <EditOutlined />
              ویرایش
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="delete" danger>
              <DeleteOutlined />
              حذف
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <!-- Status & Priority Tags -->
    <div class="tw:flex tw:flex-wrap tw:gap-1.5 tw:mb-3">
      <a-tag :color="getStatusColor(ticket.status)"
        class="tw:flex tw:items-center tw:gap-1 tw:text-[11px] tw:font-medium tw:rounded-md">
        <component :is="getStatusIcon(ticket.status)" />
        {{ getStatusText(ticket.status) }}
      </a-tag>
      <a-tag :color="getPriorityColor(ticket.priority)"
        class="tw:flex tw:items-center tw:gap-1 tw:text-[11px] tw:font-medium tw:rounded-md">
        <component :is="getPriorityIcon(ticket.priority)" />
        {{ getPriorityText(ticket.priority) }}
      </a-tag>
    </div>

    <!-- Description -->
    <div class="tw:mb-4">
      <p class="tw:m-0 tw:text-[13px] tw:leading-snug tw:text-[#595959] tw:dark:text-[#a0a0a0]">
        {{ truncateText(ticket.description, 120) }}
      </p>
    </div>

    <!-- Time Tracking -->
    <div class="tw:mb-4 tw:p-3 tw:bg-[#fafafa] tw:dark:bg-[#262626] tw:rounded-lg">
      <div class="tw:flex tw:justify-between tw:items-center tw:mb-1.5">
        <div class="tw:flex tw:items-center tw:gap-1 tw:text-[12px]">
          <span class="tw:font-semibold tw:text-[#1890ff]">{{ formatTime(ticket.timeSpent) }}</span>
          <span class="tw:text-[#d9d9d9]">/</span>
          <span class="tw:text-[#8c8c8c]">{{
            formatTime(Math.max(0, (ticket.estimatedHours || 0) * 60))
            }}</span>
        </div>
        <div class="tw:text-[11px] tw:text-[#fa8c16]">
          {{
            formatTime(Math.max(0, (ticket.estimatedHours || 0) * 60 - (ticket.timeSpent || 0)))
          }}
          باقی‌مانده
        </div>
      </div>
      <a-progress :percent="getTimeProgress()" :stroke-color="getProgressColor()" :trail-color="'#f0f0f0'" size="small"
        :show-info="false" class="tw:m-0" />
    </div>

    <!-- Card Footer -->
    <div class="tw:flex tw:justify-between tw:items-center tw:mb-3">
      <div class="tw:flex tw:flex-col tw:gap-1.5">
        <div class="tw:flex tw:items-center tw:gap-1.5">
          <a-avatar size="small" :style="{ backgroundColor: getAvatarColor(ticket.assignee?.name || 'U') }">
            {{ (ticket.assignee?.name || "U").charAt(0) }}
          </a-avatar>
          <span class="tw:text-[12px] tw:text-[#595959] tw:dark:text-[#a0a0a0]">{{
            ticket.assignee?.name || "نامشخص"
            }}</span>
        </div>

        <div class="tw:flex tw:items-center tw:gap-1 tw:text-[11px] tw:text-[#8c8c8c]">
          <CalendarOutlined class="tw:text-[10px]" />
          <span>{{ formatDate(ticket.createdAt) }}</span>
        </div>
      </div>

      <div>
        <a-button v-if="ticket.isTimerActive" type="primary" danger size="small" @click.stop="toggleTimer"
          class="tw:rounded-md tw:text-[11px] tw:h-7 tw:flex tw:items-center tw:gap-1 tw:animate-pulse">
          <PauseCircleOutlined />
          توقف
        </a-button>
        <a-button v-else type="primary" size="small" @click.stop="toggleTimer"
          class="tw:rounded-md tw:text-[11px] tw:h-7 tw:flex tw:items-center tw:gap-1">
          <PlayCircleOutlined />
          شروع
        </a-button>
      </div>
    </div>

    <!-- Service Badge -->
    <div class="tw:absolute tw:top-2 tw:left-2">
      <a-tag size="small" color="blue">{{ getServiceText(ticket.service) }}</a-tag>
    </div>

    <!-- Tags -->
    <div v-if="(ticket.tags?.length || 0) > 0" class="tw:flex tw:flex-wrap tw:items-center tw:gap-1">
      <a-tag v-for="tag in (ticket.tags || []).slice(0, 3)" :key="tag" size="small" class="tw:text-[10px] tw:rounded">
        {{ tag }}
      </a-tag>
      <span v-if="(ticket.tags?.length || 0) > 3"
        class="tw:text-[10px] tw:text-[#8c8c8c] tw:bg-[#f5f5f5] tw:dark:bg-[#434343] tw:dark:text-[#a0a0a0] tw:px-1 tw:py-0.5 tw:rounded">
        +{{ (ticket.tags?.length || 0) - 3 }}
      </span>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { useTicketStore } from "@/stores/ticket";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import type { Ticket } from "@/types/ticket";
import {
  PushpinOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CalendarOutlined,
  IssuesCloseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FlagOutlined,
} from "@ant-design/icons-vue";

interface Props {
  ticket: Ticket;
}

const props = defineProps<Props>();
const ticketStore = useTicketStore();

// Helper functions
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    open: "green",
    "in-progress": "orange",
    closed: "default",
  };
  return colors[status] || "default";
};

const getStatusIcon = (status: string) => {
  const icons: Record<string, unknown> = {
    open: IssuesCloseOutlined,
    "in-progress": ClockCircleOutlined,
    closed: CheckCircleOutlined,
  };
  return icons[status] || IssuesCloseOutlined;
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    open: "باز",
    "in-progress": "در حال انجام",
    closed: "بسته",
  };
  return texts[status] || status;
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    low: "green",
    medium: "orange",
    high: "red",
    critical: "purple",
  };
  return colors[priority] || "default";
};

const getPriorityIcon = (priority: string) => {
  return priority === "critical" || priority === "high" ? ExclamationCircleOutlined : FlagOutlined;
};

const getPriorityText = (priority: string) => {
  const texts: Record<string, string> = {
    low: "پایین",
    medium: "متوسط",
    high: "بالا",
    critical: "حیاتی",
  };
  return texts[priority] || priority;
};

const getServiceText = (service: string) => {
  const texts: Record<string, string> = {
    technical: "فنی",
    billing: "مالی",
    general: "عمومی",
    "bug-report": "گزارش باگ",
    "feature-request": "درخواست ویژگی",
  };
  return texts[service] || service;
};

const getAvatarColor = (name: string) => {
  const colors = ["#1890ff", "#52c41a", "#fa8c16", "#eb2f96", "#722ed1", "#13c2c2"];
  const ch = (name || "U").charCodeAt(0);
  return colors[ch % colors.length];
};

const formatTime = (minutes: number) => {
  const safe = Math.max(0, Math.floor(minutes || 0));
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  return `${hours}:${mins.toString().padStart(2, "0")}`;
};

const formatDate = (dateString: string) => {
  return dayjs(dateString).isValid() ? dayjs(dateString).format("MM/DD") : "-";
};

const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const getTimeProgress = () => {
  const estimatedMinutes = Math.max(0, (props.ticket.estimatedHours || 0) * 60);
  if (!estimatedMinutes) return 0;
  return Math.min(100, ((props.ticket.timeSpent || 0) / estimatedMinutes) * 100);
};

const getProgressColor = () => {
  const progress = getTimeProgress();
  if (progress >= 90) return "#ff4d4f";
  if (progress >= 70) return "#fa8c16";
  return "#52c41a";
};

// Event handlers
const handleMenuAction = ({ key }: { key: string }) => {
  switch (key) {
    case "pin":
      ticketStore.togglePinTicket(props.ticket.id);
      message.success(props.ticket.isPinned ? "نشان حذف شد" : "تیکت نشان شد");
      break;
    case "edit":
      message.info("صفحه ویرایش باز می‌شود");
      break;
    case "delete":
      // اگر متد حذف در استور موجود است، از آن استفاده کنید
      // ;(ticketStore as any).deleteTicket?.(props.ticket.id)
      message.error("تیکت حذف شد");
      break;
  }
};

const toggleTimer = () => {
  ticketStore.toggleTimer(props.ticket.id);
  message.success(!props.ticket.isTimerActive ? "زمان‌سنج متوقف شد" : "زمان‌سنج شروع شد");
};
</script>
