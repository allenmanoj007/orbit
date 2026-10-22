import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/env';

export interface AccessTokenPayload {
  userId: string;
  isAdmin: boolean;
  type: 'access';
}

export interface RefreshTokenPayload {
  userId: string;
  type: 'refresh';
}

export function generateAccessToken(userId: string, isAdmin = false): string {
  return jwt.sign(
    { userId, isAdmin, type: 'access' } as AccessTokenPayload,
    config.JWT_ACCESS_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRES_IN as any }
  );
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { userId, type: 'refresh' } as RefreshTokenPayload,
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN as any }
  );
}

export function generateTokenPair(userId: string, isAdmin = false): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: generateAccessToken(userId, isAdmin),
    refreshToken: generateRefreshToken(userId),
  };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, config.JWT_ACCESS_SECRET);
  if (typeof payload !== 'object' || !payload || (payload as AccessTokenPayload).type !== 'access') {
    throw new Error('Invalid access token');
  }
  return payload as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = jwt.verify(token, config.JWT_REFRESH_SECRET);
  if (typeof payload !== 'object' || !payload || (payload as RefreshTokenPayload).type !== 'refresh') {
    throw new Error('Invalid refresh token');
  }
  return payload as RefreshTokenPayload;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
