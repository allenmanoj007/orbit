// ─── Enum ─────────────────────────────────────────────────────────────────────

export enum NotificationType {
  CONNECTION_REQUEST = 'CONNECTION_REQUEST',
  CONNECTION_ACCEPTED = 'CONNECTION_ACCEPTED',
  MESSAGE = 'MESSAGE',
  SNAP_RECEIVED = 'SNAP_RECEIVED',
  SNAP_SCREENSHOT = 'SNAP_SCREENSHOT',
  STORY_VIEW = 'STORY_VIEW',
  STORY_REACTION = 'STORY_REACTION',
  NEARBY_USER = 'NEARBY_USER',
  CALL_INCOMING = 'CALL_INCOMING',
  CALL_MISSED = 'CALL_MISSED',
  SYSTEM = 'SYSTEM',
  ACCOUNT_WARNING = 'ACCOUNT_WARNING',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  /** Deep-link or route payload stored as JSON */
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt: string | null;
  /** FCM / APNS push sent */
  isPushSent: boolean;
  createdAt: string;
}
