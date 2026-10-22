import { z } from 'zod';

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().max(4000).optional(),
  messageType: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'VOICE', 'SNAP', 'GIF', 'STICKER']).default('TEXT'),
  replyToId: z.string().optional(),
  mediaAttachmentId: z.string().optional(),
});

export const reactMessageSchema = z.object({
  emoji: z.string().min(1).max(10),
});

export const editMessageSchema = z.object({
  content: z.string().min(1).max(4000),
});
