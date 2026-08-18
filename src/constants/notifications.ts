import { CONTENT_COLORS } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { NotificationEntity, NotificationType } from "../../types/notification";

interface NotificationMeta {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

/*
  Per-type icon and colour, owned here so a notification looks the same in the
  list, the empty state, and anywhere else it surfaces. Colours reuse
  CONTENT_COLORS so a note summary reads as Smart Notes and an application
  update reads as the Job Tracker.
*/
export const NOTIFICATION_META = {
  SYSTEM: { icon: "sparkles-outline", color: CONTENT_COLORS.note },
  APPLICATION_STATUS: {
    icon: "briefcase-outline",
    color: CONTENT_COLORS.application,
  },
  APPLICATION_REMINDER: {
    icon: "alarm-outline",
    color: CONTENT_COLORS.application,
  },
  RESUME_EXPORT: { icon: "document-outline", color: CONTENT_COLORS.resume },
  NOTE_SUMMARY: { icon: "document-text-outline", color: CONTENT_COLORS.note },
  VOICE_TRANSCRIPTION: { icon: "mic-outline", color: CONTENT_COLORS.recording },
} as const satisfies Record<NotificationType, NotificationMeta>;

// Where tapping a notification should take the user. Anything without a
// mapping simply does not navigate.
export const NOTIFICATION_ROUTES: Record<NotificationEntity, string> = {
  application: "/(dashboard)/(tabs)/workspaces/job-tracker/application-detail",
  note: "/(dashboard)/(tabs)/workspaces/smart-notes/note-editor",
  recording: "/(dashboard)/(tabs)/workspaces/voice-notes/playback",
  resume: "/(dashboard)/(tabs)/workspaces/resume-studio/resume-builder",
};
