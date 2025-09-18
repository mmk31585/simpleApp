<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- <a-layout class="tw:h-full tw:bg-white/60 tw:dark:bg-white/5 tw:backdrop-blur">
    <a-layout-sider :width="300" class="tw:bg-transparent tw:border tw:border-black/5 tw:dark:border-white/10"
      :theme="'light'">
      <div class="tw:p-3 tw:flex tw:items-center tw:gap-2">
        <a-input-search v-model:value="q" placeholder="جستجو..." allowClear @search="onSearch" />
        <a-segmented v-model:value="seg" :options="['خوانده‌نشده', 'همه']" style="direction: ltr" />
      </div>

      <a-list class="tw:px-2 tw:pb-3 tw:overflow-y-auto" item-layout="horizontal" :data-source="filteredConversations"
        :locale="{ emptyText: 'پیامی نیست' }">
        <template #renderItem="{ item }">
          <a-list-item :class="[
            'tw:rounded-xl tw:cursor-pointer  tw:px-2',
            activeId === item.id && 'tw:bg-[#3b82f6]/10 tw:dark:bg-[#3b82f6]/20',
          ]" @click="selectConversation(item.id)">
            <a-list-item-meta :title="metaTitle(item)" :description="item.lastPreview">
              <template #avatar>
                <a-badge :count="item.unread" :overflow-count="99" :offset="[0, 8]">
                  <a-avatar :style="{ background: item.color }">{{ initials(item.name) }}</a-avatar>
                </a-badge>
              </template>
</a-list-item-meta>
<template #actions>
              <span class="tw:text-xs tw:opacity-70">{{ fmtTime(item.lastAt) }}</span>
            </template>
</a-list-item>
</template>
</a-list>
</a-layout-sider>

<a-layout>
  <a-layout-header class="tw:!bg-transparent tw:px-4 tw:flex tw:items-center tw:justify-between">
    <div class="tw:flex tw:items-center tw:gap-3">
      <a-avatar v-if="activeConv" :style="{ background: activeConv.color }">
        {{ activeConv ? initials(activeConv.name) : "?" }}
      </a-avatar>
      <div>
        <div class="tw:font-medium tw:text-base">
          {{ activeConv?.name || "انتخاب گفتگو" }}
        </div>
        <div class="tw:text-xs tw:opacity-70" v-if="activeConv">
          آخرین فعالیت: {{ fmtTime(activeConv.lastAt) }}
        </div>
      </div>
    </div>
    <div class="tw:flex tw:items-center tw:gap-2">
      <a-button v-if="activeConv" @click="markAsRead(activeConv!.id)" size="small">علامت خوانده</a-button>
      <a-dropdown v-if="activeConv" placement="bottomLeft">
        <a-button size="small">بیشتر</a-button>
        <template #overlay>
              <a-menu>
                <a-menu-item>بی‌صدا</a-menu-item>
                <a-menu-item>آرشیو</a-menu-item>
                <a-menu-item danger>حذف گفتگو</a-menu-item>
              </a-menu>
            </template>
      </a-dropdown>
    </div>
  </a-layout-header>

  <a-layout-content class="tw:h-auto tw:flex tw:flex-col">
    <div ref="scroller" class="tw:flex-1 tw:overflow-y-auto tw:px-4 tw:pb-4">
      <a-empty v-if="!activeId" class="tw:mt-24" description="گفتگویی انتخاب نشده" />
      <template v-else>
            <div v-for="(group, gi) in groupedMessages" :key="gi" class="tw:mb-6">
              <div class="tw:sticky tw:top-0 tw:z-10 tw:flex tw:justify-center">
                <span
                  class="tw:text-xs tw:px-3 tw:py-1 tw:rounded-full tw:bg-black/5 tw:dark:bg-white/10 tw:backdrop-blur">
                  {{ group.title }}
                </span>
              </div>

              <div class="tw:space-y-2 tw:mt-3">
                <div v-for="m in group.items" :key="m.id"
                  :class="['tw:flex tw:items-end', m.mine ? 'tw:justify-end' : 'tw:justify-start']">
                  <a-avatar v-if="!m.mine" :style="{ background: activeConv?.color }" size="small" class="tw:mx-2">{{
                    initials(activeConv?.name || "?") }}</a-avatar>

                  <div :class="[
                    'tw:max-w-[80%] tw:md:max-w-[70%] tw:lg:max-w-[60%] tw:rounded-2xl tw:px-3 tw:py-2 tw:leading-relaxed tw:shadow-sm',
                    m.mine
                      ? 'tw:bg-[#3b82f6]/90 tw:text-white'
                      : 'tw:bg-white tw:dark:bg-white/10',
                  ]">
                    <div v-if="m.replyTo" class="tw:text-xs tw:opacity-75 tw:mb-1 tw:line-clamp-1">
                      پاسخ به: {{ m.replyTo.text }}
                    </div>
                    <div class="tw:whitespace-pre-wrap">{{ m.text }}</div>

                    <div class="tw:flex tw:items-center tw:gap-2 tw:mt-1 tw:text-[10px] tw:opacity-80 tw/justify-end">
                      <span>{{ fmtClock(m.at) }}</span>
                      <template v-if="m.mine">
                        <a-badge :status="m.status === 'sent'
                          ? 'processing'
                          : m.status === 'seen'
                            ? 'success'
                            : 'default'
                          " />
                        <span>
                          {{
                            m.status === "sending"
                              ? "در حال ارسال"
                              : m.status === "sent"
                                ? "ارسال شد"
                                : "دیده شد"
                          }}
                        </span>
                      </template>
    </div>
    </div>

    <a-avatar v-if="m.mine" :style="{ background: me.color }" size="small" class="tw:mx-2">{{
      initials(me.name)
      }}</a-avatar>
    </div>
    </div>
    </div>

    <div v-if="typing" class="tw:flex tw:items-center tw:gap-2 tw:px-2 tw:opacity-70">
      <a-avatar :style="{ background: activeConv?.color }" size="small">{{
        initials(activeConv?.name || "?")
        }}</a-avatar>
      <div class="dots"><span></span><span></span><span></span></div>
      <span class="tw:text-xs">در حال نوشتن…</span>
    </div>
    </template>
    </div>

    <div
      class="tw:px-3 tw:py-3 tw:border-t tw:border-black/10 tw:dark:border-white/10 tw:bg-white/70 tw:dark:bg-white/5">
      <div class="tw:flex tw:items-end tw:gap-2">
        <a-upload v-model:file-list="files" :before-upload="() => false">
          <a-button type="text">پیوست</a-button>
        </a-upload>

        <a-textarea v-model:value="draft" :auto-size="{ minRows: 1, maxRows: 4 }" :maxlength="1500"
          :disabled="!activeId" placeholder="پیامت را بنویس…" @pressEnter="onEnter" />
        <a-button type="primary" :disabled="!canSend" @click="send"> ارسال </a-button>
      </div>
    </div>
  </a-layout-content>
</a-layout>
</a-layout> -->
</template>

<script setup lang="ts">
// import { computed, h, nextTick, onMounted, ref, watch } from "vue";
// import type { UploadFile } from "ant-design-vue";

// type Conv = {
//   id: number;
//   name: string;
//   color: string;
//   lastAt: number;
//   lastPreview: string;
//   unread: number;
// };
// type MsgStatus = "sending" | "sent" | "seen";
// type Msg = {
//   id: string;
//   convId: number;
//   mine: boolean;
//   text: string;
//   at: number;
//   status?: MsgStatus;
//   replyTo?: { id: string; text: string };
// };

// const q = ref("");
// const seg = ref<"همه" | "خوانده‌نشده">("همه");
// const conversations = ref<Conv[]>([
//   {
//     id: 1,
//     name: "تیم فروش",
//     color: "#3b82f6",
//     lastAt: Date.now() - 1000 * 60 * 5,
//     lastPreview: "فاکتور ارسال شد ✅",
//     unread: 2,
//   },
//   {
//     id: 2,
//     name: "پشتیبانی",
//     color: "#10b981",
//     lastAt: Date.now() - 1000 * 60 * 40,
//     lastPreview: "درحال بررسی مورد...",
//     unread: 0,
//   },
//   {
//     id: 3,
//     name: "توسعه بک‌اند",
//     color: "#f59e0b",
//     lastAt: Date.now() - 1000 * 60 * 120,
//     lastPreview: "PR ادغام شد 🔧",
//     unread: 1,
//   },
// ]);
// const me = { name: "من", color: "#6366f1" };

// const messages = ref<Msg[]>([
//   {
//     id: "a1",
//     convId: 1,
//     mine: false,
//     text: "سلام، سفارش #241 تایید شد.",
//     at: Date.now() - 1000 * 60 * 60,
//   },
//   {
//     id: "a2",
//     convId: 1,
//     mine: true,
//     text: "عالیه، زمان ارسال رو بگو لطفاً.",
//     at: Date.now() - 1000 * 60 * 58,
//     status: "seen",
//   },
//   {
//     id: "a3",
//     convId: 1,
//     mine: false,
//     text: "امروز تا ۴ عصر تحویل می‌دیم.",
//     at: Date.now() - 1000 * 60 * 50,
//   },
//   {
//     id: "b1",
//     convId: 3,
//     mine: false,
//     text: "Hotfix روی پروفروداکشن رفت.",
//     at: Date.now() - 1000 * 60 * 130,
//   },
// ]);

// const activeId = ref<number | null>(1);
// const draft = ref("");
// const files = ref<UploadFile<any>[]>([]);
// const typing = ref(false);

// const activeConv = computed(() => conversations.value.find((c) => c.id === activeId.value) || null);
// const filteredConversations = computed(() => {
//   let list = conversations.value;
//   if (q.value.trim()) {
//     const s = q.value.trim().toLowerCase();
//     list = list.filter(
//       (c) => c.name.toLowerCase().includes(s) || c.lastPreview.toLowerCase().includes(s),
//     );
//   }
//   if (seg.value === "خوانده‌نشده") list = list.filter((c) => c.unread > 0);
//   return [...list].sort((a, b) => b.lastAt - a.lastAt);
// });

// function selectConversation(id: number) {
//   activeId.value = id;
//   markAsRead(id);
//   nextTick(scrollToBottom);
// }
// function markAsRead(id: number) {
//   const c = conversations.value.find((c) => c.id === id);
//   if (c) c.unread = 0;
// }
// // function mute(id: number) {
// //   /* TODO: اتصال به API */
// // }
// // function archive(id: number) {
// //   /* TODO */
// // }
// // function removeConv(id: number) {
// //   conversations.value = conversations.value.filter((c) => c.id !== id);
// //   if (activeId.value === id) activeId.value = conversations.value[0]?.id ?? null;
// // }

// const convMessages = computed(() =>
//   activeId.value ? messages.value.filter((m) => m.convId === activeId.value) : [],
// );

// const groupedMessages = computed(() => {
//   const byDay = new Map<string, Msg[]>();
//   convMessages.value.forEach((m) => {
//     const key = new Date(m.at).toDateString();
//     const list = byDay.get(key) ?? [];
//     list.push(m);
//     byDay.set(key, list);
//   });
//   return Array.from(byDay.entries()).map(([k, items]) => ({
//     title: labelForDate(new Date(k)),
//     items: items.sort((a, b) => a.at - b.at),
//   }));
// });

// function labelForDate(d: Date) {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const target = new Date(d);
//   target.setHours(0, 0, 0, 0);
//   const diff = (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24);
//   if (diff === 0) return "امروز";
//   if (diff === 1) return "دیروز";
//   return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(d);
// }

// function initials(name?: string) {
//   if (!name) return "?";
//   const parts = name.split(" ");
//   return (parts[0][0] || "") + (parts[1]?.[0] || "");
// }

// function metaTitle(item: Conv) {
//   return h("div", { class: "tw:flex tw:items-center tw:justify-between tw:gap-2" }, [
//     h("span", { class: "tw:font-medium tw:text-sm" }, item.name),
//     // h("span", { class: "tw:text-[10px] tw:opacity-60" }, fmtTime(item.lastAt)),
//   ]);
// }

// function fmtTime(ts: number) {
//   const d = new Date(ts);
//   return new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" }).format(d);
// }
// function fmtClock(ts: number) {
//   return fmtTime(ts);
// }

// const scroller = ref<HTMLDivElement>();
// function scrollToBottom() {
//   const el = scroller.value;
//   if (!el) return;
//   el.scrollTop = el.scrollHeight;
// }

// const canSend = computed(
//   () => !!activeId.value && (!!draft.value.trim() || files.value.length > 0),
// );

// function onEnter(e: KeyboardEvent) {
//   if (e.shiftKey) return;
//   e.preventDefault();
//   send();
// }

// function send() {
//   if (!canSend.value) return;
//   const now = Date.now();
//   const text = draft.value.trim();
//   const convId = activeId.value!;
//   if (text) {
//     const id = `${convId}-${now}`;
//     messages.value.push({ id, convId, mine: true, text, at: now, status: "sending" });
//     draft.value = "";
//     nextTick(scrollToBottom);
//     setTimeout(() => {
//       const msg = messages.value.find((m) => m.id === id);
//       if (msg) msg.status = "sent";
//     }, 600);
//     setTimeout(() => {
//       const msg = messages.value.find((m) => m.id === id);
//       if (msg) msg.status = "seen";
//     }, 2000);
//   }
//   if (files.value.length) {
//     const summary = files.value.map((f) => f.name).join("، ");
//     messages.value.push({
//       id: `f-${now}`,
//       convId,
//       mine: true,
//       text: `📎 پیوست: ${summary}`,
//       at: now + 10,
//       status: "sent",
//     });
//     files.value = [];
//     nextTick(scrollToBottom);
//   }
//   typing.value = true;
//   setTimeout(() => {
//     typing.value = false;
//     const reply = { id: `r-${now}`, convId, mine: false, text: "دریافت شد ✅", at: now + 18000 };
//     messages.value.push(reply);
//     const c = conversations.value.find((c) => c.id === convId);
//     if (c) {
//       c.lastAt = reply.at;
//       c.lastPreview = reply.text;
//     }
//     nextTick(scrollToBottom);
//   }, 1600);
// }

// function onSearch() { }
// onMounted(() => nextTick(scrollToBottom));

// watch(convMessages, () => nextTick(scrollToBottom));
</script>

<style scoped>
/* .dots {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.5;
  animation: blink 1.2s infinite;
}

.dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {

  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }

  40% {
    opacity: 1;
    transform: translateY(-2px);
  }
} */
</style>
