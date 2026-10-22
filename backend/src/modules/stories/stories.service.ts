import prisma from '../../config/database';

export class StoriesService {
  async createStory(userId: string, data: { content?: string; mediaAttachmentId: string }) {
    // Stories expire in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return prisma.story.create({
      data: {
        userId,
        content: data.content,
        expiresAt,
        mediaAttachments: {
          connect: { id: data.mediaAttachmentId },
        },
      },
      include: {
        mediaAttachments: true,
        user: { include: { profile: true } },
      },
    });
  }

  async getFeedStories(userId: string) {
    // Stories from user and their accepted connections
    const connections = await prisma.connection.findMany({
      where: {
        OR: [{ requesterId: userId }, { receiverId: userId }],
        status: 'ACCEPTED',
      },
    });

    const friendIds = connections.map((c) =>
      c.requesterId === userId ? c.receiverId : c.requesterId
    );
    friendIds.push(userId); // include own stories

    const activeStories = await prisma.story.findMany({
      where: {
        userId: { in: friendIds },
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: { profile: true },
        },
        mediaAttachments: true,
        views: {
          where: { viewerId: userId },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group stories by user
    const groupedByUser: Record<string, any> = {};

    for (const story of activeStories) {
      if (!groupedByUser[story.userId]) {
        groupedByUser[story.userId] = {
          user: {
            id: story.user.id,
            displayName: story.user.profile?.displayName,
            username: story.user.profile?.username,
            avatarUrl: story.user.profile?.avatarUrl,
          },
          hasUnviewed: false,
          stories: [],
        };
      }

      const viewed = story.views.length > 0;
      if (!viewed && story.userId !== userId) {
        groupedByUser[story.userId].hasUnviewed = true;
      }

      groupedByUser[story.userId].stories.push({
        id: story.id,
        content: story.content,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
        viewCount: story.viewCount,
        viewed,
        mediaAttachments: story.mediaAttachments,
      });
    }

    return Object.values(groupedByUser);
  }

  async viewStory(storyId: string, viewerId: string) {
    await prisma.storyView.upsert({
      where: { storyId_viewerId: { storyId, viewerId } },
      update: { viewedAt: new Date() },
      create: { storyId, viewerId },
    });

    return prisma.story.update({
      where: { id: storyId },
      data: { viewCount: { increment: 1 } },
    });
  }
}

export const storiesService = new StoriesService();
