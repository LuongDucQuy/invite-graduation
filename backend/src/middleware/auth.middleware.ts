import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiResponse } from '../utils/apiResponse';

export interface AdminPayload {
  id: string;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminPayload;
}

export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ApiResponse.unauthorized(res, 'Access token missing or invalid');
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AdminPayload;
    req.admin = decoded;
    next();
  } catch (error) {
    ApiResponse.unauthorized(res, 'Invalid or expired token');
  }
};
