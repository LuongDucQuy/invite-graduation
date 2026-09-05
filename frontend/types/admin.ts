import { RsvpStatus } from './invitation';

export interface AdminUser {
  id: string;
  username: string;
  createdAt?: string;
}

export interface AuthResponse {
  admin: AdminUser;
  token: string;
}

export interface DashboardStats {
  totalGuests: number;
  openedGuests: number;
  unopenedGuests: number;
  attendingGuests: number;
  notAttendingGuests: number;
  pendingGuests: number;
  totalAttendingPax: number;
  totalMessages: number;
  rsvpBreakdown: Array<{ name: string; value: number; color: string }>;
  openBreakdown: Array<{ name: string; value: number; color: string }>;
}

export interface GuestListResponse {
  guests: Array<{
    id: string;
    eventId: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    inviteToken: string;
    numberOfGuests: number;
    relationship?: string | null;
    rsvpStatus: RsvpStatus;
    rsvpMessage?: string | null;
    openedAt?: string | null;
    confirmedAt?: string | null;
    createdAt: string;
    event?: {
      id: string;
      title: string;
      graduateName: string;
    };
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
