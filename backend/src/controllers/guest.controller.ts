import { Request, Response, NextFunction } from 'express';
import { GuestService } from '../services/guest.service';
import { ApiResponse } from '../utils/apiResponse';
import { RsvpStatus } from '@prisma/client';

export class GuestController {
  static async getGuests(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId, search, rsvpStatus, isOpened, page, limit } = req.query;
      const result = await GuestService.getGuests({
        eventId: eventId as string,
        search: search as string,
        rsvpStatus: rsvpStatus as RsvpStatus,
        isOpened: isOpened !== undefined ? isOpened === 'true' : undefined,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50,
      });
      return ApiResponse.success(res, result, 'Guests retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getGuestById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const guest = await GuestService.getGuestById(id);
      return ApiResponse.success(res, guest, 'Guest retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createGuest(req: Request, res: Response, next: NextFunction) {
    try {
      const guest = await GuestService.createGuest(req.body);
      return ApiResponse.created(res, guest, 'Guest created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateGuest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const guest = await GuestService.updateGuest(id, req.body);
      return ApiResponse.success(res, guest, 'Guest updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteGuest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await GuestService.deleteGuest(id);
      return ApiResponse.success(res, null, 'Guest deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async importGuests(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId, guests } = req.body;
      if (!eventId || !Array.isArray(guests)) {
        return ApiResponse.badRequest(res, 'Invalid payload: eventId and guests array are required');
      }
      const created = await GuestService.importGuests(eventId, guests);
      return ApiResponse.created(res, created, `Successfully imported ${created.length} guests`);
    } catch (error) {
      next(error);
    }
  }
}
