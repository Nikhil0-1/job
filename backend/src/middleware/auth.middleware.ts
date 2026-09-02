import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { createError } from './error.middleware';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    employerProfileId?: string;
    companyId?: string;
  };
}

export const authenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('No authentication token provided', 401);
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'fallback_secret';

    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      throw createError('Invalid or expired token', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        employerProfile: {
          include: { company: true },
        },
      },
    });

    if (!user || !user.isActive) {
      throw createError('User not found or deactivated', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      employerProfileId: user.employerProfile?.id,
      companyId: user.employerProfile?.company?.id,
    };

    next();
  } catch (err) {
    next(err);
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Not authenticated', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(createError('Insufficient permissions', 403));
    }
    next();
  };
};

export const requireEmployer = requireRole('EMPLOYER', 'ADMIN');
export const requireAdmin = requireRole('ADMIN');
