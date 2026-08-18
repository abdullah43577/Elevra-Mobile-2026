import { Ionicons } from "@expo/vector-icons";
import { CONTENT_COLORS } from "./content-colors";
import {
  FileText,
  Mic,
  Sparkles,
  StickyNote,
  Briefcase,
  ClipboardList,
  BookUser,
  LucideIcon,
} from "lucide-react-native";

export interface WorkspaceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon; // used on the hub card
  comingSoonIcon: keyof typeof Ionicons.glyphMap; // used on the stub screen
  route: string;
  locked: boolean; // controls the "Soon" badge on the hub
  color: string; // tints the hub card's icon tile
}

export const WORKSPACE_ITEMS: WorkspaceItem[] = [
  {
    id: "resume-studio",
    color: CONTENT_COLORS.resume,
    title: "Resume Studio",
    description: "Build and export resumes from templates",
    icon: FileText,
    comingSoonIcon: "document-text-outline",
    route: "resume-studio",
    locked: false,
  },
  {
    id: "career-profile",
    color: CONTENT_COLORS.profile,
    title: "Career Profile",
    description: "Your history once — resumes prefill from it",
    icon: BookUser,
    comingSoonIcon: "person-outline",
    route: "career-profile",
    locked: false,
  },
  {
    id: "job-tracker",
    color: CONTENT_COLORS.application,
    title: "Job Tracker",
    description: "Track applications, interviews, and offers",
    icon: ClipboardList,
    comingSoonIcon: "briefcase-outline",
    route: "job-tracker",
    locked: false,
  },
  {
    id: "voice-notes",
    color: CONTENT_COLORS.recording,
    title: "Voice Notes",
    description: "Record and organize voice memos",
    icon: Mic,
    comingSoonIcon: "mic-outline",
    route: "voice-notes",
    locked: false,
  },
  {
    id: "smart-notes",
    color: CONTENT_COLORS.note,
    title: "Smart Notes",
    description: "Notes, folders, tags, and search",
    icon: StickyNote,
    comingSoonIcon: "document-outline",
    route: "smart-notes",
    locked: false,
  },
  {
    id: "ai-rewriter",
    color: "#A64B9B",
    title: "AI Rewriter",
    description: "Rewrite and polish your writing with AI",
    icon: Sparkles,
    comingSoonIcon: "sparkles-outline",
    route: "ai-rewriter",
    locked: true,
  },
  {
    id: "career-tools",
    color: "#2E6FD1",
    title: "Career Tools",
    description: "Career advice and LinkedIn optimization",
    icon: Briefcase,
    comingSoonIcon: "briefcase-outline",
    route: "career-tools",
    locked: true,
  },
];
