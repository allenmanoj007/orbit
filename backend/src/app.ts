import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import profilesRoutes from './modules/profiles/profiles.routes';
import locationRoutes from './modules/location/location.routes';
import connectionsRoutes from './modules/connections/connections.routes';
import chatRoutes from './modules/chat/chat.routes';
import mediaRoutes from './modules/media/media.routes';
import snapsRoutes from './modules/snaps/snaps.routes';
import storiesRoutes from './modules/stories/stories.routes';
import callsRoutes from './modules/calls/calls.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import usersRoutes from './modules/users/users.routes';
import adminRoutes from './modules/admin/admin.routes';

import { error } from './utils/apiResponse';
import { logger } from './utils/logger';

export function createApp(): express.Application {
  const app = express();

  // Security & Utilities Middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    frameguard: false,
    contentSecurityPolicy: false,
  }));
  app.use(cors({ origin: '*' }));
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));
  app.use(morgan('dev'));

  // Static files for local uploads and web app
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Root Web Experience - Instagram-Style Orbit Web App
  app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'orbit-backend', timestamp: new Date() });
  });

  // API v1 Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/profiles', profilesRoutes);
  app.use('/api/v1/location', locationRoutes);
  app.use('/api/v1/connections', connectionsRoutes);
  app.use('/api/v1/chat', chatRoutes);
  app.use('/api/v1/media', mediaRoutes);
  app.use('/api/v1/snaps', snapsRoutes);
  app.use('/api/v1/stories', storiesRoutes);
  app.use('/api/v1/calls', callsRoutes);
  app.use('/api/v1/notifications', notificationsRoutes);
  app.use('/api/v1/users', usersRoutes);
  app.use('/api/v1/admin', adminRoutes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    error(res, 'Route not found', 404);
  });

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error('Unhandled API Error:', err.message || err);

    const statusCode = err.statusCode || (err.message?.includes('NOT_FOUND') ? 404 : 400);
    const message = err.message || 'An unexpected error occurred';

    return error(res, message, statusCode);
  });

  return app;
}
