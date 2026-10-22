import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { authLimiter } from '../../middleware/rateLimit';
import { authenticate } from '../../middleware/auth';
import {
  registerEmailSchema,
  loginEmailSchema,
  verifyOtpSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.schema';

const router = Router();

router.post('/register/email', authLimiter, validate(registerEmailSchema), authController.registerEmail);
router.post('/login/email', authLimiter, validate(loginEmailSchema), authController.loginEmail);
router.post('/phone/send-otp', authLimiter, authController.sendPhoneOtp);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), authController.verifyOtp);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

export default router;
