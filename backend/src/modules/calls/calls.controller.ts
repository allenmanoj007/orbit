import { Request, Response } from 'express';
import { callsService } from './calls.service';
import { success, created } from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';

export class CallsController {
  initiate = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { receiverId, callType } = req.body;
    const result = await callsService.initiateCall(userId, receiverId, callType || 'AUDIO');
    return created(res, result, 'Call initiated');
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, duration } = req.body;
    const result = await callsService.updateCallStatus(id, status, duration);
    return success(res, result, 'Call status updated');
  });

  getHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await callsService.getCallHistory(userId);
    return success(res, result, 'Call history fetched');
  });

  getIceServers = asyncHandler(async (_req: Request, res: Response) => {
    const servers = callsService.getIceServers();
    return success(res, servers, 'ICE servers retrieved');
  });
}

export const callsController = new CallsController();
