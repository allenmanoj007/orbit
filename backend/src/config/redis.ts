import Redis from 'ioredis';
import { config } from './env';
import { logger } from '../utils/logger';

// Fast In-Memory Key-Value store with TTL for local development
class InMemoryStore {
  private store = new Map<string, { value: string; expiresAt?: number }>();

  async set(key: string, value: string): Promise<'OK'> {
    this.store.set(key, { value });
    return 'OK';
  }

  async setex(key: string, seconds: number, value: string): Promise<'OK'> {
    const expiresAt = Date.now() + seconds * 1000;
    this.store.set(key, { value, expiresAt });
    return 'OK';
  }

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async del(key: string): Promise<number> {
    const existed = this.store.delete(key);
    return existed ? 1 : 0;
  }

  async quit(): Promise<'OK'> {
    this.store.clear();
    return 'OK';
  }
}

const memoryStore = new InMemoryStore();
let isUsingMemory = false;
let realRedis: Redis | null = null;

try {
  realRedis = new Redis(config.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 0,
    connectTimeout: 1000,
    enableOfflineQueue: false,
  });

  // Handle errors silently so we don't spam terminal
  realRedis.on('error', () => {
    isUsingMemory = true;
  });

  realRedis
    .connect()
    .then(() => {
      logger.info('✅ Live Redis server connected');
    })
    .catch(() => {
      isUsingMemory = true;
      logger.info('ℹ️  No local Redis at port 6379 — using in-memory store for session & OTP state.');
    });
} catch {
  isUsingMemory = true;
}

// Transparent Proxy: Uses live Redis when available, otherwise In-Memory Store
export const redis: any = new Proxy(
  {},
  {
    get(_target, prop: string) {
      if (!isUsingMemory && realRedis && realRedis.status === 'ready') {
        const val = (realRedis as any)[prop];
        if (typeof val === 'function') {
          return (...args: any[]) => (realRedis as any)[prop](...args);
        }
        return val;
      }
      return (memoryStore as any)[prop];
    },
  }
);

export const RedisKeys = {
  otp: (identifier: string, purpose: string) => `otp:${identifier}:${purpose}`,
  presence: (userId: string) => `presence:${userId}`,
  socket: (userId: string) => `socket:${userId}`,
  locationUpdate: (userId: string) => `loc_update:${userId}`,
  tokenBlacklist: (hash: string) => `token_blacklist:${hash}`,
  userCache: (userId: string) => `user_cache:${userId}`,
  unreadCount: (userId: string) => `unread:${userId}`,
  typing: (conversationId: string, userId: string) => `typing:${conversationId}:${userId}`,
};

export async function closeRedis(): Promise<void> {
  if (realRedis) {
    try {
      await realRedis.quit();
    } catch {
      // ignore
    }
  }
  await memoryStore.quit();
}

export default redis;
