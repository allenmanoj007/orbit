import { Request, Response } from 'express';
import { locationService } from './location.service';
import { success } from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';

export class LocationController {
  updateLocation = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await locationService.updateLocation(userId, req.body);
    return success(res, result, 'Location updated successfully');
  });

  getNearbyUsers = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const query = req.query as any;
    const result = await locationService.getNearbyUsers(userId, {
      latitude: query.latitude ? Number(query.latitude) : undefined,
      longitude: query.longitude ? Number(query.longitude) : undefined,
      radiusKm: query.radiusKm ? Number(query.radiusKm) : 10,
      lookingFor: query.lookingFor as string,
      interest: query.interest as string,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20,
    });
    return success(res, result, 'Nearby users fetched');
  });
}

export const locationController = new LocationController();
