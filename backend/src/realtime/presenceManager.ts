import redis, { RedisKeys } from '../config/redis';
import { logger } from '../utils/logger';

export class PresenceManager {
  async setUserOnline(userId: string, socketId: string) {
    try {
      await redis.setex(RedisKeys.presence(userId), 3600, 'online');
      await redis.set(RedisKeys.socket(userId), socketId);
      logger.debug(`User ${userId} marked online (socket: ${socketId})`);
    } catch (err: any) {
      logger.error('Error setting user online:', err.message);
    }
  }

  async setUserOffline(userId: string) {
    try {
      await redis.del(RedisKeys.presence(userId));
      await redis.del(RedisKeys.socket(userId));
      logger.debug(`User ${userId} marked offline`);
    } catch (err: any) {
      logger.error('Error setting user offline:', err.message);
    }
  }

  async isUserOnline(userId: string): Promise<boolean> {
    try {
      const status = await redis.get(RedisKeys.presence(userId));
      return status === 'online';
    } catch {
      return false;
    }
  }

  async getUserSocketId(userId: string): Promise<string | null> {
    try {
      return await redis.get(RedisKeys.socket(userId));
    } catch {
      return null;
    }
  }
}

export const presenceManager = new PresenceManager();
