import { router } from "expo-router";
import { User } from "../../types/auth";
import { Note } from "../../types/notes";
import { Resume } from "../../types/resume/resume";
import { VoiceRecording } from "../../types/voice-notes";

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

export const quickActions = [
  {
    id: "note",
    label: "New Note",
    icon: "document-text-outline",
    color: "#3B82F6",
    onPress: () =>
      router.push("/(dashboard)/(tabs)/workspaces/smart-notes/note-editor"),
  },
  {
    id: "recording",
    label: "New Recording",
    icon: "mic-outline",
    color: "#8B5CF6",
    onPress: () =>
      router.push("/(dashboard)/(tabs)/workspaces/voice-notes/recorder"),
  },
  {
    id: "resume",
    label: "New Resume",
    icon: "document-outline",
    color: "#10B981",
    onPress: () => router.push("/(dashboard)/(tabs)/workspaces/resume-studio"),
  },
];

export const getRecentItems = function ({
  notes,
  resumes,
  recordings,
}: {
  notes: Note[];
  resumes: Resume[];
  recordings: VoiceRecording[];
}) {
  const items: {
    id: string;
    title: string;
    type: string;
    date: string;
    route: string;
  }[] = [];

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
