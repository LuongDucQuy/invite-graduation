import { prisma } from '../prisma/client';
import { AppError } from '../utils/apiResponse';
import { RsvpStatus } from '@prisma/client';

export class InvitationService {
  static async getInvitationByToken(token: string) {
    if (!token || typeof token !== 'string') {
      throw new AppError('Invalid invitation token', 400);
    }

    const guest = await prisma.guest.findUnique({
      where: { inviteToken: token },
      include: {
        event: {
          include: {
            timelines: {
              orderBy: { sortOrder: 'asc' },
            },
            galleries: {
              orderBy: { sortOrder: 'asc' },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 50,
            },
          },
        },
      },
    });

    if (!guest) {
      throw new AppError('Thiệp mời không tồn tại hoặc đường dẫn không hợp lệ.', 404);
    }

    // Mark as opened if first time opened
    if (!guest.openedAt) {
      await prisma.guest.update({
        where: { id: guest.id },
        data: { openedAt: new Date() },
      });
      guest.openedAt = new Date();
    }

    // Sanitize guest response (do not expose other guests or backend internals)
    return {
      guest: {
        id: guest.id,
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        inviteToken: guest.inviteToken,
        numberOfGuests: guest.numberOfGuests,
        relationship: guest.relationship,
        rsvpStatus: guest.rsvpStatus,
        rsvpMessage: guest.rsvpMessage,
        openedAt: guest.openedAt,
        confirmedAt: guest.confirmedAt,
      },
      event: {
        id: guest.event.id,
        title: guest.event.title,
        graduateName: guest.event.graduateName,
        graduateMessage: guest.event.graduateMessage,
        description: guest.event.description,
        eventDate: guest.event.eventDate,
        startTime: guest.event.startTime,
        endTime: guest.event.endTime,
        venueName: guest.event.venueName,
        venueAddress: guest.event.venueAddress,
        latitude: guest.event.latitude,
        longitude: guest.event.longitude,
        googleMapUrl: guest.event.googleMapUrl,
        coverImage: guest.event.coverImage,
        avatarImage: guest.event.avatarImage,
        backgroundMusic: guest.event.backgroundMusic,
        dressCode: guest.event.dressCode,
        timelines: guest.event.timelines,
        galleries: guest.event.galleries,
        messages: guest.event.messages,
      },
    };
  }

  static async submitRsvp(
    token: string,
    data: {
      rsvpStatus: RsvpStatus;
      numberOfGuests?: number;
      rsvpMessage?: string;
      guestName?: string;
    }
  ) {
    const guest = await prisma.guest.findUnique({
      where: { inviteToken: token },
    });

    if (!guest) {
      throw new AppError('Thiệp mời không tồn tại hoặc đường dẫn không hợp lệ.', 404);
    }

    const updatedGuest = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        rsvpStatus: data.rsvpStatus,
        numberOfGuests: data.numberOfGuests !== undefined ? data.numberOfGuests : guest.numberOfGuests,
        rsvpMessage: data.rsvpMessage,
        confirmedAt: new Date(),
        name: data.guestName?.trim() || guest.name,
      },
    });

    // If message is provided with RSVP, also record to public messages table if desired
    if (data.rsvpMessage && data.rsvpMessage.trim()) {
      await prisma.message.create({
        data: {
          eventId: guest.eventId,
          guestId: guest.id,
          guestName: data.guestName?.trim() || guest.name,
          content: data.rsvpMessage.trim(),
        },
      });
    }

    return updatedGuest;
  }

  static async getInvitationMessages(token: string) {
    const guest = await prisma.guest.findUnique({
      where: { inviteToken: token },
      select: { eventId: true },
    });

    if (!guest) {
      throw new AppError('Thiệp mời không tồn tại hoặc đường dẫn không hợp lệ.', 404);
    }

    return prisma.message.findMany({
      where: { eventId: guest.eventId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  static async postInvitationMessage(token: string, content: string, customName?: string) {
    const guest = await prisma.guest.findUnique({
      where: { inviteToken: token },
    });

    if (!guest) {
      throw new AppError('Thiệp mời không tồn tại hoặc đường dẫn không hợp lệ.', 404);
    }

    if (!content || !content.trim()) {
      throw new AppError('Nội dung lời chúc không được để trống.', 400);
    }

    return prisma.message.create({
      data: {
        eventId: guest.eventId,
        guestId: guest.id,
        guestName: customName?.trim() || guest.name,
        content: content.trim(),
      },
    });
  }
}
