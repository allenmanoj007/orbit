import prisma from '../../config/database';

export class ConnectionsService {
  async sendRequest(requesterId: string, receiverId: string, message?: string) {
    if (requesterId === receiverId) {
      throw new Error('CANNOT_CONNECT_SELF');
    }

    // Check if blocked
    const isBlocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: requesterId, blockedId: receiverId },
          { blockerId: receiverId, blockedId: requesterId },
        ],
      },
    });
    if (isBlocked) throw new Error('ACTION_NOT_ALLOWED');

    // Check existing
    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId, receiverId },
          { requesterId: receiverId, receiverId: requesterId },
        ],
      },
    });

    if (existing) {
      if (existing.status === 'ACCEPTED') throw new Error('ALREADY_CONNECTED');
      if (existing.status === 'PENDING') throw new Error('REQUEST_ALREADY_PENDING');
      // If declined, update to pending
      return prisma.connection.update({
        where: { id: existing.id },
        data: {
          requesterId,
          receiverId,
          status: 'PENDING',
          message,
        },
      });
    }

    const connection = await prisma.connection.create({
      data: {
        requesterId,
        receiverId,
        message,
        status: 'PENDING',
      },
      include: {
        receiver: {
          include: { profile: true },
        },
      },
    });

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'CONNECTION_REQUEST',
        title: 'New Connection Request',
        body: 'Someone nearby wants to connect with you!',
        data: { connectionId: connection.id, requesterId },
      },
    });

    return connection;
  }

  async acceptRequest(connectionId: string, userId: string) {
    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) throw new Error('CONNECTION_NOT_FOUND');
    if (connection.receiverId !== userId) throw new Error('UNAUTHORIZED');

    const updated = await prisma.connection.update({
      where: { id: connectionId },
      data: { status: 'ACCEPTED' },
    });

    // Auto-create a conversation room for these 2 users
    const existingConv = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { members: { some: { userId: connection.requesterId } } },
          { members: { some: { userId: connection.receiverId } } },
        ],
      },
    });

    if (!existingConv) {
      await prisma.conversation.create({
        data: {
          isGroup: false,
          members: {
            create: [
              { userId: connection.requesterId },
              { userId: connection.receiverId },
            ],
          },
        },
      });
    }

    // Notify requester
    await prisma.notification.create({
      data: {
        userId: connection.requesterId,
        type: 'CONNECTION_ACCEPTED',
        title: 'Connection Accepted 🎉',
        body: 'Your connection request was accepted! Start chatting now.',
        data: { connectionId: connection.id, acceptedBy: userId },
      },
    });

    return updated;
  }

  async declineRequest(connectionId: string, userId: string) {
    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) throw new Error('CONNECTION_NOT_FOUND');
    if (connection.receiverId !== userId) throw new Error('UNAUTHORIZED');

    return prisma.connection.update({
      where: { id: connectionId },
      data: { status: 'DECLINED' },
    });
  }

  async removeConnection(connectionId: string, userId: string) {
    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) throw new Error('CONNECTION_NOT_FOUND');
    if (connection.requesterId !== userId && connection.receiverId !== userId) {
      throw new Error('UNAUTHORIZED');
    }

    return prisma.connection.delete({ where: { id: connectionId } });
  }

  async getConnections(userId: string) {
    return prisma.connection.findMany({
      where: {
        OR: [{ requesterId: userId }, { receiverId: userId }],
        status: 'ACCEPTED',
      },
      include: {
        requester: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getPendingRequests(userId: string) {
    return prisma.connection.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        requester: {
          include: {
            profile: {
              include: {
                interests: { include: { interest: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const connectionsService = new ConnectionsService();
