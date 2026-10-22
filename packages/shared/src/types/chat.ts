// ─── Enums ────────────────────────────────────────────────────────────────────

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  LOCATION = 'LOCATION',
  SNAP = 'SNAP',
  SYSTEM = 'SYSTEM',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface MediaAttachment {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  type: MediaType;
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** Duration in seconds (video/audio only) */
  duration: number | null;
  /** Width in pixels (image/video only) */
  width: number | null;
  /** Height in pixels (image/video only) */
  height: number | null;
  createdAt: string;
}

// ─── Reactions ────────────────────────────────────────────────────────────────

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: string;
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  /** Plaintext or null for media-only messages */
  content: string | null;
  /** Encrypted ciphertext (if E2E is enabled) */
  encryptedContent: string | null;
  /** For LOCATION messages */
  locationLatitude: number | null;
  locationLongitude: number | null;
  isDeleted: boolean;
  deletedAt: string | null;
  editedAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  media?: MediaAttachment[];
  reactions?: MessageReaction[];
  readBy?: string[]; // array of userId
}

// ─── Conversation Members ─────────────────────────────────────────────────────

export interface ConversationMember {
  id: string;
  conversationId: string;
  userId: string;
  joinedAt: string;
  lastReadAt: string | null;
  /** Member has muted notifications for this conversation */
  isMuted: boolean;
  /** Member has been removed/left */
  isActive: boolean;
}

// ─── Conversation ─────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  /** null = direct message, non-null = group */
  name: string | null;
  avatarUrl: string | null;
  isGroup: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  members?: ConversationMember[];
  lastMessage?: Message | null;
  /** Unread count for the requesting user */
  unreadCount?: number;
}
