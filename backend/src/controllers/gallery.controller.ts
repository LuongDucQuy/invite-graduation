import { Request, Response, NextFunction } from 'express';
import { GalleryService } from '../services/gallery.service';
import { ApiResponse } from '../utils/apiResponse';

export class GalleryController {
  static async getGalleryByEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const galleries = await GalleryService.getGalleryByEvent(eventId);
      return ApiResponse.success(res, galleries, 'Galleries retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const gallery = await GalleryService.createGallery(req.body);
      return ApiResponse.created(res, gallery, 'Gallery item created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const gallery = await GalleryService.updateGallery(id, req.body);
      return ApiResponse.success(res, gallery, 'Gallery item updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await GalleryService.deleteGallery(id);
      return ApiResponse.success(res, null, 'Gallery item deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
