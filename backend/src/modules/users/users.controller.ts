import { Request, Response } from 'express';
import { usersService } from './users.service';
import { success, created } from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';

export class UsersController {
  search = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = (req as any).user.id;
    const q = req.query.q as string;
    const results = await usersService.searchUsers(q || '', currentUserId);
    return success(res, results, 'Search results');
  });

  block = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = (req as any).user.id;
    const { id } = req.params;
    await usersService.blockUser(currentUserId, id);
    return success(res, null, 'User blocked');
  });

  unblock = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = (req as any).user.id;
    const { id } = req.params;
    await usersService.unblockUser(currentUserId, id);
    return success(res, null, 'User unblocked');
  });

  report = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = (req as any).user.id;
    const { id } = req.params;
    const { reason, description } = req.body;
    const report = await usersService.reportUser(currentUserId, id, reason, description);
    return created(res, report, 'Report submitted for review');
  });

  deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = (req as any).user.id;
    await usersService.deleteAccount(currentUserId);
    return success(res, null, 'Account deleted');
  });
}

export const usersController = new UsersController();
