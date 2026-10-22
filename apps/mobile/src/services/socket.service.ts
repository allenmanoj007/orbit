import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { SOCKET_URL } from '../constants/api';

class SocketService {
  private socket: Socket | null = null;

  async connect(): Promise<Socket> {
    if (this.socket?.connected) return this.socket;

    const token = await SecureStore.getItemAsync('orbit_access_token');

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
    });

    this.socket.on('connect', () => {
      console.log('⚡ Connected to Orbit Real-Time Socket');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from Orbit Real-Time Socket');
    });

    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Conversation Helpers
  joinConversation(conversationId: string) {
    this.socket?.emit('conversation:join', conversationId);
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit('conversation:leave', conversationId);
  }

  emitTyping(conversationId: string, isTyping: boolean) {
    if (isTyping) {
      this.socket?.emit('chat:typing_start', { conversationId });
    } else {
      this.socket?.emit('chat:typing_stop', { conversationId });
    }
  }
}

export const socketService = new SocketService();
