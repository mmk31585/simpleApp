
import type { User } from "@/types/user";

export type TicketStatus = "open" | "in-progress" | "closed";
export type Priority = "low" | "medium" | "high" | "critical";
export type Service = "technical" | "billing" | "general" | "bug-report" | "feature-request";

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  type: "comment" | "status-change" | "assignment" | "attachment";
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Ticket {
  id: string;
  ticketCode: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  service: Service;
  requester: User;
  assignee: User;
  createdAt: string;
  lastUpdated: string;
  dueDate?: string;
  estimatedHours: number;
  timeSpent: number;
  isTimerActive: boolean;
  timerStartTime?: string | null;
  isPinned: boolean;
  tags: string[];
  comments: Comment[];
  attachments: Attachment[];
}

export interface TicketFilters {
  search: string;
  status: TicketStatus | "all";
  priority: Priority | "all";
  service: Service | "all";
  dateRange: [string, string] | null;
  assignee: string | "all";
}
