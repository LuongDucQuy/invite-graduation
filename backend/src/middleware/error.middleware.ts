import { Request, Response, NextFunction } from 'express';
import { ApiResponse, AppError } from '../utils/apiResponse';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error('[Error Details]:', err);

  if (err instanceof AppError) {
    ApiResponse.error(res, err.message, err.statusCode, err.data);
    return;
  }

  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    ApiResponse.badRequest(res, `Validation error: ${messages}`, err.flatten());
    return;
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      ApiResponse.badRequest(res, 'A record with this unique field already exists');
      return;
    }
    if (err.code === 'P2025') {
      ApiResponse.notFound(res, 'Record not found in database');
      return;
    }
  }

  ApiResponse.error(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Unknown error'
  );
};
