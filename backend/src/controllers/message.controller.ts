import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service';
import { ApiResponse } from '../utils/apiResponse';

export class MessageController {
  static async getMessagesByEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const messages = await MessageService.getMessagesByEvent(eventId);
      return ApiResponse.success(res, messages, 'Messages retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await MessageService.deleteMessage(id);
      return ApiResponse.success(res, null, 'Message deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
