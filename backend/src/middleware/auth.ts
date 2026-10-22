import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { error } from '../utils/apiResponse';
import { prisma } from '../config/database';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        isAdmin: boolean;
      };
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      error(res, 'No authorization token provided', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, isActive: true, isBanned: true, isAdmin: true },
    });

    if (!user) {
      error(res, 'User not found', 401);
      return;
    }
    if (!user.isActive || user.isBanned) {
      error(res, 'Account is suspended or banned', 403);
      return;
    }

    req.user = { id: user.id, isAdmin: user.isAdmin };
    next();
  } catch (err) {
    error(res, 'Invalid or expired token', 401);
  }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, isActive: true, isBanned: true, isAdmin: true },
    });

    if (user && user.isActive && !user.isBanned) {
      req.user = { id: user.id, isAdmin: user.isAdmin };
    }
  } catch {
    // Ignore errors for optional auth
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user?.isAdmin) {
    error(res, 'Admin access required', 403);
    return;
  }
  next();
}
