import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';
import { ApiResponse } from '../utils/apiResponse';

export class EventController {
  static async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await EventService.getAllEvents();
      return ApiResponse.success(res, events, 'Events retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getPrimaryEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await EventService.getPrimaryEvent();
      return ApiResponse.success(res, event, 'Primary event retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);
      return ApiResponse.success(res, event, 'Event retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await EventService.createEvent(req.body);
      return ApiResponse.created(res, event, 'Event created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const event = await EventService.updateEvent(id, req.body);
      return ApiResponse.success(res, event, 'Event updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await EventService.deleteEvent(id);
      return ApiResponse.success(res, null, 'Event deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
