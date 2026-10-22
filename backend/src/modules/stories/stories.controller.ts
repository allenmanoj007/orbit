import { Request, Response } from 'express';
import { storiesService } from './stories.service';
import { success, created } from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';

export class StoriesController {
  createStory = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await storiesService.createStory(userId, req.body);
    return created(res, result, 'Story published');
  });

  getFeed = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await storiesService.getFeedStories(userId);
    return success(res, result, 'Stories feed fetched');
  });

  viewStory = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const result = await storiesService.viewStory(id, userId);
    return success(res, result, 'Story viewed');
  });
}

export const storiesController = new StoriesController();
