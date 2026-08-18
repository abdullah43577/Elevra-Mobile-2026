import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { router } from "expo-router";
import { User } from "../../types/auth";
import { CoverLetter } from "../../types/cover-letter";
import { InterviewQuestion } from "../../types/interview-prep";
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
  /*
    Carried per item rather than assumed to be `{ id }`. The detail screens do
    not agree on a param name — the resume builder reads `resumeId`, the letter
    editor `coverLetterId`, question detail `questionId` — so a single hardcoded
    `id` opened the resume builder with nothing in it and rendered
    "Template not found".
  */
  params: Record<string, string>;
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

/*
  Two rows of three, grouped: the documents you send, then the things you do.
  Rehearse is an action rather than a create, but it is the one thing on this
  screen most likely to change an outcome, so it earns a slot.
*/
export const quickActions = [
  {
    id: "resume",
    label: "Resume",
    icon: "document-outline",
    color: CONTENT_COLORS.resume,
    onPress: () => router.push("/(dashboard)/(tabs)/workspaces/resume-studio"),
  },
  {
    id: "cover-letter",
    label: "Letter",
    icon: "mail-outline",
    color: CONTENT_COLORS.letter,
    onPress: () =>
      router.push(
        "/(dashboard)/(tabs)/workspaces/cover-letters/letter-editor",
      ),
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
  {
    id: "rehearse",
    label: "Rehearse",
    icon: "chatbubbles-outline",
    color: CONTENT_COLORS.interview,
    onPress: () =>
      router.push("/(dashboard)/(tabs)/workspaces/interview-prep"),
  },
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
  coverLetters,
  questions,
}: {
  notes: Note[];
  resumes: Resume[];
  recordings: VoiceRecording[];
  applications: JobApplication[];
  coverLetters: CoverLetter[];
  questions: InterviewQuestion[];
}) {
  const items: RecentItem[] = [];

  applications.slice(0, 2).forEach((application) => {
    items.push({
      id: application.id,
      title: `${application.role} · ${application.company}`,
      type: "Application",
      date: application.updatedAt,
      route: "/(dashboard)/(tabs)/workspaces/job-tracker/application-detail",
      params: { id: application.id },
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
      params: { id: note.id },
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
      params: { resumeId: resume.id },
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
      params: { id: recording.id },
    });
  });

  coverLetters.slice(0, 2).forEach((letter) => {
    items.push({
      id: letter.id,
      title: letter.title,
      type: "CoverLetter",
      date: letter.updatedAt,
      route: "/(dashboard)/(tabs)/workspaces/cover-letters/letter-editor",
      params: { coverLetterId: letter.id },
    });
  });

  /*
    Only questions the user has actually answered, dated by the answer rather
    than the question — the seeded catalogue never changes, so question.updatedAt
    would put fifty identical timestamps at the top of this list.
  */
  questions
    .filter((question) => !!question.answers?.[0])
    .sort(
      (a, b) =>
        new Date(b.answers![0]!.updatedAt).getTime() -
        new Date(a.answers![0]!.updatedAt).getTime(),
    )
    .slice(0, 2)
    .forEach((question) => {
      items.push({
        id: question.id,
        title: question.text,
        type: "InterviewQuestion",
        date: question.answers![0]!.updatedAt,
        route: "/(dashboard)/(tabs)/workspaces/interview-prep/question-detail",
        params: { questionId: question.id },
      });
    });

  // Sort by date (newest first) and limit to 5
  return items
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
};
