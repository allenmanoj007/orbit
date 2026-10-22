import { z } from 'zod';

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
});

export const getNearbyUsersSchema = z.object({
  latitude: z.string().transform(Number).optional(),
  longitude: z.string().transform(Number).optional(),
  radiusKm: z.string().transform(Number).default('10'),
  lookingFor: z.string().optional(),
  interest: z.string().optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
});
