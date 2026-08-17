import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { router } from "expo-router";
import { User } from "../../types/auth";
import { JobApplication } from "../../types/job-application";
import { Note } from "../../types/notes";
import { Resume } from "../../types/resume/resume";
import { VoiceRecording } from "../../types/voice-notes";
import { CONTENT_COLORS, ContentCategory } from "./content-colors";

export interface RecentItem {
  id: string;
  title: string;
  type: ContentCategory;
  date: string;
  route: string;
}

export const getGreeting = function () {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const formatDate = function () {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export const getInitials = function ({ profile }: { profile?: User }) {
  if (!profile) return "?";
  const first = profile.first_name?.charAt(0) || "";
  const last = profile.last_name?.charAt(0) || "";
  return `${first}${last}`.toUpperCase();
};

export const formatRelativeDate = function (date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const quickActions = [
  {
    id: "note",
    label: "Note",
    icon: "document-text-outline",
    color: CONTENT_COLORS.note,
    onPress: () =>
      router.push("/(dashboard)/(tabs)/workspaces/smart-notes/note-editor"),
  },
  {
    id: "recording",
    label: "Recording",
    icon: "mic-outline",
    color: CONTENT_COLORS.recording,
    onPress: () =>
      router.push("/(dashboard)/(tabs)/workspaces/voice-notes/recorder"),
  },
  {
    id: "resume",
    label: "Resume",
    icon: "document-outline",
    color: CONTENT_COLORS.resume,
    onPress: () => router.push("/(dashboard)/(tabs)/workspaces/resume-studio"),
  },
  {
    id: "application",
    label: "Application",
    icon: "briefcase-outline",
    color: CONTENT_COLORS.application,
    onPress: () =>
      router.push(
        "/(dashboard)/(tabs)/workspaces/job-tracker/application-form",
      ),
  },
] satisfies {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}[];

export const getRecentItems = function ({
  notes,
  resumes,
  recordings,
  applications,
}: {
  notes: Note[];
  resumes: Resume[];
  recordings: VoiceRecording[];
  applications: JobApplication[];
}) {
  const items: RecentItem[] = [];

  applications.slice(0, 2).forEach((application) => {
    items.push({
      id: application.id,
      title: `${application.role} · ${application.company}`,
      type: "Application",
      date: application.updatedAt,
      route: "/(dashboard)/(tabs)/workspaces/job-tracker/application-detail",
    });
  });

  // Add recent notes
  notes.slice(0, 3).forEach((note) => {
    items.push({
      id: note.id,
      title: note.title,
      type: "Note",
      date: note.updatedAt,
      route: "/(dashboard)/(tabs)/workspaces/smart-notes/note-editor",
    });
  });

  // Add recent resumes
  resumes.slice(0, 2).forEach((resume) => {
    items.push({
      id: resume.id,
      title: resume.title,
      type: "Resume",
      date: resume.updatedAt,
      route: "/(dashboard)/(tabs)/workspaces/resume-studio/resume-builder",
    });
  });

  // Add recent recordings
  recordings.slice(0, 2).forEach((recording) => {
    items.push({
      id: recording.id,
      title: recording.title,
      type: "Recording",
      date: recording.createdAt,
      route: "/(dashboard)/(tabs)/workspaces/voice-notes/playback",
    });
  });

  // Sort by date (newest first) and limit to 5
  return items
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
};
