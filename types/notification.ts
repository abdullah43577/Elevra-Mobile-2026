export type NotificationType =
  | "SYSTEM"
  | "APPLICATION_STATUS"
  | "APPLICATION_REMINDER"
  | "RESUME_EXPORT"
  | "NOTE_SUMMARY"
  | "VOICE_TRANSCRIPTION";

export type NotificationEntity =
  | "application"
  | "resume"
  | "note"
  | "recording";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  readAt?: string | null;
  entityType?: NotificationEntity | string | null;
  entityId?: string | null;
  createdAt: string;
}

export interface UnreadCount {
  count: number;
}

export interface RegisterDeviceRequest {
  deviceToken: string;
  deviceType?: string;
}
