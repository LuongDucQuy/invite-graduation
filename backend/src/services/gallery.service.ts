import { prisma } from '../prisma/client';
import { AppError } from '../utils/apiResponse';

export interface CreateGalleryInput {
  eventId: string;
  imageUrl: string;
  caption?: string;
  sortOrder?: number;
}

export class GalleryService {
  static async getGalleryByEvent(eventId: string) {
    return prisma.gallery.findMany({
      where: { eventId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  static async createGallery(data: CreateGalleryInput) {
    return prisma.gallery.create({
      data: {
        eventId: data.eventId,
        imageUrl: data.imageUrl,
        caption: data.caption,
        sortOrder: data.sortOrder || 0,
      },
    });
  }

  static async updateGallery(id: string, data: Partial<CreateGalleryInput>) {
    const existing = await prisma.gallery.findUnique({ where: { id } });
    if (!existing) throw new AppError('Gallery item not found', 404);

    return prisma.gallery.update({
      where: { id },
      data,
    });
  }

  static async deleteGallery(id: string) {
    const existing = await prisma.gallery.findUnique({ where: { id } });
    if (!existing) throw new AppError('Gallery item not found', 404);

    return prisma.gallery.delete({
      where: { id },
    });
  }
}
