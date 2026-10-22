import { Request, Response } from 'express';
import { authService } from './auth.service';
import { success, created } from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';

export class AuthController {
  registerEmail = asyncHandler(async (req: Request, res: Response) => {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    const result = await authService.registerWithEmail(req.body, ipAddress, userAgent);
    return created(res, result, 'Registration successful. Verification code sent if required.');
  });

  loginEmail = asyncHandler(async (req: Request, res: Response) => {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    const result = await authService.loginWithEmail(req.body, ipAddress, userAgent);
    return success(res, result, 'Login successful');
  });

  sendPhoneOtp = asyncHandler(async (req: Request, res: Response) => {
    await authService.sendPhoneOtp(req.body, req.body.purpose || 'login');
    return success(res, null, 'OTP sent successfully');
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    const result = await authService.verifyOtp(req.body, ipAddress, userAgent);
    return success(res, result, 'Verification successful');
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    const result = await authService.refreshTokens(req.body.refreshToken, ipAddress, userAgent);
    return success(res, result, 'Token refreshed');
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    if (req.body.refreshToken) {
      await authService.logout(req.body.refreshToken);
    }
    return success(res, null, 'Logged out successfully');
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body.email);
    return success(res, null, 'If this email exists, a password reset code was sent.');
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body.email, req.body.code, req.body.password);
    return success(res, null, 'Password reset successful');
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    await authService.changePassword(userId, req.body);
    return success(res, null, 'Password updated successfully');
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const user = await authService.getMe(userId);
    return success(res, user, 'Current user retrieved');
  });
}

export const authController = new AuthController();
