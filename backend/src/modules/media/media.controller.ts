import { Request, Response } from 'express';
import { mediaService } from './media.service';
import { created } from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';

export class MediaController {
  upload = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    if (!req.file) {
      throw new Error('NO_FILE_UPLOADED');
    }
    const result = await mediaService.processAndSaveMedia(req.file, userId);
    return created(res, result, 'Media uploaded and processed');
  });
}

export const mediaController = new MediaController();
