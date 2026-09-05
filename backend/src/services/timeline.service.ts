import { prisma } from '../prisma/client';
import { AppError } from '../utils/apiResponse';

export interface CreateTimelineInput {
  eventId: string;
  time: string;
  title: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
}

export class TimelineService {
  static async getTimelinesByEvent(eventId: string) {
    return prisma.timeline.findMany({
      where: { eventId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  static async createTimeline(data: CreateTimelineInput) {
    return prisma.timeline.create({
      data: {
        eventId: data.eventId,
        time: data.time,
        title: data.title,
        description: data.description,
        icon: data.icon || 'clock',
        sortOrder: data.sortOrder || 0,
      },
    });
  }

  static async updateTimeline(id: string, data: Partial<CreateTimelineInput>) {
    const existing = await prisma.timeline.findUnique({ where: { id } });
    if (!existing) throw new AppError('Timeline item not found', 404);

    return prisma.timeline.update({
      where: { id },
      data,
    });
  }

  static async deleteTimeline(id: string) {
    const existing = await prisma.timeline.findUnique({ where: { id } });
    if (!existing) throw new AppError('Timeline item not found', 404);

    return prisma.timeline.delete({
      where: { id },
    });
  }
}
