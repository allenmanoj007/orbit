import prisma from '../../config/database';
import { calculateDistance, formatDistance } from '../../utils/location';

export class SnapsService {
  async createSnap(userId: string, data: any) {
    let expiresAt: Date | null = null;
    const now = new Date();

    if (data.expiry === 'HOURS_24') {
      expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    } else if (data.expiry === 'DAYS_7') {
      expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    const snap = await prisma.snap.create({
      data: {
        senderId: userId,
        content: data.content,
        visibility: data.visibility || 'FRIENDS',
        expiry: data.expiry || 'HOURS_24',
        expiresAt,
        mediaAttachments: {
          connect: { id: data.mediaAttachmentId },
        },
        recipients: data.recipientIds?.length
          ? {
              create: data.recipientIds.map((rid: string) => ({
                userId: rid,
              })),
            }
          : undefined,
      },
      include: {
        mediaAttachments: true,
        recipients: true,
      },
    });

    return snap;
  }

  async createNearbySnap(userId: string, data: any) {
    // 24 hour expiry default for nearby snaps
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const snap = await prisma.nearbySnap.create({
      data: {
        creatorId: userId,
        content: data.content,
        latitude: data.latitude,
        longitude: data.longitude,
        radiusKm: data.radiusKm || 1,
        expiresAt,
        mediaAttachments: {
          connect: { id: data.mediaAttachmentId },
        },
      },
      include: {
        mediaAttachments: true,
        creator: {
          include: { profile: true },
        },
      },
    });

    return snap;
  }

  async getNearbySnaps(userId: string, userLat: number, userLng: number) {
    const activeSnaps = await prisma.nearbySnap.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
      include: {
        mediaAttachments: true,
        creator: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter within radius without exposing exact creator coords
    return activeSnaps
      .filter((snap) => {
        const dist = calculateDistance(userLat, userLng, snap.latitude, snap.longitude);
        return dist <= snap.radiusKm * 1000;
      })
      .map((snap) => {
        const dist = calculateDistance(userLat, userLng, snap.latitude, snap.longitude);
        return {
          id: snap.id,
          content: snap.content,
          createdAt: snap.createdAt,
          expiresAt: snap.expiresAt,
          creator: {
            id: snap.creator.id,
            displayName: snap.creator.profile?.displayName,
            avatarUrl: snap.creator.profile?.avatarUrl,
          },
          distanceFormatted: formatDistance(dist),
          mediaAttachments: snap.mediaAttachments,
        };
      });
  }

  async viewSnap(snapId: string, viewerId: string) {
    await prisma.snapView.upsert({
      where: { snapId_viewerId: { snapId, viewerId } },
      update: { viewedAt: new Date() },
      create: { snapId, viewerId },
    });

    return prisma.snap.update({
      where: { id: snapId },
      data: { viewCount: { increment: 1 } },
    });
  }
}

export const snapsService = new SnapsService();
