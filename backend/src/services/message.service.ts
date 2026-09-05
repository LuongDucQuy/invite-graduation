import { prisma } from '../prisma/client';
import { AppError } from '../utils/apiResponse';

export class MessageService {
  static async getMessagesByEvent(eventId: string) {
    return prisma.message.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            relationship: true,
            rsvpStatus: true,
          },
        },
      },
    });
  }

  static async deleteMessage(id: string) {
    const existing = await prisma.message.findUnique({ where: { id } });
    if (!existing) throw new AppError('Message not found', 404);

    return prisma.message.delete({
      where: { id },
    });
  }
}
