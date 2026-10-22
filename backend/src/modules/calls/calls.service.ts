import prisma from '../../config/database';
import { config } from '../../config/env';

export class CallsService {
  getIceServers() {
    return [
      { urls: config.STUN_URL || 'stun:stun.l.google.com:19302' },
      ...(config.TURN_URL && config.TURN_USERNAME
        ? [
            {
              urls: config.TURN_URL,
              username: config.TURN_USERNAME,
              credential: config.TURN_CREDENTIAL,
            },
          ]
        : []),
    ];
  }

  async initiateCall(callerId: string, receiverId: string, callType: 'AUDIO' | 'VIDEO') {
    const call = await prisma.call.create({
      data: {
        callerId,
        receiverId,
        callType,
        status: 'RINGING',
        startedAt: new Date(),
      },
      include: {
        caller: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    });

    return {
      call,
      iceServers: this.getIceServers(),
    };
  }

  async updateCallStatus(callId: string, status: any, duration?: number) {
    return prisma.call.update({
      where: { id: callId },
      data: {
        status,
        endedAt: ['ENDED', 'DECLINED', 'MISSED', 'FAILED'].includes(status) ? new Date() : undefined,
        duration,
      },
    });
  }

  async getCallHistory(userId: string) {
    return prisma.call.findMany({
      where: {
        OR: [{ callerId: userId }, { receiverId: userId }],
      },
      include: {
        caller: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}

export const callsService = new CallsService();
