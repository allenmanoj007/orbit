export interface CompatibilityInput {
  interestIds?: string[];
  hobbyIds?: string[];
  interestNames?: string[];
  hobbyNames?: string[];
}

export interface CompatibilityResult {
  score: number;
  commonInterests: string[];
  commonHobbies: string[];
  explanation: string;
}

export function calculateCompatibility(
  arg1: CompatibilityInput | string[],
  arg2: CompatibilityInput | string[],
  arg3?: string[] | number,
  arg4?: string[]
): CompatibilityResult {
  let interestsA: string[] = [];
  let interestsB: string[] = [];
  let hobbiesA: string[] = [];
  let hobbiesB: string[] = [];
  let distanceMeters: number | undefined;

  if (Array.isArray(arg1) && Array.isArray(arg2)) {
    // Called as (interestsA, interestsB, hobbiesA, hobbiesB)
    interestsA = arg1;
    interestsB = arg2;
    hobbiesA = Array.isArray(arg3) ? arg3 : [];
    hobbiesB = Array.isArray(arg4) ? arg4 : [];
  } else {
    // Called as (userA: CompatibilityInput, userB: CompatibilityInput, distanceMeters?)
    const userA = arg1 as CompatibilityInput;
    const userB = arg2 as CompatibilityInput;
    interestsA = userA.interestNames || userA.interestIds || [];
    interestsB = userB.interestNames || userB.interestIds || [];
    hobbiesA = userA.hobbyNames || userA.hobbyIds || [];
    hobbiesB = userB.hobbyNames || userB.hobbyIds || [];
    if (typeof arg3 === 'number') {
      distanceMeters = arg3;
    }
  }

  const setAInterests = new Set(interestsA.map((i) => i.toLowerCase()));
  const commonInterests = interestsB.filter((i) => setAInterests.has(i.toLowerCase()));

  const setAHobbies = new Set(hobbiesA.map((h) => h.toLowerCase()));
  const commonHobbies = hobbiesB.filter((h) => setAHobbies.has(h.toLowerCase()));

  const totalInterests = new Set([...interestsA, ...interestsB]).size;
  const totalHobbies = new Set([...hobbiesA, ...hobbiesB]).size;

  const interestScore = totalInterests > 0 ? (commonInterests.length / totalInterests) * 100 : 0;
  const hobbyScore = totalHobbies > 0 ? (commonHobbies.length / totalHobbies) * 100 : 0;

  let score = interestScore * 0.6 + hobbyScore * 0.4;

  if (distanceMeters !== undefined) {
    if (distanceMeters < 1000) score = Math.min(100, score + 10);
    else if (distanceMeters < 5000) score = Math.min(100, score + 5);
  }

  const finalScore = Math.round(score);

  const parts: string[] = [];
  if (commonInterests.length > 0) {
    parts.push(`${commonInterests.length} common interest${commonInterests.length > 1 ? 's' : ''}`);
  }
  if (commonHobbies.length > 0) {
    parts.push(`${commonHobbies.length} common hobb${commonHobbies.length > 1 ? 'ies' : 'y'}`);
  }

  let explanation = '';
  if (parts.length === 0) {
    explanation = 'Discover common ground together';
  } else {
    explanation = `You both like ${commonInterests.slice(0, 3).join(', ')}`;
  }

  return {
    score: finalScore,
    commonInterests,
    commonHobbies,
    explanation,
  };
}
