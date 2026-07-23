import { Ionicons } from "@expo/vector-icons";
import {
  FileText,
  Mic,
  Sparkles,
  StickyNote,
  Briefcase,
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
}

export const WORKSPACE_ITEMS: WorkspaceItem[] = [
  {
    id: "resume-studio",
    title: "Resume Studio",
    description: "Build and export resumes from templates",
    icon: FileText,
    comingSoonIcon: "document-text-outline",
    route: "/resume-studio",
    locked: true,
  },
  {
    id: "voice-notes",
    title: "Voice Notes",
    description: "Record and organize voice memos",
    icon: Mic,
    comingSoonIcon: "mic-outline",
    route: "/voice-notes",
    locked: true,
  },
  {
    id: "smart-notes",
    title: "Smart Notes",
    description: "Notes, folders, tags, and search",
    icon: StickyNote,
    comingSoonIcon: "document-outline",
    route: "/smart-notes",
    locked: false,
  },
  {
    id: "ai-rewriter",
    title: "AI Rewriter",
    description: "Rewrite and polish your writing with AI",
    icon: Sparkles,
    comingSoonIcon: "sparkles-outline",
    route: "/ai-rewriter",
    locked: true,
  },
  {
    id: "career-tools",
    title: "Career Tools",
    description: "Career advice and LinkedIn optimization",
    icon: Briefcase,
    comingSoonIcon: "briefcase-outline",
    route: "/career-tools",
    locked: true,
  },
];
