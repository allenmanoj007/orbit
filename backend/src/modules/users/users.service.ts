import prisma from '../../config/database';

export class UsersService {
  async searchUsers(query: string, currentUserId: string) {
    if (!query.trim()) return [];

    return prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        isActive: true,
        isBanned: false,
        profile: {
          OR: [
            { displayName: { contains: query, mode: 'insensitive' } },
            { username: { contains: query, mode: 'insensitive' } },
            { profession: { contains: query, mode: 'insensitive' } },
            { interests: { some: { interest: { name: { contains: query, mode: 'insensitive' } } } } },
          ],
        },
      },
      take: 20,
      include: {
        profile: {
          include: {
            interests: { include: { interest: true } },
          },
        },
      },
    });
  }

  async blockUser(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) throw new Error('CANNOT_BLOCK_SELF');

    // Remove any existing connection
    await prisma.connection.deleteMany({
      where: {
        OR: [
          { requesterId: blockerId, receiverId: blockedId },
          { requesterId: blockedId, receiverId: blockerId },
        ],
      },
    });

    return prisma.block.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      update: {},
      create: { blockerId, blockedId },
    });
  }

  async unblockUser(blockerId: string, blockedId: string) {
    return prisma.block.deleteMany({
      where: { blockerId, blockedId },
    });
  }

  async reportUser(reporterId: string, reportedUserId: string, reason: any, description?: string) {
    return prisma.report.create({
      data: {
        reporterId,
        reportedUserId,
        reason,
        description,
        status: 'PENDING',
      },
    });
  }

  async deleteAccount(userId: string) {
    return prisma.user.delete({
      where: { id: userId },
    });
  }
}

export const usersService = new UsersService();
