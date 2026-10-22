/**
 * Format a raw distance in metres into a human-readable string.
 *
 * Examples:
 *   formatDistance(50)     → "50 m"
 *   formatDistance(999)    → "999 m"
 *   formatDistance(1000)   → "1.0 km"
 *   formatDistance(12500)  → "12.5 km"
 *   formatDistance(100000) → "100 km"
 */
export function formatDistance(meters: number): string {
  if (meters < 0) return 'Unknown';

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  const km = meters / 1000;

  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }

  return `${Math.round(km)} km`;
}

/**
 * Bucket a distance into a named range string suitable for display
 * when you want to preserve privacy by not giving an exact figure.
 *
 * Examples:
 *   getDistanceRange(50)     → "Nearby (< 100 m)"
 *   getDistanceRange(300)    → "Very close (< 500 m)"
 *   getDistanceRange(800)    → "Close (< 1 km)"
 *   getDistanceRange(2000)   → "Short walk (1–5 km)"
 *   getDistanceRange(8000)   → "Moderate (5–10 km)"
 *   getDistanceRange(20000)  → "Far (10–50 km)"
 *   getDistanceRange(100000) → "Very far (> 50 km)"
 */
export function getDistanceRange(meters: number): string {
  if (meters < 100) return 'Nearby (< 100 m)';
  if (meters < 500) return 'Very close (< 500 m)';
  if (meters < 1000) return 'Close (< 1 km)';
  if (meters < 5000) return 'Short walk (1–5 km)';
  if (meters < 10000) return 'Moderate (5–10 km)';
  if (meters < 50000) return 'Far (10–50 km)';
  return 'Very far (> 50 km)';
}
