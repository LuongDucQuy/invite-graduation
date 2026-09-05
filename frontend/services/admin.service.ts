import { apiRequest } from '../lib/api';
import { AuthResponse, DashboardStats, GuestListResponse } from '../types/admin';
import { EventData, GalleryItem, MessageItem, TimelineItem } from '../types/invitation';

export const AdminService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const res = await apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return res.data;
  },

  getProfile: async () => {
    const res = await apiRequest('/api/auth/me', { requiresAuth: true });
    return res.data;
  },

  getStats: async (eventId?: string): Promise<DashboardStats> => {
    const query = eventId ? `?eventId=${eventId}` : '';
    const res = await apiRequest<DashboardStats>(`/api/stats${query}`, { requiresAuth: true });
    return res.data;
  },

  getEvents: async (): Promise<EventData[]> => {
    const res = await apiRequest<EventData[]>('/api/events', { requiresAuth: true });
    return res.data;
  },

  getPrimaryEvent: async (): Promise<EventData> => {
    const res = await apiRequest<EventData>('/api/events/primary');
    return res.data;
  },

  getEventById: async (id: string): Promise<EventData> => {
    const res = await apiRequest<EventData>(`/api/events/${id}`, { requiresAuth: true });
    return res.data;
  },

  updateEvent: async (id: string, payload: Partial<EventData>): Promise<EventData> => {
    const res = await apiRequest<EventData>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  getGuests: async (params: {
    eventId?: string;
    search?: string;
    rsvpStatus?: string;
    isOpened?: boolean;
    page?: number;
    limit?: number;
  }): Promise<GuestListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.eventId) queryParams.append('eventId', params.eventId);
    if (params.search) queryParams.append('search', params.search);
    if (params.rsvpStatus) queryParams.append('rsvpStatus', params.rsvpStatus);
    if (params.isOpened !== undefined) queryParams.append('isOpened', String(params.isOpened));
    if (params.page) queryParams.append('page', String(params.page));
    if (params.limit) queryParams.append('limit', String(params.limit));

    const res = await apiRequest<GuestListResponse>(`/api/guests?${queryParams.toString()}`, {
      requiresAuth: true,
    });
    return res.data;
  },

  createGuest: async (payload: {
    eventId: string;
    name: string;
    email?: string;
    phone?: string;
    relationship?: string;
    numberOfGuests?: number;
  }) => {
    const res = await apiRequest('/api/guests', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  updateGuest: async (id: string, payload: any) => {
    const res = await apiRequest(`/api/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  deleteGuest: async (id: string) => {
    const res = await apiRequest(`/api/guests/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
    return res.data;
  },

  importGuests: async (eventId: string, guests: any[]) => {
    const res = await apiRequest('/api/guests/import', {
      method: 'POST',
      body: JSON.stringify({ eventId, guests }),
      requiresAuth: true,
    });
    return res.data;
  },

  // Timelines
  getTimelines: async (eventId: string): Promise<TimelineItem[]> => {
    const res = await apiRequest<TimelineItem[]>(`/api/timeline/event/${eventId}`);
    return res.data;
  },

  createTimeline: async (payload: Partial<TimelineItem>) => {
    const res = await apiRequest('/api/timeline', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  updateTimeline: async (id: string, payload: Partial<TimelineItem>) => {
    const res = await apiRequest(`/api/timeline/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  deleteTimeline: async (id: string) => {
    const res = await apiRequest(`/api/timeline/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
    return res.data;
  },

  // Gallery
  getGalleries: async (eventId: string): Promise<GalleryItem[]> => {
    const res = await apiRequest<GalleryItem[]>(`/api/gallery/event/${eventId}`);
    return res.data;
  },

  createGallery: async (payload: Partial<GalleryItem>) => {
    const res = await apiRequest('/api/gallery', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  updateGallery: async (id: string, payload: Partial<GalleryItem>) => {
    const res = await apiRequest(`/api/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
    return res.data;
  },

  deleteGallery: async (id: string) => {
    const res = await apiRequest(`/api/gallery/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
    return res.data;
  },

  // Messages
  getMessages: async (eventId: string): Promise<MessageItem[]> => {
    const res = await apiRequest<MessageItem[]>(`/api/messages/event/${eventId}`, {
      requiresAuth: true,
    });
    return res.data;
  },

  deleteMessage: async (id: string) => {
    const res = await apiRequest(`/api/messages/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
    return res.data;
  },
};
