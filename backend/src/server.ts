import http from 'http';
import { createApp } from './app';
import { config } from './config/env';
import { initializeSocketServer } from './realtime/socketServer';
import { logger } from './utils/logger';

const app = createApp();
const server = http.createServer(app);

// Initialize Socket.io real-time engine
const io = initializeSocketServer(server);

server.listen(config.PORT, () => {
  logger.info(`🚀 Orbit API Server running on port ${config.PORT} [${config.NODE_ENV}]`);
  logger.info(`📡 Socket.io real-time engine ready`);
  logger.info(`🗺️  Geospatial location engine active`);
});

// Process handlers
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});
