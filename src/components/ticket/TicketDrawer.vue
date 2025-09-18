<template>
  <a-drawer
    v-model:open="ticketStore.isDrawerVisible"
    title=""
    :width="600"
    placement="left"
    :header-style="{ padding: 0 }"
    :body-style="{ padding: 0 }"
  >
    <div v-if="ticket" class="tw:flex tw:flex-col tw:h-full">
      <div
        class="tw:px-6 tw:py-4 tw:border-b tw:border-[#f0f0f0] tw:dark:border-[#434343] tw:bg-[#fafafa] tw:dark:bg-[#262626]"
      >
        <div class="tw:flex tw:items-start tw:justify-between">
          <div class="tw:min-w-0 tw:space-y-1">
            <h2 class="tw:m-0 tw:text-[18px] tw:font-semibold tw:leading-snug tw:truncate">
              {{ ticket.title }}
            </h2>
            <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
              <span
                class="tw:text-[12px] tw:text-[#8c8c8c] tw:font-mono tw:bg-[#f5f5f5] tw:dark:bg-[#434343] tw:dark:text-[#a0a0a0] tw:px-1.5 tw:py-0.5 tw:rounded"
                >{{ ticket.ticketCode }}</span
              >
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
            <a-button
              size="large"
              type="text"
              class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md"
              @click="openFullscreen"
            >
              <ArrowsAltOutlined />
            </a-button>
            <a-dropdown :trigger="['click']">
              <a-button
                type="text"
                size="large"
                class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md"
              >
                <MoreOutlined />
              </a-button>
              <template #overlay>
                <a-menu @click="handleHeaderAction">
                  <a-menu-item key="edit"> <EditOutlined /> ویرایش تیکت </a-menu-item>
                  <a-menu-item key="pin">
                    <PushpinOutlined /> {{ ticket.isPinned ? "حذف نشان" : "نشان کردن" }}
                  </a-menu-item>
                  <a-menu-item key="duplicate"> <CopyOutlined /> کپی تیکت </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="delete" danger> <DeleteOutlined /> حذف تیکت </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>

      <div class="tw:flex-1 tw:overflow-y-auto tw:p-4 tw:space-y-4">
        <a-card size="small" class="tw:rounded-xl">
          <template #title>
            <div class="tw:flex tw:items-center tw:gap-2">
              <ClockCircleOutlined />
              <span>ردیابی زمان</span>
            </div>
          </template>

          <div class="tw:flex tw:flex-col tw:gap-4">
            <div class="tw:grid tw:grid-cols-2 tw:md:grid-cols-2 tw:gap-4">
              <a-statistic
                title="زمان صرف‌شده"
                :value="formatTimeForDisplay(ticket.timeSpent)"
                :value-style="{ fontSize: '20px', fontWeight: '600' }"
              />
              <a-statistic
                title="تخمین کل"
                :value="formatTimeForDisplay(Math.max(0, (ticket.estimatedHours || 0) * 60))"
                :value-style="{ fontSize: '16px' }"
              />
            </div>

            <div class="tw:space-y-2">
              <a-progress
                :percent="getTimeProgress(ticket)"
                :stroke-color="getTimeProgressColor(ticket)"
                :trail-color="'#f0f0f0'"
                :stroke-width="8"
              />
              <div class="tw:flex tw:justify-between tw:text-[12px] tw:text-[#8c8c8c]">
                <span>{{ Math.round(getTimeProgress(ticket)) }}% تکمیل شده</span>
                <span class="tw:text-[#fa8c16] tw:font-medium"
                  >{{
                    formatTimeForDisplay(
                      Math.max(0, (ticket.estimatedHours || 0) * 60 - (ticket.timeSpent || 0)),
                    )
                  }}
                  باقی‌مانده</span
                >
              </div>
            </div>

            <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
              <a-button
                v-if="ticket.isTimerActive"
                type="primary"
                danger
                size="large"
                @click="toggleTimer"
                class="tw:rounded-lg tw:font-medium tw:animate-pulse tw:hover:bg-gray-200 tw:dark:hover:bg-white"
              >
                <PauseCircleOutlined />
                توقف زمان‌سنج
              </a-button>
              <a-button
                v-else
                type="primary"
                size="large"
                @click="toggleTimer"
                class="tw:rounded-lg tw:font-medium tw:hover:bg-gray-200 tw:dark:hover:bg-white"
              >
                <PlayCircleOutlined />
                شروع زمان‌سنج
              </a-button>
              <a-statistic-countdown
                v-if="ticket.isTimerActive && ticket.timerStartTime"
                :value="getCountdownValue()"
                format="HH:mm:ss"
                :value-style="{ fontSize: '14px', color: '#fa8c16' }"
              />
            </div>
          </div>
        </a-card>

        <a-card title="جزئیات تیکت" size="small" class="tw:rounded-xl">
          <a-descriptions :column="1" bordered size="small">
            <a-descriptions-item label="درخواست‌دهنده">
              <div class="tw:flex tw:items-center tw:gap-2">
                <a-avatar
                  size="small"
                  :style="{ backgroundColor: getAvatarColor(ticket.requester?.name || 'U') }"
                  >{{ (ticket.requester?.name || "U").charAt(0) }}</a-avatar
                >
                <span>{{ ticket.requester?.name || "نامشخص" }}</span>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="مسئول">
              <div class="tw:flex tw:items-center tw:gap-2">
                <a-avatar
                  size="small"
                  :style="{ backgroundColor: getAvatarColor(ticket.assignee?.name || 'U') }"
                  >{{ (ticket.assignee?.name || "U").charAt(0) }}</a-avatar
                >
                <span>{{ ticket.assignee?.name || "نامشخص" }}</span>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="سرویس"
              ><a-tag>{{ getServiceText(ticket.service) }}</a-tag></a-descriptions-item
            >
            <a-descriptions-item label="تاریخ ایجاد">{{
              formatDate(ticket.createdAt)
            }}</a-descriptions-item>
            <a-descriptions-item label="آخرین به‌روزرسانی">{{
              formatDate(ticket.lastUpdated)
            }}</a-descriptions-item>
            <a-descriptions-item v-if="ticket.dueDate" label="مهلت تحویل">
              <span :class="{ 'tw:text-[#ff4d4f] tw:font-medium': isOverdue(ticket.dueDate) }">{{
                formatDate(ticket.dueDate)
              }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card title="توضیحات" size="small" class="tw:rounded-xl">
          <div class="tw:leading-7 tw:whitespace-pre-wrap tw:text-[#595959] dark:tw:text-[#a0a0a0]">
            {{ ticket.description }}
          </div>
        </a-card>

        <a-card title="تاریخچه فعالیت" size="small" class="tw:rounded-xl">
          <a-timeline mode="right">
            <a-timeline-item
              v-for="comment in ticket.comments || []"
              :key="comment.id"
              :color="getTimelineColor(comment.type)"
            >
              <template #dot>
                <component :is="getTimelineIcon(comment.type)" />
              </template>
              <div class="tw:pr-3 tw:space-y-2">
                <div class="tw:flex tw:items-center tw:justify-between">
                  <div class="tw:flex tw:items-center tw:gap-2">
                    <a-avatar
                      size="small"
                      :style="{ backgroundColor: getAvatarColor(comment.author?.name || 'U') }"
                      >{{ (comment.author?.name || "U").charAt(0) }}</a-avatar
                    >
                    <span class="tw:text-[14px] tw:font-medium">{{
                      comment.author?.name || "-"
                    }}</span>
                  </div>
                  <span class="tw:text-[12px] tw:text-[#8c8c8c]">{{
                    formatDate(comment.createdAt)
                  }}</span>
                </div>
                <div class="tw:text-[#595959] dark:tw:text-[#a0a0a0]">{{ comment.content }}</div>
                <div v-if="comment.attachments?.length" class="tw:flex tw:flex-wrap tw:gap-2">
                  <a-tag
                    v-for="attachment in comment.attachments"
                    :key="attachment.id"
                    class="tw:text-[11px] tw:flex tw:items-center tw:gap-1"
                  >
                    <PaperClipOutlined /> {{ attachment.name }}
                  </a-tag>
                </div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>

        <a-card title="افزودن نظر" size="small" class="tw:rounded-xl">
          <a-form @submit.prevent="handleAddComment">
            <a-form-item>
              <a-textarea
                v-model:value="newComment"
                placeholder="نظر خود را بنویسید..."
                :rows="4"
                class="tw:rounded-lg"
              />
            </a-form-item>
            <a-form-item>
              <a-upload-dragger
                v-model:file-list="fileList"
                :before-upload="beforeUpload"
                :max-count="5"
                class="tw:my-3"
              >
                <p class="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p class="ant-upload-text">فایل‌های خود را اینجا بکشید یا کلیک کنید</p>
                <p class="ant-upload-hint">حداکثر 5 فایل، هر فایل حداکثر 10MB</p>
              </a-upload-dragger>
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                :loading="isAddingComment"
                class="tw:rounded-lg tw:font-medium"
              >
                <SendOutlined />
                ارسال نظر
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </div>

      <div
        class="tw:px-6 tw:py-4 tw:border-t tw:border-[#f0f0f0] dark:tw:border-[#434343] tw:bg-[#fafafa] dark:tw:bg-[#262626]"
      >
        <a-space>
          <a-button
            type="primary"
            @click="handleReply"
            class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md"
          >
            <EyeOutlined /> پاسخ
          </a-button>
          <a-dropdown :trigger="['click']">
            <a-button class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md">
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
          <a-popconfirm
            title="آیا مطمئن هستید که می‌خواهید این تیکت را ببندید؟"
            @confirm="handleCloseTicket"
          >
            <a-button type="primary" ghost class="tw:rounded-md">
              <CheckCircleOutlined /> بستن تیکت
            </a-button>
          </a-popconfirm>
        </a-space>
      </div>
    </div>
  </a-drawer>

  <!-- Fullscreen Modal -->
  <a-modal
    :open="isFullscreen"
    :footer="null"
    :closable="false"
    :width="'100%'"
    wrapClassName="tw:p-0 full-modal"
    :bodyStyle="{ padding: 0 }"
  >
    <div class="tw:h-screen tw:w-screen tw:flex tw:flex-col tw:bg-white dark:tw:bg-[#0f0f0f]">
      <div
        class="tw:flex tw:items-center tw:justify-between tw:px-6 tw:py-3 tw:border-b tw:border-[#f0f0f0] dark:tw:border-[#434343] tw:bg-[#fafafa] dark:tw:bg-[#1a1a1a]"
      >
        <div class="tw:flex tw:items-center tw:gap-3 tw:min-w-0">
          <PushpinOutlined v-if="ticket?.isPinned" class="tw:text-[#fa8c16]" />
          <h2 class="tw:m-0 tw:text-xl tw:font-semibold tw:truncate">{{ ticket?.title }}</h2>
          <span
            class="tw:text-[12px] tw:text-[#8c8c8c] tw:font-mono tw:bg-[#f5f5f5] dark:tw:bg-[#434343] dark:tw:text-[#a0a0a0] tw:px-1.5 tw:py-0.5 tw:rounded"
            >{{ ticket?.ticketCode }}</span
          >
          <a-tag :color="getStatusColor(ticket?.status || 'open')">{{
            getStatusText(ticket?.status || "open")
          }}</a-tag>
          <a-tag :color="getPriorityColor(ticket?.priority || 'low')">{{
            getPriorityText(ticket?.priority || "low")
          }}</a-tag>
        </div>
        <div class="tw:flex tw:items-center tw:gap-2">
          <a-button
            class="tw:hover:bg-gray-200 tw:dark:hover:bg-white tw:rounded-md"
            @click="exitFullscreen"
          >
            <SwapOutlined /> خروج از حالت تمام‌صفحه
          </a-button>
        </div>
      </div>

      <div class="tw:flex-1 tw:overflow-y-auto tw:p-6 tw:space-y-6">
        <!-- Reuse same blocks as drawer -->
        <div class="tw:grid lg:tw:grid-cols-3 tw:gap-6">
          <div class="tw:space-y-6 lg:tw:col-span-2">
            <a-card size="small" class="tw:rounded-xl">
              <template #title>
                <div class="tw:flex tw:items-center tw:gap-2">
                  <ClockCircleOutlined /><span>ردیابی زمان</span>
                </div>
              </template>
              <div class="tw:flex tw:flex-col tw:gap-4">
                <div class="tw:grid tw:grid-cols-2 tw:gap-4">
                  <a-statistic
                    title="زمان صرف‌شده"
                    :value="formatTimeForDisplay(ticket?.timeSpent || 0)"
                  />
                  <a-statistic
                    title="تخمین کل"
                    :value="formatTimeForDisplay(Math.max(0, (ticket?.estimatedHours || 0) * 60))"
                  />
                </div>
                <div class="tw:space-y-2">
                  <a-progress
                    :percent="getTimeProgress(ticket!)"
                    :stroke-color="getTimeProgressColor(ticket!)"
                    :trail-color="'#f0f0f0'"
                    :stroke-width="10"
                  />
                  <div class="tw:flex tw:justify-between tw:text-[12px] tw:text-[#8c8c8c]">
                    <span>{{ Math.round(getTimeProgress(ticket!)) }}% تکمیل شده</span>
                    <span class="tw:text-[#fa8c16] tw:font-medium"
                      >{{
                        formatTimeForDisplay(
                          Math.max(
                            0,
                            (ticket?.estimatedHours || 0) * 60 - (ticket?.timeSpent || 0),
                          ),
                        )
                      }}
                      باقی‌مانده</span
                    >
                  </div>
                </div>
              </div>
            </a-card>

            <a-card title="توضیحات" size="small" class="tw:rounded-xl">
              <div
                class="tw:leading-7 tw:whitespace-pre-wrap tw:text-[#595959] dark:tw:text-[#a0a0a0]"
              >
                {{ ticket?.description }}
              </div>
            </a-card>

            <a-card title="تاریخچه فعالیت" size="small" class="tw:rounded-xl">
              <a-timeline mode="right">
                <a-timeline-item
                  v-for="c in ticket?.comments || []"
                  :key="c.id"
                  :color="getTimelineColor(c.type)"
                >
                  <template #dot>
                    <component :is="getTimelineIcon(c.type)" />
                  </template>
                  <div class="tw:pr-3 tw:space-y-2">
                    <div class="tw:flex tw:items-center tw:justify-between">
                      <div class="tw:flex tw:items-center tw:gap-2">
                        <a-avatar
                          size="small"
                          :style="{ backgroundColor: getAvatarColor(c.author?.name || 'U') }"
                          >{{ (c.author?.name || "U").charAt(0) }}</a-avatar
                        >
                        <span class="tw:text-[14px] tw:font-medium">{{
                          c.author?.name || "-"
                        }}</span>
                      </div>
                      <span class="tw:text-[12px] tw:text-[#8c8c8c]">{{
                        formatDate(c.createdAt)
                      }}</span>
                    </div>
                    <div class="tw:text-[#595959] dark:tw:text-[#a0a0a0]">{{ c.content }}</div>
                    <div v-if="c.attachments?.length" class="tw:flex tw:flex-wrap tw:gap-2">
                      <a-tag
                        v-for="a in c.attachments"
                        :key="a.id"
                        class="tw:text-[11px] tw:flex tw:items-center tw:gap-1"
                      >
                        <PaperClipOutlined /> {{ a.name }}
                      </a-tag>
                    </div>
                  </div>
                </a-timeline-item>
              </a-timeline>
            </a-card>
          </div>

          <div class="tw:space-y-6">
            <a-card title="جزئیات تیکت" size="small" class="tw:rounded-xl">
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="درخواست‌دهنده">
                  <div class="tw:flex tw:items-center tw:gap-2">
                    <a-avatar
                      size="small"
                      :style="{ backgroundColor: getAvatarColor(ticket?.requester?.name || 'U') }"
                      >{{ (ticket?.requester?.name || "U").charAt(0) }}</a-avatar
                    >
                    <span>{{ ticket?.requester?.name || "نامشخص" }}</span>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item label="مسئول">
                  <div class="tw:flex tw:items-center tw:gap-2">
                    <a-avatar
                      size="small"
                      :style="{ backgroundColor: getAvatarColor(ticket?.assignee?.name || 'U') }"
                      >{{ (ticket?.assignee?.name || "U").charAt(0) }}</a-avatar
                    >
                    <span>{{ ticket?.assignee?.name || "نامشخص" }}</span>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item label="سرویس"
                  ><a-tag>{{
                    getServiceText(ticket?.service || "general")
                  }}</a-tag></a-descriptions-item
                >
                <a-descriptions-item label="تاریخ ایجاد">{{
                  formatDate(ticket?.createdAt || "")
                }}</a-descriptions-item>
                <a-descriptions-item label="آخرین به‌روزرسانی">{{
                  formatDate(ticket?.lastUpdated || "")
                }}</a-descriptions-item>
                <a-descriptions-item v-if="ticket?.dueDate" label="مهلت تحویل">
                  <span
                    :class="{
                      'tw:text-[#ff4d4f] tw:font-medium': isOverdue(ticket?.dueDate || ''),
                    }"
                    >{{ formatDate(ticket?.dueDate || "") }}</span
                  >
                </a-descriptions-item>
              </a-descriptions>
            </a-card>

            <a-card title="افزودن نظر" size="small" class="tw:rounded-xl">
              <a-form @submit.prevent="handleAddComment">
                <a-form-item
                  ><a-textarea
                    v-model:value="newComment"
                    :rows="4"
                    class="tw:rounded-lg"
                    placeholder="نظر خود را بنویسید..."
                /></a-form-item>
                <a-form-item>
                  <a-upload-dragger
                    v-model:file-list="fileList"
                    :before-upload="beforeUpload"
                    :max-count="5"
                    class="tw:my-3"
                  >
                    <p class="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p class="ant-upload-text">فایل‌های خود را اینجا بکشید یا کلیک کنید</p>
                  </a-upload-dragger>
                </a-form-item>
                <a-form-item
                  ><a-button
                    type="primary"
                    html-type="submit"
                    :loading="isAddingComment"
                    class="tw:rounded-lg tw:font-medium"
                  >
                    <SendOutlined /> ارسال نظر
                  </a-button></a-form-item
                >
              </a-form>
            </a-card>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTicketStore } from "@/stores/ticket";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import type { Ticket } from "@/types/ticket";
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
const getCountdownValue = () => dayjs().add(8, "hour").valueOf();
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
</style>
