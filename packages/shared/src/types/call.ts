// ─── Enums ────────────────────────────────────────────────────────────────────

export enum CallType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

export enum CallStatus {
  INITIATED = 'INITIATED',
  RINGING = 'RINGING',
  CONNECTED = 'CONNECTED',
  ENDED = 'ENDED',
  MISSED = 'MISSED',
  DECLINED = 'DECLINED',
  FAILED = 'FAILED',
}

// ─── Call ─────────────────────────────────────────────────────────────────────

export interface Call {
  id: string;
  callerId: string;
  recipientId: string;
  type: CallType;
  status: CallStatus;
  /** WebRTC session / TURN credential token */
  sessionId: string | null;
  /** Duration in seconds; null if call never connected */
  durationSeconds: number | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
