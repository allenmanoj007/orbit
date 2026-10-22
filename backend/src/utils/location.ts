/**
 * Adds random noise to coordinates for privacy protection.
 * Default noise radius is 500 meters.
 */
export function fuzzifyLocation(
  lat: number,
  lng: number,
  radiusMeters = 500
): { latitude: number; longitude: number } {
  // Convert radius to degrees (approximate)
  const radiusLat = radiusMeters / 111320;
  const radiusLng = radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180));

  // Random angle and distance within circle
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusLat;

  const fuzzLat = lat + distance * Math.cos(angle);
  const fuzzLng = lng + (distance / radiusLat) * radiusLng * Math.sin(angle);

  return {
    latitude: parseFloat(fuzzLat.toFixed(6)),
    longitude: parseFloat(fuzzLng.toFixed(6)),
  };
}

/**
 * Haversine formula to calculate distance between two coordinates in meters.
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Format a distance in meters to a human-readable string.
 */
export function formatDistance(meters: number): string {
  if (meters < 100) return 'just nearby';
  if (meters < 1000) return `${Math.round(meters / 100) * 100} m away`;
  const km = meters / 1000;
  if (km < 10) return `${km.toFixed(1)} km away`;
  return `${Math.round(km)} km away`;
}

/**
 * Return a distance range string for privacy-preserving display.
 */
export function getDistanceRange(meters: number): string {
  if (meters < 500) return '< 500 m';
  if (meters < 1000) return '< 1 km';
  if (meters < 3000) return '1–3 km';
  if (meters < 10000) return '3–10 km';
  if (meters < 25000) return '10–25 km';
  if (meters < 50000) return '25–50 km';
  return '50+ km';
}
