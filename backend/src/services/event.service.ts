import { prisma } from '../prisma/client';
import { AppError } from '../utils/apiResponse';

export interface CreateEventInput {
  title: string;
  graduateName: string;
  graduateMessage?: string;
  description?: string;
  eventDate: string | Date;
  startTime: string;
  endTime?: string;
  venueName: string;
  venueAddress: string;
  latitude?: number;
  longitude?: number;
  googleMapUrl?: string;
  coverImage?: string;
  avatarImage?: string;
  backgroundMusic?: string;
  dressCode?: string;
}

export class EventService {
  static async getAllEvents() {
    return prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            guests: true,
            timelines: true,
            galleries: true,
            messages: true,
          },
        },
      },
    });
  }

  static async getEventById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        timelines: {
          orderBy: { sortOrder: 'asc' },
        },
        galleries: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            guests: true,
            messages: true,
          },
        },
      },
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    return event;
  }

  static async getPrimaryEvent() {
    const event = await prisma.event.findFirst({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'asc' },
      include: {
        timelines: {
          orderBy: { sortOrder: 'asc' },
        },
        galleries: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return event;
  }

  static async createEvent(data: CreateEventInput) {
    return prisma.event.create({
      data: {
        ...data,
        eventDate: new Date(data.eventDate),
      },
    });
  }

  static async updateEvent(id: string, data: Partial<CreateEventInput> & { status?: any }) {
    await this.getEventById(id);

    return prisma.event.update({
      where: { id },
      data: {
        ...data,
        eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      },
    });
  }

  static async deleteEvent(id: string) {
    await this.getEventById(id);
    return prisma.event.delete({
      where: { id },
    });
  }
}
