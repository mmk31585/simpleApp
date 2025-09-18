import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { Ticket, TicketStatus, Priority, Service } from "@/types/ticket";
import { mockTickets } from "@/api/mockTickets";

export const useTicketStore = defineStore("ticket", () => {
  const tickets = ref<Ticket[]>(mockTickets);
  const selectedTicket = ref<Ticket | null>(null);
  const isDrawerVisible = ref(false);
  const searchQuery = ref("");
  const statusFilter = ref<TicketStatus | "all">("all");
  const priorityFilter = ref<Priority | "all">("all");
  const serviceFilter = ref<Service | "all">("all");
  const dateRange = ref<[string, string] | null>(null);
  const selectedTicketIds = ref<string[]>([]);

  const nowMs = ref<number>(Date.now());
  let ticker: number | null = null;

  const toStartOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const toEndOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
  };

  const safeStr = (v: unknown) => (typeof v === "string" ? v : "") || "";

  const filteredTickets = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    let filtered = tickets.value.slice();

    if (q) {
      filtered = filtered.filter((ticket) => {
        const fields = [
          safeStr(ticket.title),
          safeStr(ticket.description),
          safeStr(ticket.ticketCode),
          safeStr(ticket.assignee?.name),
        ];
        return fields.some((f) => f.toLowerCase().includes(q));
      });
    }

    if (statusFilter.value !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter.value);
    }
    if (priorityFilter.value !== "all") {
      filtered = filtered.filter((t) => t.priority === priorityFilter.value);
    }
    if (serviceFilter.value !== "all") {
      filtered = filtered.filter((t) => t.service === serviceFilter.value);
    }

    if (dateRange.value) {
      const [start, end] = dateRange.value;
      const startDate = toStartOfDay(new Date(start));
      const endDate = toEndOfDay(new Date(end));
      filtered = filtered.filter((t) => {
        const ticketDate = new Date(t.createdAt);
        return ticketDate >= startDate && ticketDate <= endDate;
      });
    }

    filtered.sort((a, b) => {
      const pinDiff = Number(b.isPinned || false) - Number(a.isPinned || false);
      if (pinDiff !== 0) return pinDiff;
      const aTime = new Date(a.lastUpdated ?? a.createdAt).getTime();
      const bTime = new Date(b.lastUpdated ?? b.createdAt).getTime();
      return bTime - aTime;
    });

    return filtered;
  });

  const ticketCounts = computed(() => {
    const counts = {
      open: 0,
      "in-progress": 0,
      closed: 0,
      total: tickets.value.length,
    };
    for (const t of tickets.value) {
      switch (t.status) {
        case "open":
          counts.open++;
          break;
        case "in-progress":
          counts["in-progress"]++;
          break;
        case "closed":
          counts.closed++;
          break;
      }
    }
    return counts;
  });

  const priorityCounts = computed(() => {
    const counts = { low: 0, medium: 0, high: 0, critical: 0 };
    for (const t of tickets.value) {
      switch (t.priority) {
        case "low":
          counts.low++;
          break;
        case "medium":
          counts.medium++;
          break;
        case "high":
          counts.high++;
          break;
        case "critical":
          counts.critical++;
          break;
      }
    }
    return counts;
  });

  const openTicketDrawer = (ticket: Ticket) => {
    selectedTicket.value = ticket;
    isDrawerVisible.value = true;
  };

  const closeTicketDrawer = () => {
    isDrawerVisible.value = false;
    selectedTicket.value = null;
  };

  const findTicket = (ticketId: string) => tickets.value.find((t) => t.id === ticketId);

  const touch = (t: Ticket) => {
    t.lastUpdated = new Date().toISOString();
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    const t = findTicket(ticketId);
    if (!t) return;
    t.status = status;
    touch(t);
  };

  const updateTicketPriority = (ticketId: string, priority: Priority) => {
    const t = findTicket(ticketId);
    if (!t) return;
    t.priority = priority;
    touch(t);
  };

  const assignTicket = (ticketId: string, assigneeId: string, assigneeName: string) => {
    const t = findTicket(ticketId);
    if (!t) return;
    t.assignee = { id: assigneeId, name: assigneeName, avatar: assigneeName.charAt(0) };
    touch(t);
  };

  const startTicker = () => {
    if (ticker != null) return;
    ticker = window.setInterval(() => {
      nowMs.value = Date.now();
    }, 1000);
  };
  const stopTicker = () => {
    if (ticker == null) return;
    clearInterval(ticker);
    ticker = null;
  };

  const hasActiveTimers = computed(() => tickets.value.some((t) => t.isTimerActive));

  watch(
    hasActiveTimers,
    (active) => {
      if (active) startTicker();
      else stopTicker();
    },
    { immediate: true },
  );

  const toggleTimer = (ticketId: string) => {
    const t = findTicket(ticketId);
    if (!t) return;
    if (!t.timeSpent) t.timeSpent = 0;
    t.isTimerActive = !t.isTimerActive;
    if (t.isTimerActive) {
      t.timerStartTime = new Date().toISOString();
      startTicker();
    } else if (t.timerStartTime) {
      const startTime = new Date(t.timerStartTime);
      const elapsedMinutes = Math.floor((Date.now() - startTime.getTime()) / 60000);
      t.timeSpent += Math.max(0, elapsedMinutes);
      t.timerStartTime = null;
    }
    touch(t);
    if (!hasActiveTimers.value) stopTicker();
  };

  const getCurrentTimeSpentMinutes = (ticketId: string): number => {
    const t = findTicket(ticketId);
    if (!t) return 0;
    const base = t.timeSpent || 0;
    if (t.isTimerActive && t.timerStartTime) {
      const start = new Date(t.timerStartTime).getTime();
      const extra = Math.floor((nowMs.value - start) / 60000);
      return base + Math.max(0, extra);
    }
    return base;
  };

  const addComment = (ticketId: string, content: string, authorName: string) => {
    const t = findTicket(ticketId);
    if (!t) return;
    const comment = {
      id: Date.now().toString(),
      content,
      author: { id: authorName, name: authorName, avatar: authorName.charAt(0) },
      createdAt: new Date().toISOString(),
      type: "comment" as const,
    };
    t.comments.push(comment);
    touch(t);
  };

  const togglePinTicket = (ticketId: string) => {
    const t = findTicket(ticketId);
    if (!t) return;
    t.isPinned = !t.isPinned;
    touch(t);
  };

  const bulkUpdateStatus = (ticketIds: string[], status: TicketStatus) => {
    const uniq = Array.from(new Set(ticketIds));
    for (const id of uniq) updateTicketStatus(id, status);
    selectedTicketIds.value = [];
  };

  const resetFilters = () => {
    searchQuery.value = "";
    statusFilter.value = "all";
    priorityFilter.value = "all";
    serviceFilter.value = "all";
    dateRange.value = null;
  };

  return {
    tickets,
    selectedTicket,
    isDrawerVisible,
    searchQuery,
    statusFilter,
    priorityFilter,
    serviceFilter,
    dateRange,
    selectedTicketIds,
    filteredTickets,
    ticketCounts,
    priorityCounts,
    openTicketDrawer,
    closeTicketDrawer,
    updateTicketStatus,
    updateTicketPriority,
    assignTicket,
    toggleTimer,
    getCurrentTimeSpentMinutes,
    addComment,
    togglePinTicket,
    bulkUpdateStatus,
    resetFilters,
  };
});
