import { Request, Response } from 'express';
import { snapsService } from './snaps.service';
import { success, created } from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';

export class SnapsController {
  createSnap = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await snapsService.createSnap(userId, req.body);
    return created(res, result, 'Snap created');
  });

  createNearbySnap = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await snapsService.createNearbySnap(userId, req.body);
    return created(res, result, 'Nearby snap posted');
  });

  getNearbySnaps = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const lat = Number(req.query.latitude);
    const lng = Number(req.query.longitude);
    const result = await snapsService.getNearbySnaps(userId, lat, lng);
    return success(res, result, 'Nearby snaps fetched');
  });

  viewSnap = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const result = await snapsService.viewSnap(id, userId);
    return success(res, result, 'Snap viewed');
  });
}

export const snapsController = new SnapsController();
