import { z } from 'zod';

export const sendConnectionRequestSchema = z.object({
  receiverId: z.string().min(1),
  message: z.string().max(300).optional(),
});
