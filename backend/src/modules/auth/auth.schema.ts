import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const emailSchema = z.string().email('Invalid email address').toLowerCase();
const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{6,14}$/, 'Phone must be in international format: +1234567890');

export const registerEmailSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .toLowerCase()
    .optional(),
});

export const registerPhoneSchema = z.object({
  phone: phoneSchema,
  displayName: z.string().min(2).max(50),
});

export const loginEmailSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const loginPhoneSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  identifier: z.string().min(1), // email or phone
  code: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/),
  purpose: z.enum(['register', 'login', 'reset_password', 'verify_email', 'verify_phone']),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, 'Google ID token is required'),
});

export type RegisterEmailDto = z.infer<typeof registerEmailSchema>;
export type RegisterPhoneDto = z.infer<typeof registerPhoneSchema>;
export type LoginEmailDto = z.infer<typeof loginEmailSchema>;
export type LoginPhoneDto = z.infer<typeof loginPhoneSchema>;
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type GoogleAuthDto = z.infer<typeof googleAuthSchema>;
