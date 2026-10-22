import { Request, Response } from 'express';
import { profilesService } from './profiles.service';
import { success } from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';

export class ProfilesController {
  getMyProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const profile = await profilesService.getProfile(userId, userId);
    return success(res, profile, 'Profile retrieved');
  });

  getProfileById = asyncHandler(async (req: Request, res: Response) => {
    const viewerId = (req as any).user?.id;
    const targetUserId = req.params.userId;
    const profile = await profilesService.getProfile(targetUserId, viewerId);
    return success(res, profile, 'Profile retrieved');
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const profile = await profilesService.updateProfile(userId, req.body);
    return success(res, profile, 'Profile updated successfully');
  });

  setInterests = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const interests = await profilesService.setInterests(userId, req.body.interestIds);
    return success(res, interests, 'Interests updated');
  });

  setHobbies = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const hobbies = await profilesService.setHobbies(userId, req.body.hobbyIds);
    return success(res, hobbies, 'Hobbies updated');
  });

  updatePrivacy = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const privacy = await profilesService.updatePrivacySettings(userId, req.body);
    return success(res, privacy, 'Privacy settings updated');
  });

  updateLocationPreferences = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const prefs = await profilesService.updateLocationPreferences(userId, req.body);
    return success(res, prefs, 'Location preferences updated');
  });
}

export const profilesController = new ProfilesController();
