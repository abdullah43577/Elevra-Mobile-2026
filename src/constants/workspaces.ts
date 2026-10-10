import { CONTENT_COLORS } from "./content-colors";
import {
  BookUser,
  FileText,
  Mail,
  MessagesSquare,
  Mic,
  StickyNote,
  LucideIcon,
} from "lucide-react-native";

export interface WorkspaceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  color: string;
}

/*
  The tools an application draws on. Applications themselves are a tab, not a
  card here: they are the hub everything below attaches to. Notes and voice
  notes come last and are described by what they attach to, not as headline
  tools of their own.
*/
export const WORKSPACE_ITEMS: WorkspaceItem[] = [
  {
    id: "resume-studio",
    color: CONTENT_COLORS.resume,
    title: "Resume Studio",
    description: "ATS-ready resumes, tailored per job",
    icon: FileText,
    route: "resume-studio",
  },
  {
    id: "cover-letters",
    color: CONTENT_COLORS.letter,
    title: "Cover Letters",
    description: "Letters that match the resume you send",
    icon: Mail,
    route: "cover-letters",
  },
  {
    id: "interview-prep",
    color: CONTENT_COLORS.interview,
    title: "Interview Prep",
    description: "Rehearse real questions out loud",
    icon: MessagesSquare,
    route: "interview-prep",
  },
  {
    id: "career-profile",
    color: CONTENT_COLORS.profile,
    title: "Career Profile",
    description: "Your history once — everything prefills from it",
    icon: BookUser,
    route: "career-profile",
  },
  {
    id: "smart-notes",
    color: CONTENT_COLORS.note,
    title: "Notes",
    description: "Research and prep notes, linked to applications",
    icon: StickyNote,
    route: "smart-notes",
  },
  {
    id: "voice-notes",
    color: CONTENT_COLORS.recording,
    title: "Voice Notes",
    description: "Post-interview memos, transcribed and linked",
    icon: Mic,
    route: "voice-notes",
  },
];
