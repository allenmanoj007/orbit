// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  User,
  Profile,
  UserLocation,
  PrivacySettings,
  UserInterest,
  UserHobby,
  Interest,
  Hobby,
  Connection,
  LookingForOption,
} from './types/user';
export { ConnectionStatus, LocationPreference } from './types/user';

export type {
  Conversation,
  ConversationMember,
  Message,
  MessageReaction,
  MediaAttachment,
} from './types/chat';
export { MessageType, MediaType } from './types/chat';

export type { Snap, SnapRecipient, NearbySnap, Story, StoryView } from './types/snap';

export type { Call } from './types/call';
export { CallType, CallStatus } from './types/call';

export type { Notification } from './types/notification';
export { NotificationType } from './types/notification';

export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  NearbyUserResult,
  CompatibilityResult,
} from './types/api';

// ─── Utils ────────────────────────────────────────────────────────────────────
export { formatDistance, getDistanceRange } from './utils/distance';
export {
  calculateCompatibility,
  type CompatibilityInput,
} from './utils/compatibility';
