import rateLimit from 'express-rate-limit';
import { error } from '../utils/apiResponse';
import { Request, Response } from 'express';

const handler = (req: Request, res: Response) => {
  error(res, 'Too many requests, please try again later', 429);
};

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  skipSuccessfulRequests: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  skipSuccessfulRequests: true,
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});
