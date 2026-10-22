import type { LookingForOption } from '../types/user';
import type { CompatibilityResult } from '../types/api';

// ─── Weights ──────────────────────────────────────────────────────────────────

const WEIGHTS = {
  interests: 40,
  hobbies: 30,
  lookingFor: 20,
  proximity: 10,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function intersection<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return a.filter((item) => setB.has(item));
}

/**
 * Score the overlap between two string arrays, returning a value 0–maxScore.
 * Uses Jaccard-inspired partial credit: any overlap scores proportionally,
 * with full score when ≥ 5 items match.
 */
function scoreOverlap(
  aIds: string[],
  bIds: string[],
  maxScore: number,
  fullMatchThreshold = 5,
): number {
  const common = intersection(aIds, bIds).length;
  if (common === 0) return 0;

  const score = Math.min(common / fullMatchThreshold, 1) * maxScore;
  return Math.round(score * 10) / 10;
}

/**
 * Score how well two users' "looking for" arrays align.
 * Full score if at least one option matches.
 */
function scoreLookingFor(
  aOptions: LookingForOption[],
  bOptions: LookingForOption[],
  maxScore: number,
): number {
  const common = intersection(aOptions, bOptions);
  if (common.length === 0) return 0;
  // Partial credit: more overlap = higher score
  const ratio = common.length / Math.max(aOptions.length, bOptions.length, 1);
  return Math.round(ratio * maxScore * 10) / 10;
}

/**
 * Convert raw distance in metres to a proximity score (0–10).
 * Full score for within 500 m, zero for > 10 km.
 */
function scoreProximity(distanceMeters: number, maxScore: number): number {
  if (distanceMeters <= 0) return maxScore;
  if (distanceMeters >= 10_000) return 0;

  // Linear decay from 500 m (full) to 10 km (zero)
  const clampedStart = 500;
  if (distanceMeters <= clampedStart) return maxScore;

  const ratio = 1 - (distanceMeters - clampedStart) / (10_000 - clampedStart);
  return Math.round(ratio * maxScore * 10) / 10;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface CompatibilityInput {
  interestIds: string[];
  interestNames: string[];
  hobbyIds: string[];
  hobbyNames: string[];
  lookingFor: LookingForOption[];
}

/**
 * Calculate the compatibility score and breakdown between two users.
 *
 * @param userA        Interest/hobby/lookingFor data for user A
 * @param userB        Interest/hobby/lookingFor data for user B
 * @param distanceMeters  Physical distance between the users in metres
 * @returns CompatibilityResult with score (0–100) and breakdown
 */
export function calculateCompatibility(
  userA: CompatibilityInput,
  userB: CompatibilityInput,
  distanceMeters: number,
): CompatibilityResult {
  const interestScore = scoreOverlap(
    userA.interestIds,
    userB.interestIds,
    WEIGHTS.interests,
  );

  const hobbyScore = scoreOverlap(
    userA.hobbyIds,
    userB.hobbyIds,
    WEIGHTS.hobbies,
  );

  const lookingForScore = scoreLookingFor(
    userA.lookingFor,
    userB.lookingFor,
    WEIGHTS.lookingFor,
  );

  const proximityScore = scoreProximity(distanceMeters, WEIGHTS.proximity);

  const totalScore = Math.round(
    interestScore + hobbyScore + lookingForScore + proximityScore,
  );

  // Common items for display
  const commonInterestIds = intersection(userA.interestIds, userB.interestIds);
  const commonHobbyIds = intersection(userA.hobbyIds, userB.hobbyIds);

  const idToNameA: Record<string, string> = {};
  userA.interestIds.forEach((id, i) => {
    idToNameA[id] = userA.interestNames[i] ?? id;
  });
  const idToNameAHobby: Record<string, string> = {};
  userA.hobbyIds.forEach((id, i) => {
    idToNameAHobby[id] = userA.hobbyNames[i] ?? id;
  });

  const commonInterests = commonInterestIds.map((id) => idToNameA[id] ?? id);
  const commonHobbies = commonHobbyIds.map((id) => idToNameAHobby[id] ?? id);
  const commonLookingFor = intersection(userA.lookingFor, userB.lookingFor);

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      interests: interestScore,
      hobbies: hobbyScore,
      lookingFor: lookingForScore,
      proximity: proximityScore,
    },
    commonInterests,
    commonHobbies,
    commonLookingFor,
  };
}
