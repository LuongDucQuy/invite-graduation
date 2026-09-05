import { Request, Response, NextFunction } from 'express';
import { StatsService } from '../services/stats.service';
import { ApiResponse } from '../utils/apiResponse';

export class StatsController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.query;
      const stats = await StatsService.getEventStats(eventId as string);
      return ApiResponse.success(res, stats, 'Statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
