// ─── Snap ─────────────────────────────────────────────────────────────────────

export interface Snap {
  id: string;
  senderId: string;
  /** URL of the snap media (image or video) */
  mediaUrl: string;
  /** Optional caption text */
  caption: string | null;
  /** Seconds before the snap disappears after being viewed (1–10) */
  duration: number;
  /** Whether the snap has been destroyed server-side */
  isExpired: boolean;
  /** Latitude where the snap was taken */
  latitude: number;
  /** Longitude where the snap was taken */
  longitude: number;
  createdAt: string;
  expiresAt: string;

  // Relations
  recipients?: SnapRecipient[];
}

export interface SnapRecipient {
  id: string;
  snapId: string;
  recipientId: string;
  /** Whether the snap has been opened */
  isViewed: boolean;
  viewedAt: string | null;
  /** Whether the recipient took a screenshot */
  screenshotTaken: boolean;
  screenshotAt: string | null;
  createdAt: string;
}

// ─── Nearby Snaps ─────────────────────────────────────────────────────────────

/** A snap visible to users within the broadcast radius */
export interface NearbySnap {
  id: string;
  snapId: string;
  /** Broadcast radius in metres */
  radiusMeters: number;
  viewCount: number;
  createdAt: string;
  snap?: Snap;
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  caption: string | null;
  /** Latitude where the story was posted */
  latitude: number | null;
  /** Longitude where the story was posted */
  longitude: number | null;
  viewCount: number;
  isActive: boolean;
  createdAt: string;
  /** Stories expire after 24 h */
  expiresAt: string;

  // Relations
  views?: StoryView[];
}

export interface StoryView {
  id: string;
  storyId: string;
  viewerId: string;
  viewedAt: string;
  /** Whether the viewer reacted and with what emoji */
  reaction: string | null;
}
