import { z } from 'zod';

export const createSnapSchema = z.object({
  content: z.string().max(500).optional(),
  visibility: z.enum(['PRIVATE', 'FRIENDS', 'NEARBY', 'PUBLIC']).default('FRIENDS'),
  expiry: z.enum(['VIEW_ONCE', 'HOURS_24', 'DAYS_7', 'PERMANENT']).default('HOURS_24'),
  recipientIds: z.array(z.string()).optional(),
  mediaAttachmentId: z.string().min(1),
});

export const createNearbySnapSchema = z.object({
  content: z.string().max(500).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusKm: z.number().min(0.5).max(25).default(1),
  mediaAttachmentId: z.string().min(1),
});
