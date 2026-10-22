import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { success, created } from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';

export class AdminController {
  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await adminService.getStats();
    return success(res, stats, 'Platform statistics');
  });

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const search = req.query.search as string;
    const result = await adminService.getUsers(page, limit, search);
    return success(res, result, 'Users fetched');
  });

  banUser = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user.id;
    const { id } = req.params;
    const { reason } = req.body;
    const result = await adminService.banUser(id, reason || 'Violation of terms', adminId);
    return success(res, result, 'User banned');
  });

  unbanUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.unbanUser(id);
    return success(res, result, 'User unbanned');
  });

  getReports = asyncHandler(async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const status = req.query.status as any;
    const result = await adminService.getReports(page, limit, status);
    return success(res, result, 'Reports fetched');
  });

  updateReport = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user.id;
    const { id } = req.params;
    const { status, reviewNotes } = req.body;
    const result = await adminService.updateReport(id, status, adminId, reviewNotes);
    return success(res, result, 'Report status updated');
  });

  getInterests = asyncHandler(async (_req: Request, res: Response) => {
    const result = await adminService.getInterests();
    return success(res, result, 'Interests fetched');
  });

  createInterest = asyncHandler(async (req: Request, res: Response) => {
    const { name, emoji, category } = req.body;
    const result = await adminService.createInterest(name, emoji, category);
    return created(res, result, 'Interest created');
  });

  getHobbies = asyncHandler(async (_req: Request, res: Response) => {
    const result = await adminService.getHobbies();
    return success(res, result, 'Hobbies fetched');
  });

  createHobby = asyncHandler(async (req: Request, res: Response) => {
    const { name, emoji, category } = req.body;
    const result = await adminService.createHobby(name, emoji, category);
    return created(res, result, 'Hobby created');
  });
}

export const adminController = new AdminController();
