import { apiRequest } from '../lib/api';
import { InvitationResponse, MessageItem, RsvpStatus } from '../types/invitation';

export const InvitationService = {
  getInvitation: async (token: string): Promise<InvitationResponse> => {
    const res = await apiRequest<InvitationResponse>(`/api/invitations/${token}`);
    return res.data;
  },

  submitRsvp: async (
    token: string,
    payload: {
      rsvpStatus: RsvpStatus;
      numberOfGuests?: number;
      rsvpMessage?: string;
      guestName?: string;
    }
  ) => {
    const res = await apiRequest(`/api/invitations/${token}/rsvp`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  getMessages: async (token: string): Promise<MessageItem[]> => {
    const res = await apiRequest<MessageItem[]>(`/api/invitations/${token}/messages`);
    return res.data;
  },

  postMessage: async (token: string, content: string, guestName?: string): Promise<MessageItem> => {
    const res = await apiRequest<MessageItem>(`/api/invitations/${token}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, guestName }),
    });
    return res.data;
  },
};
