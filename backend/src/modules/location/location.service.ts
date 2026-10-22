import prisma from '../../config/database';
import { redis, RedisKeys } from '../../config/redis';
import {
  calculateDistance,
  formatDistance,
  getDistanceRange,
  fuzzifyLocation,
} from '../../utils/location';
import { calculateCompatibility } from '../../utils/compatibility';

export class LocationService {
  async updateLocation(
    userId: string,
    data: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      city?: string;
      country?: string;
      countryCode?: string;
    }
  ) {
    // Add small privacy jitter (fuzzify) so even DB doesn't store exact live pinpoint
    const fuzzed = fuzzifyLocation(data.latitude, data.longitude, 100);

    const updated = await prisma.userLocation.upsert({
      where: { userId },
      update: {
        latitude: fuzzed.latitude,
        longitude: fuzzed.longitude,
        accuracy: data.accuracy,
        city: data.city,
        country: data.country,
        updatedAt: new Date(),
      },
      create: {
        userId,
        latitude: fuzzed.latitude,
        longitude: fuzzed.longitude,
        accuracy: data.accuracy,
        city: data.city,
        country: data.country,
      },
    });

    return { success: true, updatedAt: updated.updatedAt };
  }

  async getNearbyUsers(
    currentUserId: string,
    options: {
      latitude?: number;
      longitude?: number;
      radiusKm?: number;
      lookingFor?: string;
      interest?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const maxRadiusMeters = (options.radiusKm || 10) * 1000;

    // Get current user's location
    let centerLat = options.latitude;
    let centerLng = options.longitude;

    if (!centerLat || !centerLng) {
      const myLocation = await prisma.userLocation.findUnique({
        where: { userId: currentUserId },
      });
      if (!myLocation) {
        throw new Error('LOCATION_NOT_SET');
      }
      centerLat = myLocation.latitude;
      centerLng = myLocation.longitude;
    }

    // Get current user's interests & hobbies for compatibility calculation
    const myInterests = await prisma.userInterest.findMany({
      where: { userId: currentUserId },
      include: { interest: true },
    });
    const myHobbies = await prisma.userHobby.findMany({
      where: { userId: currentUserId },
      include: { hobby: true },
    });
    const myInterestNames = myInterests.map((i) => i.interest.name);
    const myHobbyNames = myHobbies.map((h) => h.hobby.name);

    // Get blocked users (both ways)
    const blocks = await prisma.block.findMany({
      where: {
        OR: [{ blockerId: currentUserId }, { blockedId: currentUserId }],
      },
    });
    const blockedUserIds = new Set(
      blocks.map((b) => (b.blockerId === currentUserId ? b.blockedId : b.blockerId))
    );
    blockedUserIds.add(currentUserId);

    // Get connection statuses with other users
    const existingConnections = await prisma.connection.findMany({
      where: {
        OR: [{ requesterId: currentUserId }, { receiverId: currentUserId }],
      },
    });
    const connectionMap = new Map<string, string>();
    for (const conn of existingConnections) {
      const otherId = conn.requesterId === currentUserId ? conn.receiverId : conn.requesterId;
      connectionMap.set(otherId, conn.status);
    }

    // Query active candidates with location preferences enabled
    const candidates = await prisma.userLocation.findMany({
      where: {
        discoveryEnabled: true,
        userId: { notIn: Array.from(blockedUserIds) },
        user: {
          isActive: true,
          isBanned: false,
          locationPreference: {
            discoveryEnabled: true,
            nearbyVisibility: { not: 'NOBODY' },
          },
        },
      },
      include: {
        user: {
          include: {
            profile: {
              include: {
                interests: { include: { interest: true } },
                hobbies: { include: { hobby: true } },
              },
            },
            locationPreference: true,
          },
        },
      },
    });

    // Compute distance and filter
    const nearbyList = [];

    for (const loc of candidates) {
      if (!loc.user.profile) continue;

      // Check distance
      const distanceMeters = calculateDistance(
        centerLat,
        centerLng,
        loc.latitude,
        loc.longitude
      );

      if (distanceMeters > maxRadiusMeters) continue;

      // Filter by "lookingFor" if requested
      if (
        options.lookingFor &&
        !loc.user.profile.lookingFor.includes(options.lookingFor)
      ) {
        continue;
      }

      // Filter by interest if requested
      if (options.interest) {
        const hasInterest = loc.user.profile.interests.some(
          (ui) => ui.interest.name.toLowerCase() === options.interest!.toLowerCase()
        );
        if (!hasInterest) continue;
      }

      // Check user's connection status
      const connStatus = connectionMap.get(loc.userId) || 'NONE';

      // Respect connection-only visibility
      if (
        loc.user.locationPreference?.nearbyVisibility === 'CONNECTIONS' &&
        connStatus !== 'ACCEPTED'
      ) {
        continue;
      }

      // Format distance based on target user's preference
      let displayDistance: string;
      const distPref = loc.user.locationPreference?.distanceDisplay || 'EXACT';
      if (distPref === 'HIDDEN') {
        displayDistance = 'Nearby';
      } else if (distPref === 'RANGE') {
        displayDistance = getDistanceRange(distanceMeters);
      } else {
        displayDistance = formatDistance(distanceMeters);
      }

      // Calculate compatibility
      const candidateInterests = loc.user.profile.interests.map((i) => i.interest.name);
      const candidateHobbies = loc.user.profile.hobbies.map((h) => h.hobby.name);

      const compatibility = calculateCompatibility(
        myInterestNames,
        candidateInterests,
        myHobbyNames,
        candidateHobbies
      );

      nearbyList.push({
        id: loc.userId,
        userId: loc.userId,
        displayName: loc.user.profile.displayName,
        username: loc.user.profile.username,
        avatarUrl: loc.user.profile.avatarUrl,
        age: loc.user.profile.showAge ? loc.user.profile.age : null,
        profession: loc.user.profile.profession,
        bio: loc.user.profile.bio,
        lookingFor: loc.user.profile.lookingFor,
        interests: loc.user.profile.interests.map((i) => ({
          id: i.interest.id,
          name: i.interest.name,
          emoji: i.interest.emoji,
          category: i.interest.category,
        })),
        hobbies: loc.user.profile.hobbies.map((h) => ({
          id: h.hobby.id,
          name: h.hobby.name,
          emoji: h.hobby.emoji,
        })),
        distanceMeters: Math.round(distanceMeters),
        distanceFormatted: displayDistance,
        compatibilityScore: compatibility.score,
        commonInterests: compatibility.commonInterests,
        commonHobbies: compatibility.commonHobbies,
        compatibilityExplanation: compatibility.explanation,
        connectionStatus: connStatus,
      });
    }

    // Sort by compatibility + distance balanced score
    nearbyList.sort((a, b) => {
      // Prioritize compatibility score, then distance
      if (b.compatibilityScore !== a.compatibilityScore) {
        return b.compatibilityScore - a.compatibilityScore;
      }
      return a.distanceMeters - b.distanceMeters;
    });

    const total = nearbyList.length;
    const startIndex = (page - 1) * limit;
    const paginated = nearbyList.slice(startIndex, startIndex + limit);

    return {
      users: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const locationService = new LocationService();
