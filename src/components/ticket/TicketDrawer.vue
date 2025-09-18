<template>
  <!-- Drawer -->
  <a-drawer v-model:open="ticketStore.isDrawerVisible" placement="left" :width="640" :maskClosable="true" :zIndex="2000"
    :header-style="{ padding: 0 }" :body-style="{ padding: 0 }" :maskStyle="{ backdropFilter: 'blur(2px)' }"
    class="tw:[&_.ant-drawer-body]:p-0 tw:!bg-transparent">
    <div v-if="ticket" class="tw:flex tw:flex-col tw:h-full tw:bg-white tw:dark:bg-[#121212]">
      <!-- Header (sticky) -->
      <div
        class="tw:sticky tw:top-0 tw:z-10 tw:px-5 tw:py-3 tw:border-b tw:border-[#f0f0f0] tw:dark:!border-[#2f2f2f] tw:bg-[#fafafa]/90 tw:dark:!bg-[#1a1a1a]/90 tw:backdrop-blur">
        <div class="tw:flex tw:items-start tw:justify-between tw:gap-2">
          <div class="tw:min-w-0 tw:space-y-1">
            <div class="tw:flex tw:items-center tw:gap-2 tw:min-w-0">
              <PushpinOutlined v-if="ticket.isPinned" class="tw:!text-[#fa8c16]" />
              <h2 class="tw:m-0 tw:!text-[18px] tw:font-semibold tw:leading-snug tw:!truncate tw:!text-[#8c8c8c]">
                {{ ticket.title }}
              </h2>
            </div>
            <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
              <span
                class="tw:text-[12px] tw:!text-[#8c8c8c] tw:font-mono tw:bg-[#f5f5f5] tw:dark:!bg-[#2a2a2a] tw:dark:!text-[#a0a0a0] tw:px-2 tw:py-0.5 tw:rounded">
                {{ ticket.ticketCode }}
              </span>
              <a-tag :color="getStatusColor(ticket.status)">
                <component :is="getStatusIcon(ticket.status)" />
                {{ getStatusText(ticket.status) }}
              </a-tag>
              <a-tag :color="getPriorityColor(ticket.priority)">
                <component :is="getPriorityIcon(ticket.priority)" />
                {{ getPriorityText(ticket.priority) }}
              </a-tag>
            </div>
          </div>

          <div class="tw:flex tw:items-center tw:gap-1">
            <a-button size="large" type="text" class="tw:rounded-md tw:hover:bg-gray-200 tw:dark:hover:bg-white/10"
              @click="openFullscreen">
              <ArrowsAltOutlined />
            </a-button>

            <a-dropdown :trigger="['click']">
              <a-button type="text" size="large" class="tw:rounded-md tw:hover:bg-gray-200 tw:dark:hover:bg-white/10">
                <MoreOutlined />
              </a-button>
              <template #overlay>
                <a-menu @click="handleHeaderAction">
                  <a-menu-item key="edit">
                    <EditOutlined /> ویرایش تیکت
                  </a-menu-item>
                  <a-menu-item key="pin">
                    <PushpinOutlined /> {{ ticket.isPinned ? "حذف نشان" : "نشان کردن" }}
                  </a-menu-item>
                  <a-menu-item key="duplicate">
                    <CopyOutlined /> کپی تیکت
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="delete" danger>
                    <DeleteOutlined /> حذف تیکت
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="tw:flex-1 tw:overflow-y-auto tw:p-4 tw:!space-y-4">
        <!-- Time -->
        <a-card size="small" class="tw:rounded-xl tw:!border-[#f0f0f0] tw:dark:!border-[#2a2a2a] tw:!bg-transparent">
          <template #title>
            <div class="tw:flex tw:items-center tw:gap-2">
              <ClockCircleOutlined /><span>ردیابی زمان</span>
            </div>
          </template>

          <div class="tw:flex tw:flex-col tw:gap-4">
            <div class="tw:grid tw:grid-cols-2 tw:gap-4">
              <a-statistic title="زمان صرف‌شده" :value="formatTimeForDisplay(ticket.timeSpent)"
                :value-style="{ fontSize: '20px', fontWeight: '600' }" />
              <a-statistic title="تخمین کل"
                :value="formatTimeForDisplay(Math.max(0, (ticket.estimatedHours || 0) * 60))" />
            </div>

            <div class="tw:space-y-2">
              <a-progress :percent="getTimeProgress(ticket)" :stroke-color="getTimeProgressColor(ticket)"
                :show-info="false" :stroke-width="8" />
              <div class="tw:flex tw:justify-between tw:text-[12px] tw:text-[#8c8c8c]">
                <span>{{ Math.round(getTimeProgress(ticket)) }}% تکمیل شده</span>
                <span class="tw:text-[#fa8c16] tw:font-medium">
                  {{
                    formatTimeForDisplay(
                      Math.max(0, (ticket.estimatedHours || 0) * 60 - (ticket.timeSpent || 0)),
                    )
                  }}
                  باقی‌مانده
                </span>
              </div>
            </div>

            <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
              <a-button v-if="ticket.isTimerActive" type="primary" danger size="large" @click="toggleTimer"
                class="tw:rounded-lg tw:font-medium tw:animate-pulse tw:hover:!bg-gray-200 tw:dark:hover:!bg-white/10">
                <PauseCircleOutlined /> توقف زمان‌سنج
              </a-button>
              <a-button v-else type="primary" size="large" @click="toggleTimer"
                class="tw:rounded-lg tw:font-medium tw:hover:!bg-gray-200 tw:dark:hover:!bg-white/10">
                <PlayCircleOutlined /> شروع زمان‌سنج
              </a-button>

              <span v-if="ticket.isTimerActive && ticket.timerStartTime"
                class="tw:text-[14px] tw:font-semibold tw:text-[#fa8c16] tw:font-mono">
                {{ countdownDisplay }}
              </span>
            </div>
          </div>
        </a-card>

        <!-- Details -->
        <a-card title="جزئیات تیکت" size="small"
          class="tw:rounded-xl tw:!border-[#f0f0f0] tw:dark:!border-[#2a2a2a] tw:!bg-transparent">
          <a-descriptions :column="1" bordered size="small"
            class="tw:[&_.ant-descriptions-item-label]:tw:min-w-[110px]">
            <a-descriptions-item label="درخواست‌دهنده">
              <div class="tw:flex tw:items-center tw:gap-2">
                <a-avatar size="small" :style="{ backgroundColor: getAvatarColor(ticket.requester?.name || 'U') }">
                  {{ (ticket.requester?.name || "U").charAt(0) }}
                </a-avatar>
                <span>{{ ticket.requester?.name || "نامشخص" }}</span>
              </div>
            </a-descriptions-item>

            <a-descriptions-item label="مسئول">
              <div class="tw:flex tw:items-center tw:gap-2">
                <a-avatar size="small" :style="{ backgroundColor: getAvatarColor(ticket.assignee?.name || 'U') }">
                  {{ (ticket.assignee?.name || "U").charAt(0) }}
                </a-avatar>
                <span>{{ ticket.assignee?.name || "نامشخص" }}</span>
              </div>
            </a-descriptions-item>

            <a-descriptions-item label="سرویس"><a-tag>{{ getServiceText(ticket.service) }}</a-tag></a-descriptions-item>
            <a-descriptions-item label="تاریخ ایجاد">{{
              formatDate(ticket.createdAt)
              }}</a-descriptions-item>
            <a-descriptions-item label="آخرین به‌روزرسانی">{{
              formatDate(ticket.lastUpdated)
              }}</a-descriptions-item>

            <a-descriptions-item v-if="ticket.dueDate" label="مهلت تحویل">
              <span :class="{ 'tw:text-[#ff4d4f] tw:font-medium': isOverdue(ticket.dueDate) }">
                {{ formatDate(ticket.dueDate) }}
              </span>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- Description -->
        <a-card title="توضیحات" size="small"
          class="tw:rounded-xl tw:!border-[#f0f0f0] tw:dark:!border-[#2a2a2a] tw:!bg-transparent">
          <div class="tw:leading-7 tw:whitespace-pre-wrap tw:text-[#595959] dark:tw:text-[#a0a0a0]">
            {{ ticket.description }}
          </div>
        </a-card>

        <!-- Timeline -->
        <a-card title="تاریخچه فعالیت" size="small"
          class="tw:rounded-xl tw:!border-[#f0f0f0] tw:dark:!border-[#2a2a2a] tw:!bg-transparent">
          <a-timeline mode="right" class="tw:mt-2">
            <a-timeline-item v-for="c in ticket.comments || []" :key="c.id" :color="getTimelineColor(c.type)">
              <template #dot>
                <component :is="getTimelineIcon(c.type)" />
              </template>
              <div class="tw:pr-3 tw:!space-y-2">
                <div class="tw:flex tw:items-center tw:justify-between">
                  <div class="tw:flex tw:items-center tw:gap-2">
                    <a-avatar size="small" :style="{ backgroundColor: getAvatarColor(c.author?.name || 'U') }">
                      {{ (c.author?.name || "U").charAt(0) }}
                    </a-avatar>
                    <span class="tw:text-[14px] tw:font-medium">{{ c.author?.name || "-" }}</span>
                  </div>
                  <span class="tw:text-[12px] tw:text-[#8c8c8c]">{{
                    formatDate(c.createdAt)
                    }}</span>
                </div>
                <div class="tw:text-[#595959] dark:tw:text-[#a0a0a0]">{{ c.content }}</div>
                <div v-if="c.attachments?.length" class="tw:flex tw:flex-wrap tw:gap-2">
                  <a-tag v-for="a in c.attachments" :key="a.id" class="tw:text-[11px] tw:flex tw:items-center tw:gap-1">
                    <PaperClipOutlined /> {{ a.name }}
                  </a-tag>
                </div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>

        <!-- Add Comment -->
        <a-card title="افزودن نظر" size="small"
          class="tw:rounded-xl tw:!border-[#f0f0f0] tw:dark:!border-[#2a2a2a] tw:!bg-transparent">
          <a-form @submit.prevent="handleAddComment">
            <a-form-item>
              <a-textarea v-model:value="newComment" :rows="4" class="tw:rounded-lg"
                placeholder="نظر خود را بنویسید..." />
            </a-form-item>

            <a-form-item>
              <a-upload-dragger v-model:file-list="fileList" :before-upload="beforeUpload" :max-count="5"
                class="tw:my-3">
                <p class="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p class="ant-upload-text">فایل‌های خود را اینجا بکشید یا کلیک کنید</p>
                <p class="ant-upload-hint">حداکثر 5 فایل، هر فایل حداکثر 10MB</p>
              </a-upload-dragger>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="isAddingComment"
                class="tw:rounded-lg tw:font-medium">
                <SendOutlined /> ارسال نظر
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </div>

      <!-- Footer (sticky) -->
      <div
        class="tw:sticky tw:bottom-0 tw:px-5 tw:py-3 tw:border-t tw:border-[#f0f0f0] tw:dark:border-[#2f2f2f] tw:bg-[#fafafa]/90 tw:dark:bg-[#1a1a1a]/90 tw:backdrop-blur">
        <a-space>
          <a-button type="primary" @click="handleReply"
            class="tw:rounded-md tw:hover:bg-gray-200 tw:dark:hover:bg-white/10">
            <EyeOutlined /> پاسخ
          </a-button>
          <a-dropdown :trigger="['click']">
            <a-button class="tw:rounded-md tw:hover:bg-gray-200 tw:dark:hover:bg-white/10">
              <UserOutlined /> تخصیص
            </a-button>
            <template #overlay>
              <a-menu @click="handleAssign">
                <a-menu-item key="user1">کاربر ۱</a-menu-item>
                <a-menu-item key="user2">کاربر ۲</a-menu-item>
                <a-menu-item key="user3">کاربر ۳</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-popconfirm title="آیا مطمئن هستید که می‌خواهید این تیکت را ببندید؟" @confirm="handleCloseTicket">
            <a-button type="primary" ghost class="tw:rounded-md">
              <CheckCircleOutlined /> بستن تیکت
            </a-button>
          </a-popconfirm>
        </a-space>
      </div>
    </div>
  </a-drawer>

  <!-- Fullscreen Modal -->
  <a-modal :open="isFullscreen" :footer="null" :closable="false" :width="'100%'" :zIndex="2100"
    wrapClassName="full-modal" :bodyStyle="{ padding: 0 }" :maskStyle="{ backdropFilter: 'blur(4px)' }">
    <div class="tw:h-screen tw:w-screen tw:flex tw:flex-col tw:!gap-2 tw:bg-white tw:dark:bg-[#0e0e0e]">
      <!-- Topbar -->
      <div
        class="tw:sticky tw:!top-0 tw:z-10 tw:flex tw:items-center tw:justify-between tw:px-6 tw:py-3 tw:!border-b tw:!border-[#ececec] tw:dark:!border-[#2a2a2a] tw:!bg-[#f7f7f7]/90 tw:dark:!bg-[#141414]/90 tw:!backdrop-blur">
        <div class="tw:flex tw:items-center tw:!gap-3 tw:min-w-0">
          <PushpinOutlined v-if="ticket?.isPinned" class="tw:!text-[#fa8c16]" />
          <h2 class="tw:m-0 tw:text-lg tw:font-semibold tw:truncate">{{ ticket?.title }}</h2>
          <span
            class="tw:text-[12px] tw:text-[#8c8c8c] tw:font-mono tw:bg-[#f5f5f5] tw:dark:bg-[#2a2a2a] tw:dark:text-[#a0a0a0] tw:px-2 tw:py-0.5 tw:rounded">
            {{ ticket?.ticketCode }}
          </span>
          <a-tag :color="getStatusColor(ticket?.status || 'open')">{{
            getStatusText(ticket?.status || "open")
            }}</a-tag>
          <a-tag :color="getPriorityColor(ticket?.priority || 'low')">{{
            getPriorityText(ticket?.priority || "low")
            }}</a-tag>
        </div>
        <div class="tw:flex tw:items-center tw:gap-2">
          <a-button class="tw:rounded-md tw:hover:bg-gray-200 tw:dark:hover:bg-white/10" @click="exitFullscreen">
            <SwapOutlined /> خروج از حالت تمام‌صفحه
          </a-button>
        </div>
      </div>

      <!-- Content -->
      <div class="tw:flex-1 tw:overflow-y-auto tw:p-6 tw:!space-y-6">
        <div class="tw:grid tw:gap-6 tw:lg:grid-cols-3">
          <div class="tw:space-y-6 tw:lg:col-span-2">
            <!-- Time -->
            <a-card size="small"
              class="tw:rounded-xl tw:!border-[#f0f0f0] tw:dark:!border-[#2a2a2a] tw:!bg-transparent">
              <template #title>
                <div class="tw:flex tw:items-center tw:gap-2">
                  <ClockCircleOutlined /><span>ردیابی زمان</span>
                </div>
              </template>
              <div class="tw:flex tw:flex-col tw:gap-4">
                <div class="tw:grid tw:grid-cols-2 tw:gap-4">
                  <a-statistic title="زمان صرف‌شده" :value="formatTimeForDisplay(ticket?.timeSpent || 0)" />
                  <a-statistic title="تخمین کل"
                    :value="formatTimeForDisplay(Math.max(0, (ticket?.estimatedHours || 0) * 60))" />
                </div>
                <div class="tw:space-y-2">
                  <a-progress :percent="ticket ? getTimeProgress(ticket) : 0"
                    :stroke-color="ticket ? getTimeProgressColor(ticket) : '#52c41a'" :show-info="false"
                    :stroke-width="10" />
                  <div class="tw:flex tw:justify-between tw:text-[12px] tw:text-[#8c8c8c]">
                    <span>{{ ticket ? Math.round(getTimeProgress(ticket)) : 0 }}% تکمیل شده</span>
                    <span class="tw:text-[#fa8c16] tw:font-medium">
                      {{
                        formatTimeForDisplay(
                          Math.max(
                            0,
                            (ticket?.estimatedHours || 0) * 60 - (ticket?.timeSpent || 0),
                          ),
                        )
                      }}
                      باقی‌مانده
                    </span>
                  </div>
                </div>
              </div>
            </a-card>

            <!-- Description -->
            <a-card title="توضیحات" size="small"
              class="tw:rounded-xl tw:!border-[#f0f0f0] tw:dark:!border-[#2a2a2a] tw:!bg-transparent">
              <div class="tw:leading-7 tw:whitespace-pre-wrap tw:text-[#595959] dark:tw:text-[#a0a0a0]">
                {{ ticket?.description }}
              </div>
            </a-card>

            <!-- Timeline -->
            <a-card title="تاریخچه فعالیت" size="small"
              class="tw:rounded-xl tw:!border-[#f0f0f0] tw:!dark:border-[#2a2a2a] tw:!bg-transparent">
              <a-timeline mode="right" class="tw:!mt-2">
                <a-timeline-item v-for="c in ticket?.comments || []" :key="c.id" :color="getTimelineColor(c.type)">
                  <template #dot>
                    <component :is="getTimelineIcon(c.type)" />
                  </template>
                  <div class="tw:px-3 tw:!space-y-2">
                    <div class="tw:flex tw:items-center tw:justify-between">
                      <div class="tw:flex tw:items-center tw:gap-2">
                        <a-avatar size="small" :style="{ backgroundColor: getAvatarColor(c.author?.name || 'U') }">
                          {{ (c.author?.name || "U").charAt(0) }}
                        </a-avatar>
                        <span class="tw:text-[14px] tw:font-medium">{{
                          c.author?.name || "-"
                          }}</span>
                      </div>
                      <span class="tw:text-[12px] tw:text-[#8c8c8c]">{{
                        formatDate(c.createdAt)
                        }}</span>
                    </div>
                    <div class="tw:text-[#595959] tw:dark:text-[#a0a0a0]">{{ c.content }}</div>
                    <div v-if="c.attachments?.length" class="tw:flex tw:flex-wrap tw:gap-2">
                      <a-tag v-for="a in c.attachments" :key="a.id"
                        class="tw:text-[11px] tw:flex tw:items-center tw:gap-1">
                        <PaperClipOutlined /> {{ a.name }}
                      </a-tag>
                    </div>
                  </div>
                </a-timeline-item>
              </a-timeline>
            </a-card>
          </div>

          <!-- Right column -->
          <div class="tw:space-y-6">
            <a-card title="جزئیات تیکت" size="small"
              class="tw:rounded-xl tw:!border-[#f0f0f0] tw:dark:!border-[#2a2a2a] tw:!bg-transparent">
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="درخواست‌دهنده">
                  <div class="tw:flex tw:items-center tw:gap-2">
                    <a-avatar size="small" :style="{ backgroundColor: getAvatarColor(ticket?.requester?.name || 'U') }">
                      {{ (ticket?.requester?.name || "U").charAt(0) }}
                    </a-avatar>
                    <span>{{ ticket?.requester?.name || "نامشخص" }}</span>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item label="مسئول">
                  <div class="tw:flex tw:items-center tw:gap-2">
                    <a-avatar size="small" :style="{ backgroundColor: getAvatarColor(ticket?.assignee?.name || 'U') }">
                      {{ (ticket?.assignee?.name || "U").charAt(0) }}
                    </a-avatar>
                    <span>{{ ticket?.assignee?.name || "نامشخص" }}</span>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item label="سرویس"><a-tag>{{
                  getServiceText(ticket?.service || "general")
                    }}</a-tag></a-descriptions-item>
                <a-descriptions-item label="تاریخ ایجاد">{{
                  formatDate(ticket?.createdAt || "")
                  }}</a-descriptions-item>
                <a-descriptions-item label="آخرین به‌روزرسانی">{{
                  formatDate(ticket?.lastUpdated || "")
                  }}</a-descriptions-item>
                <a-descriptions-item v-if="ticket?.dueDate" label="مهلت تحویل">
                  <span :class="{
                    'tw:text-[#ff4d4f] tw:font-medium': isOverdue(ticket?.dueDate || ''),
                  }">
                    {{ formatDate(ticket?.dueDate || "") }}
                  </span>
                </a-descriptions-item>
              </a-descriptions>
            </a-card>

            <a-card title="افزودن نظر" size="small"
              class="tw:rounded-xl tw:!border-[#f0f0f0] tw:dark:!border-[#2a2a2a] tw:!bg-transparent">
              <a-form @submit.prevent="handleAddComment">
                <a-form-item><a-textarea v-model:value="newComment" :rows="4" class="tw:rounded-lg"
                    placeholder="نظر خود را بنویسید..." /></a-form-item>
                <a-form-item>
                  <a-upload-dragger v-model:file-list="fileList" :before-upload="beforeUpload" :max-count="5"
                    class="tw:my-3">
                    <p class="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p class="ant-upload-text">فایل‌های خود را اینجا بکشید یا کلیک کنید</p>
                  </a-upload-dragger>
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" html-type="submit" :loading="isAddingComment"
                    class="tw:rounded-lg tw:font-medium">
                    <SendOutlined /> ارسال نظر
                  </a-button>
                </a-form-item>
              </a-form>
            </a-card>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTicketStore } from "@/stores/ticket";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import type { Ticket } from "@/types/ticket";
import { useCountdown } from "@/composable/useCountdown";
import {
  MoreOutlined,
  EditOutlined,
  PushpinOutlined,
  CopyOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  IssuesCloseOutlined,
  ExclamationCircleOutlined,
  FlagOutlined,
  PaperClipOutlined,
  InboxOutlined,
  SendOutlined,
  EyeOutlined,
  UserOutlined,
  CommentOutlined,
  SwapOutlined,
  ArrowsAltOutlined,
} from "@ant-design/icons-vue";

const ticketStore = useTicketStore();
const newComment = ref("");
const fileList = ref<any[]>([]);
const isAddingComment = ref(false);
const isFullscreen = ref(false);

const ticket = computed<Ticket | null>(() => ticketStore.selectedTicket as Ticket | null);

const getStatusColor = (s: string) =>
  (({ open: "green", "in-progress": "orange", closed: "default" }) as Record<string, string>)[s] ||
  "default";
const getStatusIcon = (s: string) =>
  (
    ({
      open: IssuesCloseOutlined,
      "in-progress": ClockCircleOutlined,
      closed: CheckCircleOutlined,
    }) as Record<string, any>
  )[s] || IssuesCloseOutlined;
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

const formatTimeForDisplay = (minutes?: number) => {
  const safe = Math.max(0, Math.floor(minutes || 0));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${h}س ${m}د`;
};
const formatDate = (d?: string) =>
  d && dayjs(d).isValid() ? dayjs(d).format("YYYY/MM/DD HH:mm") : "-";
const isOverdue = (d?: string) => !!d && dayjs(d).isBefore(dayjs());

const getTimeProgress = (t: Ticket) => {
  const est = Math.max(0, (t.estimatedHours || 0) * 60);
  if (!est) return 0;
  return Math.min(100, ((t.timeSpent || 0) / est) * 100);
};
const getTimeProgressColor = (t: Ticket) => {
  const p = getTimeProgress(t);
  return p >= 90 ? "#ff4d4f" : p >= 70 ? "#fa8c16" : "#52c41a";
};
const getTimelineColor = (t: string) =>
  (
    ({
      comment: "blue",
      "status-change": "green",
      assignment: "orange",
      attachment: "purple",
    }) as Record<string, string>
  )[t] || "blue";
const getTimelineIcon = (t: string) =>
  (
    ({
      comment: CommentOutlined,
      "status-change": SwapOutlined,
      assignment: UserOutlined,
      attachment: PaperClipOutlined,
    }) as Record<string, any>
  )[t] || CommentOutlined;

const countdown = useCountdown(0, {
  intervalMs: 1000,
  onFinish: () => {
    if (ticket.value?.id && ticket.value.isTimerActive && ticket.value.timerStartTime) {
      ticketStore.toggleTimer(ticket.value.id);
      message.info("زمان‌سنج به پایان رسید");
    }
  },
});

const {
  display: countdownDisplay,
  start: startCountdown,
  reset: resetCountdown,
} = countdown;

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;

const computeRemainingEstimateMs = (t: Ticket) => {
  const estimatedMs = Math.max(0, (t.estimatedHours || 0) * MS_PER_HOUR);
  const spentMs = Math.max(0, (t.timeSpent || 0) * MS_PER_MINUTE);
  const startTimestamp = t.timerStartTime ? Date.parse(t.timerStartTime) : NaN;
  const activeElapsedMs =
    t.isTimerActive && Number.isFinite(startTimestamp)
      ? Math.max(0, Date.now() - startTimestamp)
      : 0;
  return Math.max(0, estimatedMs - spentMs - activeElapsedMs);
};

watch(
  () => {
    const t = ticket.value;
    if (!t) return null;
    return {
      id: t.id,
      isTimerActive: t.isTimerActive,
      timerStartTime: t.timerStartTime,
      timeSpent: t.timeSpent,
      estimatedHours: t.estimatedHours,
    };
  },
  (state) => {
    if (!state) {
      resetCountdown(0);
      return;
    }
    const t = ticket.value;
    if (!t) {
      resetCountdown(0);
      return;
    }
    const remainingMs = computeRemainingEstimateMs(t);
    if (state.isTimerActive && state.timerStartTime) {
      startCountdown(remainingMs);
    } else {
      resetCountdown(remainingMs);
    }
  },
  { immediate: true },
);

const toggleTimer = () => {
  if (ticket.value) {
    ticketStore.toggleTimer(ticket.value.id);
    message.success(ticket.value.isTimerActive ? "زمان‌سنج متوقف شد" : "زمان‌سنج شروع شد");
  }
};
const handleHeaderAction = ({ key }: { key: string }) => {
  if (!ticket.value) return;
  switch (key) {
    case "edit":
      message.info("صفحه ویرایش باز می‌شود");
      break;
    case "pin":
      ticketStore.togglePinTicket(ticket.value.id);
      message.success(ticket.value.isPinned ? "نشان حذف شد" : "تیکت نشان شد");
      break;
    case "duplicate":
      message.success("تیکت کپی شد");
      break;
    case "delete":
      message.error("تیکت حذف شد");
      ticketStore.closeTicketDrawer();
      break;
  }
};
const handleAddComment = async () => {
  if (!newComment.value.trim() || !ticket.value) return;
  isAddingComment.value = true;
  try {
    ticketStore.addComment(ticket.value.id, newComment.value, "کاربر فعلی");
    newComment.value = "";
    fileList.value = [];
    message.success("نظر اضافه شد");
  } catch (e) {
    message.error("خطا در افزودن نظر");
  } finally {
    isAddingComment.value = false;
  }
};
const beforeUpload = (file: any) => {
  const ok = file.size / 1024 / 1024 < 10;
  if (!ok) message.error("حجم فایل باید کمتر از 10MB باشد!");
  return false;
};
const handleReply = () => message.info("صفحه پاسخ باز می‌شود");
const handleAssign = ({ key }: { key: string }) => message.success(`تیکت به ${key} تخصیص داده شد`);
const handleCloseTicket = () => {
  if (ticket.value) {
    ticketStore.updateTicketStatus(ticket.value.id, "closed");
    message.success("تیکت بسته شد");
    ticketStore.closeTicketDrawer();
  }
};

const openFullscreen = () => {
  isFullscreen.value = true;
};
const exitFullscreen = () => {
  isFullscreen.value = false;
};
</script>

<style>
.full-modal .ant-modal {
  max-width: 100vw !important;
  padding: 0;
}

.full-modal .ant-modal-content {
  height: 100vh;
  padding: 0;
  border-radius: 0;
}

.ant-modal {
  top: 0 !important;
}
</style>
