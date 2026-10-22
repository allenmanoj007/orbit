import prisma from '../../config/database';

export class ChatService {
  async getOrCreateConversation(userAId: string, userBId: string) {
    if (userAId === userBId) throw new Error('CANNOT_CHAT_SELF');

    // Check if conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { members: { some: { userId: userAId } } },
          { members: { some: { userId: userBId } } },
        ],
      },
      include: {
        members: {
          include: {
            user: { include: { profile: true } },
          },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          isGroup: false,
          members: {
            create: [{ userId: userAId }, { userId: userBId }],
          },
        },
        include: {
          members: {
            include: {
              user: { include: { profile: true } },
            },
          },
        },
      });
    }

    return conversation;
  }

  async getConversations(userId: string) {
    const memberships = await prisma.conversationMember.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            members: {
              include: {
                user: {
                  include: {
                    profile: true,
                    location: {
                      select: { city: true, country: true },
                    },
                  },
                },
              },
            },
            messages: {
              take: 1,
              orderBy: { createdAt: 'desc' },
              include: {
                mediaAttachments: true,
              },
            },
          },
        },
      },
      orderBy: { conversation: { lastMessageAt: 'desc' } },
    });

    return memberships.map((m) => {
      const conv = m.conversation;
      const otherMember = conv.members.find((member) => member.userId !== userId);
      const lastMsg = conv.messages[0] || null;

      return {
        id: conv.id,
        isGroup: conv.isGroup,
        groupName: conv.groupName,
        groupAvatarUrl: conv.groupAvatarUrl,
        otherUser: otherMember
          ? {
              id: otherMember.user.id,
              displayName: otherMember.user.profile?.displayName,
              username: otherMember.user.profile?.username,
              avatarUrl: otherMember.user.profile?.avatarUrl,
              city: otherMember.user.location?.city,
            }
          : null,
        lastMessage: lastMsg
          ? {
              id: lastMsg.id,
              content: lastMsg.content,
              messageType: lastMsg.messageType,
              createdAt: lastMsg.createdAt,
              senderId: lastMsg.senderId,
            }
          : null,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: 0, // Calculated or incremented in real-time
      };
    });
  }

  async getMessages(conversationId: string, userId: string, page = 1, limit = 50) {
    // Verify membership
    const isMember = await prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!isMember) throw new Error('NOT_CONVERSATION_MEMBER');

    const skip = (page - 1) * limit;

    const messages = await prisma.message.findMany({
      where: { conversationId, isDeleted: false },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            profile: {
              select: { displayName: true, username: true, avatarUrl: true },
            },
          },
        },
        mediaAttachments: true,
        reactions: true,
        replyTo: {
          include: {
            sender: {
              select: {
                profile: { select: { displayName: true } },
              },
            },
          },
        },
      },
    });

    // Mark as read
    await prisma.conversationMember.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date() },
    });

    return messages.reverse();
  }

  async sendMessage(
    userId: string,
    data: {
      conversationId: string;
      content?: string;
      messageType?: any;
      replyToId?: string;
      mediaAttachmentId?: string;
    }
  ) {
    // Verify membership
    const isMember = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: data.conversationId,
          userId,
        },
      },
    });
    if (!isMember) throw new Error('NOT_CONVERSATION_MEMBER');

    const message = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.create({
        data: {
          conversationId: data.conversationId,
          senderId: userId,
          content: data.content,
          messageType: data.messageType || 'TEXT',
          replyToId: data.replyToId,
        },
        include: {
          sender: {
            select: {
              id: true,
              profile: {
                select: { displayName: true, username: true, avatarUrl: true },
              },
            },
          },
          replyTo: {
            include: {
              sender: {
                select: {
                  profile: { select: { displayName: true } },
                },
              },
            },
          },
          mediaAttachments: true,
          reactions: true,
        },
      });

      // Attach media if provided
      if (data.mediaAttachmentId) {
        await tx.mediaAttachment.update({
          where: { id: data.mediaAttachmentId },
          data: { messageId: msg.id },
        });
      }

      // Update conversation lastMessageAt
      await tx.conversation.update({
        where: { id: data.conversationId },
        data: { lastMessageAt: new Date() },
      });

      return msg;
    });

    return message;
  }

  async reactToMessage(messageId: string, userId: string, emoji: string) {
    const existing = await prisma.messageReaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji,
        },
      },
    });

    if (existing) {
      // Toggle off
      await prisma.messageReaction.delete({ where: { id: existing.id } });
      return { added: false, emoji };
    }

    const reaction = await prisma.messageReaction.create({
      data: { messageId, userId, emoji },
    });

    return { added: true, reaction };
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message || message.senderId !== userId) throw new Error('UNAUTHORIZED');

    return prisma.message.update({
      where: { id: messageId },
      data: { isDeleted: true, deletedAt: new Date(), content: 'This message was deleted' },
    });
  }
}

export const chatService = new ChatService();
