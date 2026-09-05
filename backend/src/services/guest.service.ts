import { prisma } from '../prisma/client';
import { generateInviteToken } from '../utils/tokenGenerator';
import { AppError } from '../utils/apiResponse';
import { RsvpStatus } from '@prisma/client';

export interface CreateGuestInput {
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
  numberOfGuests?: number;
  relationship?: string;
  inviteToken?: string;
}

export interface GuestQueryOptions {
  eventId?: string;
  search?: string;
  rsvpStatus?: RsvpStatus;
  isOpened?: boolean;
  page?: number;
  limit?: number;
}

export class GuestService {
  private static async getUniqueToken(): Promise<string> {
    let token = '';
    let exists = true;
    while (exists) {
      token = generateInviteToken(7);
      const found = await prisma.guest.findUnique({
        where: { inviteToken: token },
      });
      if (!found) exists = false;
    }
    return token;
  }

  static async getGuests(options: GuestQueryOptions) {
    const {
      eventId,
      search,
      rsvpStatus,
      isOpened,
      page = 1,
      limit = 50,
    } = options;

    const where: any = {};

    if (eventId) {
      where.eventId = eventId;
    }

    if (rsvpStatus) {
      where.rsvpStatus = rsvpStatus;
    }

    if (isOpened !== undefined) {
      where.openedAt = isOpened ? { not: null } : null;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { relationship: { contains: search, mode: 'insensitive' } },
        { inviteToken: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [total, guests] = await Promise.all([
      prisma.guest.count({ where }),
      prisma.guest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              graduateName: true,
            },
          },
        },
      }),
    ]);

    return {
      guests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getGuestById(id: string) {
    const guest = await prisma.guest.findUnique({
      where: { id },
      include: {
        event: true,
        messages: true,
      },
    });

    if (!guest) {
      throw new AppError('Guest not found', 404);
    }

    return guest;
  }

  static async createGuest(data: CreateGuestInput) {
    const token = data.inviteToken || (await this.getUniqueToken());

    return prisma.guest.create({
      data: {
        eventId: data.eventId,
        name: data.name.trim(),
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        numberOfGuests: data.numberOfGuests || 1,
        relationship: data.relationship?.trim() || null,
        inviteToken: token,
      },
    });
  }

  static async updateGuest(id: string, data: Partial<CreateGuestInput> & { rsvpStatus?: RsvpStatus; rsvpMessage?: string }) {
    await this.getGuestById(id);

    return prisma.guest.update({
      where: { id },
      data: {
        name: data.name?.trim(),
        email: data.email?.trim() || undefined,
        phone: data.phone?.trim() || undefined,
        numberOfGuests: data.numberOfGuests,
        relationship: data.relationship?.trim() || undefined,
        rsvpStatus: data.rsvpStatus,
        rsvpMessage: data.rsvpMessage,
      },
    });
  }

  static async deleteGuest(id: string) {
    await this.getGuestById(id);
    return prisma.guest.delete({
      where: { id },
    });
  }

  static async importGuests(
    eventId: string,
    guestList: Array<{ name: string; email?: string; phone?: string; relationship?: string; numberOfGuests?: number }>
  ) {
    const created: any[] = [];

    for (const item of guestList) {
      if (!item.name || item.name.trim() === '') continue;

      const token = await this.getUniqueToken();
      const guest = await prisma.guest.create({
        data: {
          eventId,
          name: item.name.trim(),
          email: item.email?.trim() || null,
          phone: item.phone?.trim() || null,
          relationship: item.relationship?.trim() || null,
          numberOfGuests: Number(item.numberOfGuests) || 1,
          inviteToken: token,
        },
      });
      created.push(guest);
    }

    return created;
  }
}
