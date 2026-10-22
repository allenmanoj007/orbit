import prisma from '../../config/database';
import { calculateCompatibility } from '../../utils/compatibility';

export class ProfilesService {
  async getProfile(targetUserId: string, viewerUserId?: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId: targetUserId },
      include: {
        user: {
          select: {
            id: true,
            isActive: true,
            isBanned: true,
            createdAt: true,
            privacySettings: true,
            locationPreference: true,
            location: {
              select: {
                city: true,
                country: true,
                updatedAt: true,
              },
            },
          },
        },
        interests: {
          include: { interest: true },
        },
        hobbies: {
          include: { hobby: true },
        },
      },
    });

    if (!profile || profile.user.isBanned || !profile.user.isActive) {
      throw new Error('PROFILE_NOT_FOUND');
    }

    // Check block status if viewer is provided
    if (viewerUserId && viewerUserId !== targetUserId) {
      const isBlocked = await prisma.block.findFirst({
        where: {
          OR: [
            { blockerId: viewerUserId, blockedId: targetUserId },
            { blockerId: targetUserId, blockedId: viewerUserId },
          ],
        },
      });

      if (isBlocked) {
        throw new Error('PROFILE_NOT_ACCESSIBLE');
      }
    }

    // Check connection status
    let connectionStatus: string | null = null;
    if (viewerUserId && viewerUserId !== targetUserId) {
      const conn = await prisma.connection.findFirst({
        where: {
          OR: [
            { requesterId: viewerUserId, receiverId: targetUserId },
            { requesterId: targetUserId, receiverId: viewerUserId },
          ],
        },
      });
      if (conn) {
        connectionStatus = conn.status;
      }
    }

    // Calculate compatibility if viewer is different
    let compatibility = null;
    if (viewerUserId && viewerUserId !== targetUserId) {
      const viewerInterests = await prisma.userInterest.findMany({
        where: { userId: viewerUserId },
        include: { interest: true },
      });
      const viewerHobbies = await prisma.userHobby.findMany({
        where: { userId: viewerUserId },
        include: { hobby: true },
      });

      const userAInterests = viewerInterests.map((i) => i.interest.name);
      const userBInterests = profile.interests.map((i) => i.interest.name);
      const userAHobbies = viewerHobbies.map((h) => h.hobby.name);
      const userBHobbies = profile.hobbies.map((h) => h.hobby.name);

      compatibility = calculateCompatibility(
        userAInterests,
        userBInterests,
        userAHobbies,
        userBHobbies
      );
    }

    // Apply privacy rules
    const privacy = profile.user.privacySettings;
    const isOwner = viewerUserId === targetUserId;
    const isConnected = connectionStatus === 'ACCEPTED';

    if (!isOwner && privacy?.whoCanViewProfile === 'CONNECTIONS' && !isConnected) {
      return {
        id: profile.id,
        userId: profile.userId,
        displayName: profile.displayName,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        isPrivate: true,
        connectionStatus,
      };
    }

    return {
      ...profile,
      age: profile.showAge || isOwner ? profile.age : null,
      connectionStatus,
      compatibility,
      isOwner,
    };
  }

  async updateProfile(userId: string, data: any) {
    if (data.username) {
      const existing = await prisma.profile.findFirst({
        where: {
          username: data.username,
          userId: { not: userId },
        },
      });
      if (existing) {
        throw new Error('USERNAME_ALREADY_TAKEN');
      }
    }

    const updated = await prisma.profile.update({
      where: { userId },
      data,
      include: {
        interests: { include: { interest: true } },
        hobbies: { include: { hobby: true } },
      },
    });

    // Re-calculate profile completeness
    await this.calculateCompleteness(userId);

    return updated;
  }

  async setInterests(userId: string, interestIds: string[]) {
    // Replace all existing user interests
    await prisma.$transaction(async (tx) => {
      await tx.userInterest.deleteMany({ where: { userId } });
      if (interestIds.length > 0) {
        await tx.userInterest.createMany({
          data: interestIds.map((interestId) => ({ userId, interestId })),
          skipDuplicates: true,
        });
      }
    });

    await this.calculateCompleteness(userId);

    return prisma.userInterest.findMany({
      where: { userId },
      include: { interest: true },
    });
  }

  async setHobbies(userId: string, hobbyIds: string[]) {
    await prisma.$transaction(async (tx) => {
      await tx.userHobby.deleteMany({ where: { userId } });
      if (hobbyIds.length > 0) {
        await tx.userHobby.createMany({
          data: hobbyIds.map((hobbyId) => ({ userId, hobbyId })),
          skipDuplicates: true,
        });
      }
    });

    await this.calculateCompleteness(userId);

    return prisma.userHobby.findMany({
      where: { userId },
      include: { hobby: true },
    });
  }

  async updatePrivacySettings(userId: string, data: any) {
    return prisma.privacySettings.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }

  async updateLocationPreferences(userId: string, data: any) {
    return prisma.locationPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }

  private async calculateCompleteness(userId: string): Promise<number> {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        interests: true,
        hobbies: true,
      },
    });

    if (!profile) return 0;

    let score = 0;
    if (profile.displayName) score += 15;
    if (profile.username) score += 15;
    if (profile.avatarUrl) score += 20;
    if (profile.bio) score += 10;
    if (profile.profession) score += 10;
    if (profile.interests.length >= 3) score += 15;
    if (profile.hobbies.length >= 1) score += 10;
    if (profile.lookingFor && profile.lookingFor.length > 0) score += 5;

    await prisma.profile.update({
      where: { userId },
      data: { profileCompleteness: Math.min(score, 100) },
    });

    return score;
  }
}

export const profilesService = new ProfilesService();
