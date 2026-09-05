import { Request, Response, NextFunction } from 'express';
import { TimelineService } from '../services/timeline.service';
import { ApiResponse } from '../utils/apiResponse';

export class TimelineController {
  static async getTimelinesByEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const timelines = await TimelineService.getTimelinesByEvent(eventId);
      return ApiResponse.success(res, timelines, 'Timelines retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const timeline = await TimelineService.createTimeline(req.body);
      return ApiResponse.created(res, timeline, 'Timeline item created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const timeline = await TimelineService.updateTimeline(id, req.body);
      return ApiResponse.success(res, timeline, 'Timeline item updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await TimelineService.deleteTimeline(id);
      return ApiResponse.success(res, null, 'Timeline item deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
