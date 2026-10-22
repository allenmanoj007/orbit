import crypto from 'crypto';
import prisma from '../../config/database';
import { redis, RedisKeys } from '../../config/redis';
import { config } from '../../config/env';
import { hashPassword, comparePassword } from '../../utils/hash';
import { generateTokenPair, hashToken, verifyRefreshToken } from '../../utils/jwt';
import { logger } from '../../utils/logger';
import {
  RegisterEmailDto,
  RegisterPhoneDto,
  LoginEmailDto,
  VerifyOtpDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './auth.schema';

// ─────────────────────────────────────────────────────────────────────────────
// OTP Utilities
// ─────────────────────────────────────────────────────────────────────────────

export async function generateAndStoreOtp(
  identifier: string,
  purpose: string
): Promise<string> {
  const otp = Array.from(
    { length: config.OTP_LENGTH },
    () => Math.floor(Math.random() * 10)
  ).join('');

  const key = RedisKeys.otp(identifier, purpose);
  const ttlSeconds = config.OTP_EXPIRY_MINUTES * 60;

  await redis.setex(key, ttlSeconds, otp);

  logger.debug(`OTP generated for ${identifier} [${purpose}]: ${otp}`);
  return otp;
}

export async function verifyStoredOtp(
  identifier: string,
  purpose: string,
  code: string
): Promise<boolean> {
  const key = RedisKeys.otp(identifier, purpose);
  const stored = await redis.get(key);

  if (!stored || stored !== code) return false;

  // Delete OTP after successful verification (one-time use)
  await redis.del(key);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: generate unique username
// ─────────────────────────────────────────────────────────────────────────────

async function generateUniqueUsername(baseName: string): Promise<string> {
  const base = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20) || 'user';

  let username = base;
  let attempt = 0;

  while (attempt < 10) {
    const existing = await prisma.profile.findUnique({ where: { username } });
    if (!existing) return username;
    username = `${base}${Math.floor(Math.random() * 9999)}`;
    attempt++;
  }

  return `${base}${Date.now()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: store refresh token in DB
// ─────────────────────────────────────────────────────────────────────────────

async function storeRefreshToken(
  userId: string,
  refreshToken: string,
  deviceId?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const hash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.userSession.create({
    data: {
      userId,
      refreshTokenHash: hash,
      deviceId,
      ipAddress,
      userAgent,
      expiresAt,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth Service
// ─────────────────────────────────────────────────────────────────────────────

export class AuthService {
  /**
   * Register a new user with email and password
   */
  async registerWithEmail(
    data: RegisterEmailDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; refreshToken: string; userId: string }> {
    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await hashPassword(data.password);
    const username = data.username || (await generateUniqueUsername(data.displayName));

    // Create user + profile + privacy + location prefs in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          isEmailVerified: false, // Will be verified via OTP
        },
      });

      await tx.profile.create({
        data: {
          userId: newUser.id,
          displayName: data.displayName,
          username,
        },
      });

      await tx.privacySettings.create({
        data: { userId: newUser.id },
      });

      await tx.locationPreference.create({
        data: { userId: newUser.id },
      });

      return newUser;
    });

    // Send email verification OTP
    try {
      const otp = await generateAndStoreOtp(data.email, 'verify_email');
      // TODO: Send email via SMTP service
      logger.info(`Email verification OTP for ${data.email}: ${otp}`);
    } catch (err) {
      logger.warn('Failed to send verification email:', err);
    }

    const tokens = generateTokenPair(user.id, false);
    await storeRefreshToken(user.id, tokens.refreshToken, undefined, ipAddress, userAgent);

    return { ...tokens, userId: user.id };
  }

  /**
   * Login with email and password
   */
  async loginWithEmail(
    data: LoginEmailDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; refreshToken: string; userId: string }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { profile: true },
    });

    if (!user || !user.passwordHash) {
      throw new Error('INVALID_CREDENTIALS');
    }

    if (user.isBanned) {
      throw new Error('ACCOUNT_BANNED');
    }

    if (!user.isActive) {
      throw new Error('ACCOUNT_INACTIVE');
    }

    const isValidPassword = await comparePassword(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const tokens = generateTokenPair(user.id, user.isAdmin);
    await storeRefreshToken(user.id, tokens.refreshToken, undefined, ipAddress, userAgent);

    return { ...tokens, userId: user.id };
  }

  /**
   * Send phone OTP for login or registration
   */
  async sendPhoneOtp(
    data: RegisterPhoneDto | { phone: string },
    purpose: 'register' | 'login'
  ): Promise<void> {
    const otp = await generateAndStoreOtp(data.phone, purpose);
    // TODO: Send SMS via Twilio
    logger.info(`SMS OTP for ${data.phone} [${purpose}]: ${otp}`);
  }

  /**
   * Verify OTP and complete phone login/registration
   */
  async verifyOtp(
    data: VerifyOtpDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; refreshToken: string; userId: string; isNewUser: boolean }> {
    const isValid = await verifyStoredOtp(data.identifier, data.purpose, data.code);
    if (!isValid) {
      throw new Error('INVALID_OTP');
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.identifier }, { phone: data.identifier }],
      },
    });

    let isNewUser = false;

    if (!user) {
      if (data.purpose !== 'register') {
        throw new Error('USER_NOT_FOUND');
      }

      // Create new user for phone registration
      const username = await generateUniqueUsername('user');
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            phone: data.identifier.startsWith('+') ? data.identifier : undefined,
            email: data.identifier.includes('@') ? data.identifier : undefined,
            isPhoneVerified: true,
            isEmailVerified: data.identifier.includes('@'),
          },
        });

        await tx.profile.create({
          data: {
            userId: newUser.id,
            displayName: 'Orbit User',
            username,
          },
        });

        await tx.privacySettings.create({ data: { userId: newUser.id } });
        await tx.locationPreference.create({ data: { userId: newUser.id } });

        return newUser;
      });
      isNewUser = true;
    } else {
      // Mark verified
      if (data.identifier.includes('@')) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isEmailVerified: true },
        });
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { isPhoneVerified: true },
        });
      }
    }

    if (user.isBanned) throw new Error('ACCOUNT_BANNED');

    const tokens = generateTokenPair(user.id, user.isAdmin);
    await storeRefreshToken(user.id, tokens.refreshToken, undefined, ipAddress, userAgent);

    return { ...tokens, userId: user.id, isNewUser };
  }

  /**
   * Rotate refresh token (returns new pair)
   */
  async refreshTokens(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify the JWT first
    let payload: { userId: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    // Check it exists in DB
    const tokenHash = hashToken(refreshToken);
    const session = await prisma.userSession.findFirst({
      where: {
        refreshTokenHash: tokenHash,
        userId: payload.userId,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session || !session.user) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    if (session.user.isBanned) throw new Error('ACCOUNT_BANNED');

    // Delete old session
    await prisma.userSession.delete({ where: { id: session.id } });

    // Issue new token pair
    const tokens = generateTokenPair(session.userId, session.user.isAdmin);
    await storeRefreshToken(session.userId, tokens.refreshToken, session.deviceId ?? undefined, ipAddress, userAgent);

    return tokens;
  }

  /**
   * Logout - invalidate refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await prisma.userSession.deleteMany({
      where: { refreshTokenHash: tokenHash },
    });
  }

  /**
   * Send password reset email
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return; // Silent fail to prevent user enumeration

    const otp = await generateAndStoreOtp(email, 'reset_password');
    // TODO: Send reset email
    logger.info(`Password reset OTP for ${email}: ${otp}`);
  }

  /**
   * Reset password using OTP
   */
  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    const isValid = await verifyStoredOtp(email, 'reset_password', otp);
    if (!isValid) throw new Error('INVALID_OTP');

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    // Invalidate all sessions
    await prisma.userSession.deleteMany({ where: { user: { email } } });
  }

  /**
   * Change password (authenticated)
   */
  async changePassword(
    userId: string,
    data: ChangePasswordDto
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) throw new Error('USER_NOT_FOUND');

    const isValid = await comparePassword(data.currentPassword, user.passwordHash);
    if (!isValid) throw new Error('INVALID_CREDENTIALS');

    const newHash = await hashPassword(data.newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    // Invalidate all other sessions
    await prisma.userSession.deleteMany({ where: { userId } });
  }

  /**
   * Get auth user data (for /me endpoint)
   */
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            interests: { include: { interest: true } },
            hobbies: { include: { hobby: true } },
          },
        },
        privacySettings: true,
        locationPreference: true,
      },
    });

    if (!user) throw new Error('USER_NOT_FOUND');
    return user;
  }
}

export const authService = new AuthService();
