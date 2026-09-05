import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
import { config } from '../config';
import { AppError } from '../utils/apiResponse';

export class AuthService {
  static async login(username: string, password: string) {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      throw new AppError('Invalid username or password', 401);
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid username or password', 401);
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    return {
      admin: {
        id: admin.id,
        username: admin.username,
      },
      token,
    };
  }

  static async getProfile(adminId: string) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    return admin;
  }
}
