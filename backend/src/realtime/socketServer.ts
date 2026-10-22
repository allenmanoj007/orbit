import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';
import { presenceManager } from './presenceManager';
import { logger } from '../utils/logger';

export function initializeSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // Configurable in production
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  // Authentication Middleware
  io.use((socket: Socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('AUTH_TOKEN_REQUIRED'));
    }

    try {
      const decoded = verifyAccessToken(token);
      (socket as any).userId = decoded.userId;
      next();
    } catch {
      next(new Error('INVALID_TOKEN'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    const userId = (socket as any).userId;
    logger.info(`⚡ Socket connected: ${socket.id} (user: ${userId})`);

    // Track user presence
    await presenceManager.setUserOnline(userId, socket.id);
    socket.join(`user:${userId}`);
    socket.broadcast.emit('presence:online', { userId });

    // ─────────────────────────────────────────────────────────
    // CHAT EVENTS
    // ─────────────────────────────────────────────────────────
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conv:${conversationId}`);
      logger.debug(`User ${userId} joined room conv:${conversationId}`);
    });

    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conv:${conversationId}`);
    });

    socket.on('chat:typing_start', (data: { conversationId: string }) => {
      socket.to(`conv:${data.conversationId}`).emit('chat:typing', {
        conversationId: data.conversationId,
        userId,
        isTyping: true,
      });
    });

    socket.on('chat:typing_stop', (data: { conversationId: string }) => {
      socket.to(`conv:${data.conversationId}`).emit('chat:typing', {
        conversationId: data.conversationId,
        userId,
        isTyping: false,
      });
    });

    socket.on('chat:message_sent', (data: { conversationId: string; message: any }) => {
      socket.to(`conv:${data.conversationId}`).emit('chat:message_received', data.message);
    });

    socket.on('chat:message_read', (data: { conversationId: string; messageId: string }) => {
      socket.to(`conv:${data.conversationId}`).emit('chat:message_read_receipt', {
        conversationId: data.conversationId,
        messageId: data.messageId,
        readBy: userId,
      });
    });

    // ─────────────────────────────────────────────────────────
    // WebRTC CALL SIGNALING (Audio & Video Calling)
    // ─────────────────────────────────────────────────────────
    socket.on('call:initiate', async (data: {
      callId: string;
      receiverId: string;
      callType: 'AUDIO' | 'VIDEO';
      callerInfo: any;
    }) => {
      logger.info(`Call initiated by ${userId} to ${data.receiverId}`);
      io.to(`user:${data.receiverId}`).emit('call:incoming', {
        callId: data.callId,
        callerId: userId,
        callType: data.callType,
        callerInfo: data.callerInfo,
      });
    });

    socket.on('call:accept', (data: { callId: string; callerId: string }) => {
      logger.info(`Call ${data.callId} accepted by ${userId}`);
      io.to(`user:${data.callerId}`).emit('call:accepted', {
        callId: data.callId,
        acceptedBy: userId,
      });
    });

    socket.on('call:decline', (data: { callId: string; callerId: string }) => {
      io.to(`user:${data.callerId}`).emit('call:declined', {
        callId: data.callId,
        declinedBy: userId,
      });
    });

    socket.on('call:end', (data: { callId: string; targetUserId: string }) => {
      io.to(`user:${data.targetUserId}`).emit('call:ended', {
        callId: data.callId,
        endedBy: userId,
      });
    });

    // WebRTC Offer
    socket.on('webrtc:offer', (data: { targetUserId: string; sdp: any; callId: string }) => {
      io.to(`user:${data.targetUserId}`).emit('webrtc:offer', {
        fromUserId: userId,
        sdp: data.sdp,
        callId: data.callId,
      });
    });

    // WebRTC Answer
    socket.on('webrtc:answer', (data: { targetUserId: string; sdp: any; callId: string }) => {
      io.to(`user:${data.targetUserId}`).emit('webrtc:answer', {
        fromUserId: userId,
        sdp: data.sdp,
        callId: data.callId,
      });
    });

    // WebRTC ICE Candidate
    socket.on('webrtc:ice_candidate', (data: { targetUserId: string; candidate: any; callId: string }) => {
      io.to(`user:${data.targetUserId}`).emit('webrtc:ice_candidate', {
        fromUserId: userId,
        candidate: data.candidate,
        callId: data.callId,
      });
    });

    // ─────────────────────────────────────────────────────────
    // DISCONNECTION
    // ─────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      logger.info(`Socket disconnected: ${socket.id} (user: ${userId})`);
      await presenceManager.setUserOffline(userId);
      socket.broadcast.emit('presence:offline', { userId });
    });
  });

  return io;
}
