import { prisma } from '../prisma/client';
import { RsvpStatus } from '@prisma/client';

export class StatsService {
  static async getEventStats(eventId?: string) {
    const where: any = {};
    if (eventId) {
      where.eventId = eventId;
    }

    const [
      totalGuests,
      openedGuests,
      attendingGuests,
      notAttendingGuests,
      pendingGuests,
      attendingWithGuests,
      totalMessages,
    ] = await Promise.all([
      prisma.guest.count({ where }),
      prisma.guest.count({ where: { ...where, openedAt: { not: null } } }),
      prisma.guest.count({ where: { ...where, rsvpStatus: RsvpStatus.ATTENDING } }),
      prisma.guest.count({ where: { ...where, rsvpStatus: RsvpStatus.NOT_ATTENDING } }),
      prisma.guest.count({ where: { ...where, rsvpStatus: RsvpStatus.PENDING } }),
      prisma.guest.findMany({
        where: { ...where, rsvpStatus: RsvpStatus.ATTENDING },
        select: { numberOfGuests: true },
      }),
      prisma.message.count({ where: eventId ? { eventId } : undefined }),
    ]);

    const totalAttendingPax = attendingWithGuests.reduce(
      (sum, g) => sum + (g.numberOfGuests || 1),
      0
    );

    const unopenedGuests = totalGuests - openedGuests;

    return {
      totalGuests,
      openedGuests,
      unopenedGuests,
      attendingGuests,
      notAttendingGuests,
      pendingGuests,
      totalAttendingPax,
      totalMessages,
      rsvpBreakdown: [
        { name: 'Xác nhận tham dự', value: attendingGuests, color: '#10B981' },
        { name: 'Không thể tham dự', value: notAttendingGuests, color: '#EF4444' },
        { name: 'Chưa phản hồi', value: pendingGuests, color: '#F59E0B' },
      ],
      openBreakdown: [
        { name: 'Đã mở thiệp', value: openedGuests, color: '#3B82F6' },
        { name: 'Chưa mở', value: unopenedGuests, color: '#9CA3AF' },
      ],
    };
  }
}
