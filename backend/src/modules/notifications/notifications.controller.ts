import { Request, Response } from 'express';
import { notificationsService } from './notifications.service';
import { success } from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';

export class NotificationsController {
  getList = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 30;
    const result = await notificationsService.getNotifications(userId, page, limit);
    return success(res, result, 'Notifications fetched');
  });

  markRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    await notificationsService.markAsRead(id, userId);
    return success(res, null, 'Notification marked as read');
  });

  markAllRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    await notificationsService.markAllAsRead(userId);
    return success(res, null, 'All notifications marked as read');
  });

  registerDevice = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { pushToken, platform } = req.body;
    await notificationsService.registerDeviceToken(userId, pushToken, platform || 'mobile');
    return success(res, null, 'Device registered for notifications');
  });
}

export const notificationsController = new NotificationsController();
