import { Request, Response, NextFunction } from 'express';
import { InvitationService } from '../services/invitation.service';
import { ApiResponse } from '../utils/apiResponse';

export class InvitationController {
  static async getInvitationByToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const data = await InvitationService.getInvitationByToken(token);
      return ApiResponse.success(res, data, 'Invitation loaded successfully');
    } catch (error) {
      next(error);
    }
  }

  static async submitRsvp(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const result = await InvitationService.submitRsvp(token, req.body);
      return ApiResponse.success(res, result, 'RSVP response submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getInvitationMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const messages = await InvitationService.getInvitationMessages(token);
      return ApiResponse.success(res, messages, 'Messages retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async postInvitationMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const { content, guestName } = req.body;
      const message = await InvitationService.postInvitationMessage(token, content, guestName);
      return ApiResponse.created(res, message, 'Lời chúc đã được gửi thành công!');
    } catch (error) {
      next(error);
    }
  }
}
