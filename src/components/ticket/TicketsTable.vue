<template>
  <div class="tw:bg-white tw:dark:bg-[#1a1a1a] tw:rounded-xl tw:shadow-md tw:overflow-hidden">
    <div v-if="selectedRowKeys.length > 0"
      class="tw:flex tw:items-center tw:gap-4 tw:px-6 tw:py-3 tw:bg-[#fafafa] tw:dark:bg-[#262626] tw:border-b tw:border-[#f0f0f0] tw:dark:border-[#434343]">
      <span class="tw:font-medium tw:text-[#1890ff]">{{ selectedRowKeys.length }} تیکت انتخاب شده</span>
      <a-button-group>
        <a-button @click="handleBulkStatusUpdate('in-progress')"
          class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md">
          <PlayCircleOutlined />
          شروع
        </a-button>
        <a-button @click="handleBulkStatusUpdate('closed')"
          class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md">
          <CheckCircleOutlined />
          بستن
        </a-button>
        <a-dropdown :trigger="['click']">
          <a-button class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md">
            <MoreOutlined />
            بیشتر
          </a-button>
          <template #overlay>
            <a-menu @click="handleBulkAction">
              <a-menu-item key="assign">
                <UserOutlined /> تخصیص دسته‌ای
              </a-menu-item>
              <a-menu-item key="priority">
                <FlagOutlined /> تغییر اولویت
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="export">
                <DownloadOutlined /> خروجی Excel
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-button-group>
    </div>

    <div class="tw:overflow-x-auto">
      <a-table size="small" :columns="columns" :data-source="ticketStore.filteredTickets" :row-key="rowKey"
        :row-selection="rowSelection" :pagination="pagination" :scroll="{ x: 1100 }" tableLayout="fixed"
        :customRow="customRow"
        :rowClassName="() => 'tw:cursor-pointer hover:tw:bg-[#e6f7ff] tw:dark:hover:bg-[#111a2c]'"
        class="tw:rounded-none">
        <!-- Title -->
        <template #title="{ record }">
          <div class="tw:max-w-[280px]">
            <div class="tw:flex tw:flex-col tw:gap-1">
              <a-tooltip :title="record?.title">
                <div class="tw:flex tw:items-center tw:gap-2 tw:font-medium tw:leading-5">
                  <PushpinOutlined v-if="record?.isPinned" class="tw:text-[#fa8c16] tw:text-xs" />
                  <span class="tw:truncate">{{ record?.title }}</span>
                </div>
              </a-tooltip>
              <div class="tw:flex tw:items-center tw:gap-2 tw:flex-wrap">
                <span class="tw:text-[12px] tw:text-[#8c8c8c] tw:font-mono tw:truncate">{{
                  record?.ticketCode
                }}</span>
                <a-tag size="small" v-for="tag in (record?.tags ?? []).slice(0, 2)" :key="tag">{{
                  tag
                }}</a-tag>
              </div>
            </div>
          </div>
        </template>

        <!-- Status -->
        <template #status="{ record }">
          <a-tag :color="getStatusColor(record?.status)"
            class="tw:flex tw:items-center tw:gap-1 tw:text-[12px] tw:font-medium">
            <component :is="getStatusIcon(record?.status)" />
            <span class="tw:truncate">{{ getStatusText(record?.status) }}</span>
          </a-tag>
        </template>

        <!-- Priority -->
        <template #priority="{ record }">
          <a-tag :color="getPriorityColor(record?.priority)"
            class="tw:flex tw:items-center tw:gap-1 tw:text-[12px] tw:font-medium">
            <component :is="getPriorityIcon(record?.priority)" />
            <span class="tw:truncate">{{ getPriorityText(record?.priority) }}</span>
          </a-tag>
        </template>

        <!-- Assignee -->
        <template #assignee="{ record }">
          <div class="tw:flex tw:items-center tw:gap-2 tw:min-w-0">
            <a-avatar size="small" :style="{ backgroundColor: getAvatarColor(record?.assignee?.name || 'U') }">
              {{ (record?.assignee?.name || "U").charAt(0) }}
            </a-avatar>
            <span class="tw:text-[13px] tw:truncate">{{ record?.assignee?.name || "نامشخص" }}</span>
          </div>
        </template>

        <!-- Time Tracking -->
        <template #timeTracking="{ record }">
          <div class="tw:flex tw:flex-col tw:gap-1 tw:w-full">
            <a-progress :percent="getTimeProgress(record)" size="small" :stroke-color="getTimeProgressColor(record)"
              :show-info="false" />
            <div class="tw:flex tw:justify-between tw:text-[11px] tw:text-[#8c8c8c]">
              <span class="tw:font-medium">{{ formatTime(record?.timeSpent) }}</span>
              <span>/ {{ formatTime(Math.max(0, (record?.estimatedHours || 0) * 60)) }}</span>
            </div>
            <div class="tw:flex tw:justify-center">
              <a-button v-if="record?.isTimerActive" type="text" size="small" danger
                @click.stop="toggleTimer(record.id)"
                class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md tw:animate-pulse">
                <PauseCircleOutlined />
              </a-button>
              <a-button v-else type="text" size="small" @click.stop="toggleTimer(record?.id)"
                class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md">
                <PlayCircleOutlined />
              </a-button>
            </div>
          </div>
        </template>

        <!-- Actions -->
        <template #actions="{ record }">
          <div class="tw:flex tw:justify-end">
            <a-button-group size="small">
              <a-tooltip title="مشاهده جزئیات">
                <a-button @click.stop="viewTicket(record)"
                  class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md">
                  <EyeOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="ویرایش">
                <a-button @click.stop="editTicket(record)"
                  class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md">
                  <EditOutlined />
                </a-button>
              </a-tooltip>
              <a-dropdown :trigger="['click']">
                <a-button @click.stop class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md">
                  <MoreOutlined />
                </a-button>
                <template #overlay>
                  <a-menu @click="handleTicketAction($event, record)">
                    <a-menu-item key="pin">
                      <PushpinOutlined /> {{ record?.isPinned ? "حذف نشان" : "نشان کردن" }}
                    </a-menu-item>
                    <a-menu-item key="duplicate">
                      <CopyOutlined /> کپی تیکت
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="delete" danger>
                      <DeleteOutlined /> حذف
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-button-group>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Component } from "vue";
import { useTicketStore } from "@/stores/ticket";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import type { Ticket } from "@/types/ticket";
import {
  PushpinOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  IssuesCloseOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FlagOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined,
  UserOutlined,
  DownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import type { Key, TablePaginationConfig } from "ant-design-vue/es/table/interface";
import { Table } from "ant-design-vue";
import type { TableProps } from "ant-design-vue";
import type { TicketStatus } from "@/types/ticket";

const ticketStore = useTicketStore();
const onRowClick = (record: Ticket) => ticketStore.openTicketDrawer(record);

const selectedRowKeys = ref<Key[]>([]);
const onSelectChange: NonNullable<TableProps<Ticket>["rowSelection"]>["onChange"] = (keys) => {
  selectedRowKeys.value = keys;
};
const rowSelection = computed<TableProps<Ticket>["rowSelection"]>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: onSelectChange,
  selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
}));

const formatPaginationTotal: NonNullable<TablePaginationConfig["showTotal"]> = (
  total,
  range,
) => `${range[0]}-${range[1]} از ${total} تیکت`;

const pagination: TablePaginationConfig = {
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: formatPaginationTotal,
  pageSizeOptions: ["10", "20", "50", "100"],
};
const rowKey: TableProps<Ticket>["rowKey"] = (record) => record.id;
const customRow: TableProps<Ticket>["customRow"] = (record) => ({
  onClick: () => onRowClick(record),
});
// ستون‌ها فشرده‌تر و با ellipsis برای کاهش اسکرول افقی
const columns = [
  {
    title: "عنوان تیکت",
    dataIndex: "title",
    key: "title",
    width: 280,
    ellipsis: true,
    slots: { customRender: "title" },
  },
  {
    title: "وضعیت",
    dataIndex: "status",
    key: "status",
    width: 110,
    slots: { customRender: "status" },
    filters: [
      { text: "باز", value: "open" },
      { text: "در حال انجام", value: "in-progress" },
      { text: "بسته", value: "closed" },
    ],
  },
  {
    title: "اولویت",
    dataIndex: "priority",
    key: "priority",
    width: 100,
    slots: { customRender: "priority" },
    filters: [
      { text: "پایین", value: "low" },
      { text: "متوسط", value: "medium" },
      { text: "بالا", value: "high" },
      { text: "حیاتی", value: "critical" },
    ],
  },
  { title: "سرویس", dataIndex: "service", key: "service", width: 120, ellipsis: true },
  {
    title: "مسئول",
    dataIndex: "assignee",
    key: "assignee",
    width: 160,
    slots: { customRender: "assignee" },
  },
  { title: "زمان‌بندی", key: "timeTracking", width: 190, slots: { customRender: "timeTracking" } },
  {
    title: "تاریخ ایجاد",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 120,
    customRender: ({ text }: { text: string }) =>
      dayjs(text).isValid() ? dayjs(text).format("YYYY/MM/DD") : "-",
  },
  {
    title: "عملیات",
    key: "actions",
    width: 120,
    fixed: "right",
    slots: { customRender: "actions" },
  },
];

const getStatusColor = (s: string) =>
  (({ open: "green", "in-progress": "orange", closed: "default" }) as Record<string, string>)[s] ||
  "default";
const statusIconMap: Record<TicketStatus, Component> = {
  open: IssuesCloseOutlined,
  "in-progress": ClockCircleOutlined,
  closed: CheckCircleOutlined,
};
const getStatusIcon = (s: string) => statusIconMap[s as TicketStatus] ?? IssuesCloseOutlined;
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
const getAvatarColor = (name: string) =>
  ["#1890ff", "#52c41a", "#fa8c16", "#eb2f96", "#722ed1", "#13c2c2"][
  (name || "U").charCodeAt(0) % 6
  ];

const formatTime = (minutes?: number) => {
  const safe = Math.max(0, Math.floor(minutes || 0));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
};

const getTimeProgress = (t: Ticket) => {
  const est = Math.max(0, (t.estimatedHours || 0) * 60);
  if (!est) return 0;
  return Math.min(100, ((t.timeSpent || 0) / est) * 100);
};
const getTimeProgressColor = (t: Ticket) => {
  const p = getTimeProgress(t);
  return p >= 90 ? "#ff4d4f" : p >= 70 ? "#fa8c16" : "#52c41a";
};

const viewTicket = (t: Ticket) => ticketStore.openTicketDrawer(t);
const editTicket = (t: Ticket) => console.log("Edit ticket:", t);
const toggleTimer = (id: string) => ticketStore.toggleTimer(id);

const handleBulkStatusUpdate = (status: TicketStatus) => {
  const ids = selectedRowKeys.value.map((key) => String(key));
  ticketStore.bulkUpdateStatus(ids, status);
  message.success(`وضعیت ${ids.length} تیکت به‌روزرسانی شد`);
};


const handleBulkAction = ({ key }: { key: string }) => {
  switch (key) {
    case "assign":
      break;
    case "priority":
      break;
    case "export":
      message.info("در حال تهیه فایل Excel...");
      break;
  }
};

const handleTicketAction = ({ key }: { key: string }, ticket: Ticket) => {
  switch (key) {
    case "pin":
      ticketStore.togglePinTicket(ticket.id);
      message.success(ticket.isPinned ? "نشان حذف شد" : "تیکت نشان شد");
      break;
    case "duplicate":
      message.info("تیکت کپی شد");
      break;
    case "delete":
      break;
  }
};
</script>
