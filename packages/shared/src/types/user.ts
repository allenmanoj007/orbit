// ─── Enums ────────────────────────────────────────────────────────────────────

export enum ConnectionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  BLOCKED = 'BLOCKED',
}

export enum LocationPreference {
  PRECISE = 'PRECISE',
  APPROXIMATE = 'APPROXIMATE',
  HIDDEN = 'HIDDEN',
}

// ─── Scalars / Simple Unions ───────────────────────────────────────────────────

export type LookingForOption =
  | 'FRIENDSHIP'
  | 'NETWORKING'
  | 'DATING'
  | 'ACTIVITY_PARTNERS'
  | 'MENTORSHIP'
  | 'COLLABORATION';

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  isSuspended: boolean;
  suspendedUntil: string | null; // ISO date string
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string | null;

  // Relations (optional — may not always be loaded)
  profile?: Profile;
  privacySettings?: PrivacySettings;
  location?: UserLocation | null;
  interests?: UserInterest[];
  hobbies?: UserHobby[];
}

export interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  profession: string | null;
  age: number | null;
  gender: string | null;
  pronouns: string | null;
  website: string | null;
  lookingFor: LookingForOption[];
  createdAt: string;
  updatedAt: string;
}

export interface UserLocation {
  id: string;
  userId: string;
  /** Latitude — only exposed to admins or self */
  latitude: number;
  /** Longitude — only exposed to admins or self */
  longitude: number;
  /** Human-readable city derived server-side */
  city: string | null;
  /** Human-readable country derived server-side */
  country: string | null;
  accuracy: number | null;
  updatedAt: string;
}

export interface PrivacySettings {
  id: string;
  userId: string;
  locationPreference: LocationPreference;
  /** Visibility radius in metres; null = use app default */
  visibilityRadius: number | null;
  showAge: boolean;
  showGender: boolean;
  showProfession: boolean;
  allowMessages: boolean;
  allowConnectionRequests: boolean;
  updatedAt: string;
}

// ─── Interests & Hobbies ──────────────────────────────────────────────────────

export interface Interest {
  id: string;
  name: string;
  emoji: string | null;
  category: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Hobby {
  id: string;
  name: string;
  emoji: string | null;
  category: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface UserInterest {
  id: string;
  userId: string;
  interestId: string;
  interest?: Interest;
  createdAt: string;
}

export interface UserHobby {
  id: string;
  userId: string;
  hobbyId: string;
  hobby?: Hobby;
  createdAt: string;
}

// ─── Connections ──────────────────────────────────────────────────────────────

export interface Connection {
  id: string;
  requesterId: string;
  recipientId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;

  // Relations
  requester?: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
  recipient?: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
}
