import type { LookingForOption } from './user';

// ─── Generic Wrappers ─────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// ─── Discovery / Nearby ───────────────────────────────────────────────────────

export interface NearbyUserResult {
  userId: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  profession: string | null;
  /** Human-readable distance string e.g. "250 m" or "1.2 km" */
  distanceFormatted: string;
  /** Raw distance in metres */
  distanceMeters: number;
  /** Names of shared interests */
  commonInterests: string[];
  /** Names of shared hobbies */
  commonHobbies: string[];
  /** 0–100 compatibility score */
  compatibilityScore: number;
  lookingFor: LookingForOption[];
}

// ─── Compatibility ────────────────────────────────────────────────────────────

export interface CompatibilityResult {
  score: number; // 0–100
  breakdown: {
    interests: number;   // 0–40
    hobbies: number;     // 0–30
    lookingFor: number;  // 0–20
    proximity: number;   // 0–10
  };
  commonInterests: string[];
  commonHobbies: string[];
  commonLookingFor: LookingForOption[];
}
