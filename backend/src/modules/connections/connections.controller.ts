import { Request, Response } from 'express';
import { connectionsService } from './connections.service';
import { success, created } from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';

export class ConnectionsController {
  sendRequest = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { receiverId, message } = req.body;
    const result = await connectionsService.sendRequest(userId, receiverId, message);
    return created(res, result, 'Connection request sent');
  });

  acceptRequest = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const connectionId = req.params.id;
    const result = await connectionsService.acceptRequest(connectionId, userId);
    return success(res, result, 'Connection accepted');
  });

  declineRequest = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const connectionId = req.params.id;
    const result = await connectionsService.declineRequest(connectionId, userId);
    return success(res, result, 'Connection declined');
  });

  removeConnection = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const connectionId = req.params.id;
    await connectionsService.removeConnection(connectionId, userId);
    return success(res, null, 'Connection removed');
  });

  getConnections = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await connectionsService.getConnections(userId);
    return success(res, result, 'Connections fetched');
  });

  getPending = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await connectionsService.getPendingRequests(userId);
    return success(res, result, 'Pending requests fetched');
  });
}

export const connectionsController = new ConnectionsController();
