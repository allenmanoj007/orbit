import prisma from '../../config/database';

export class NotificationsService {
  async getNotifications(userId: string, page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      notifications,
      total,
      unreadCount,
      page,
      limit,
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async registerDeviceToken(userId: string, pushToken: string, platform: string) {
    return prisma.device.upsert({
      where: { userId_pushToken: { userId, pushToken } },
      update: { platform, isActive: true, updatedAt: new Date() },
      create: { userId, pushToken, platform },
    });
  }
}

export const notificationsService = new NotificationsService();
