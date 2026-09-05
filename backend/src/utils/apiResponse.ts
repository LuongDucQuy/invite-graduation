import { Response } from 'express';

export interface ApiResponsePayload<T = any> {
  success: boolean;
  data: T | null;
  message: string;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      data,
      message,
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return this.success(res, data, message, 201);
  }

  static error(res: Response, message = 'Internal server error', statusCode = 500, data: any = null): Response {
    const payload: ApiResponsePayload = {
      success: false,
      data,
      message,
    };
    return res.status(statusCode).json(payload);
  }

  static badRequest(res: Response, message = 'Bad request', data: any = null): Response {
    return this.error(res, message, 400, data);
  }

  static unauthorized(res: Response, message = 'Unauthorized access'): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }
}

export class AppError extends Error {
  statusCode: number;
  data?: any;

  constructor(message: string, statusCode = 500, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
