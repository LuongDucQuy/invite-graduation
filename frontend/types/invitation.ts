export type RsvpStatus = 'PENDING' | 'ATTENDING' | 'NOT_ATTENDING';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface TimelineItem {
  id: string;
  eventId: string;
  time: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  sortOrder: number;
}

export interface GalleryItem {
  id: string;
  eventId: string;
  imageUrl: string;
  caption?: string | null;
  sortOrder: number;
}

export interface MessageItem {
  id: string;
  eventId: string;
  guestId?: string | null;
  guestName: string;
  content: string;
  createdAt: string;
}

export interface EventData {
  id: string;
  title: string;
  graduateName: string;
  graduateMessage?: string | null;
  description?: string | null;
  eventDate: string;
  startTime: string;
  endTime?: string | null;
  venueName: string;
  venueAddress: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapUrl?: string | null;
  coverImage?: string | null;
  avatarImage?: string | null;
  backgroundMusic?: string | null;
  dressCode?: string | null;
  timelines?: TimelineItem[];
  galleries?: GalleryItem[];
  messages?: MessageItem[];
}

export interface GuestData {
  id: string;
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
}

export interface InvitationResponse {
  guest: GuestData;
  event: EventData;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}
