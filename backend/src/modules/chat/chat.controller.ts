import { Request, Response } from 'express';
import { chatService } from './chat.service';
import { success, created } from '../../utils/apiResponse';
import asyncHandler from '../../utils/asyncHandler';

export class ChatController {
  getOrCreateDirectConversation = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { targetUserId } = req.params;
    const conversation = await chatService.getOrCreateConversation(userId, targetUserId);
    return success(res, conversation, 'Conversation retrieved');
  });

  getConversations = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const conversations = await chatService.getConversations(userId);
    return success(res, conversations, 'Conversations fetched');
  });

  getMessages = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { conversationId } = req.params;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const messages = await chatService.getMessages(conversationId, userId, page, limit);
    return success(res, messages, 'Messages fetched');
  });

  sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const message = await chatService.sendMessage(userId, req.body);
    return created(res, message, 'Message sent');
  });

  reactMessage = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { messageId } = req.params;
    const { emoji } = req.body;
    const result = await chatService.reactToMessage(messageId, userId, emoji);
    return success(res, result, 'Reaction updated');
  });

  deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { messageId } = req.params;
    await chatService.deleteMessage(messageId, userId);
    return success(res, null, 'Message deleted');
  });
}

export const chatController = new ChatController();
