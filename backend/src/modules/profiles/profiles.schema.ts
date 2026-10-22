import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  bio: z.string().max(500).optional().nullable(),
  age: z.number().int().min(13).max(120).optional().nullable(),
  showAge: z.boolean().optional(),
  profession: z.string().max(100).optional().nullable(),
  lookingFor: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
});

export const updatePrivacySchema = z.object({
  whoCanMessage: z.enum(['EVERYONE', 'CONNECTIONS', 'NOBODY']).optional(),
  whoCanCall: z.enum(['EVERYONE', 'CONNECTIONS', 'NOBODY']).optional(),
  whoCanViewProfile: z.enum(['EVERYONE', 'CONNECTIONS']).optional(),
  whoCanViewStory: z.enum(['CONNECTIONS', 'NEARBY', 'FRIENDS']).optional(),
  whoCanViewSnaps: z.enum(['CONNECTIONS', 'NEARBY', 'FRIENDS']).optional(),
  showOnlineStatus: z.boolean().optional(),
  showReadReceipts: z.boolean().optional(),
  showLastSeen: z.boolean().optional(),
});

export const updateLocationPreferenceSchema = z.object({
  nearbyVisibility: z.enum(['EVERYONE', 'CONNECTIONS', 'NOBODY']).optional(),
  distanceDisplay: z.enum(['EXACT', 'RANGE', 'HIDDEN']).optional(),
  discoveryEnabled: z.boolean().optional(),
  maxDiscoveryRadiusKm: z.number().min(1).max(100).optional(),
});

export const addInterestsSchema = z.object({
  interestIds: z.array(z.string()).min(1),
});

export const addHobbiesSchema = z.object({
  hobbyIds: z.array(z.string()).min(1),
});
