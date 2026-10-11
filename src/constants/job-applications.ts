import { Ionicons } from "@expo/vector-icons";
import { ApplicationStatus, WorkArrangement } from "../../types/job-application";

interface StatusMeta {
  label: string;
  short: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const APPLICATION_STATUS_META = {
  SAVED: {
    label: "Saved",
    short: "Saved",
    color: "#7D7D8A",
    icon: "bookmark-outline",
  },
  APPLIED: {
    label: "Applied",
    short: "Applied",
    color: "#2E6FD1",
    icon: "paper-plane-outline",
  },
  INTERVIEWING: {
    label: "Interviewing",
    short: "Interview",
    color: "#A64B9B",
    icon: "chatbubbles-outline",
  },
  OFFER: {
    label: "Offer",
    short: "Offer",
    color: "#0F9B7A",
    icon: "trophy-outline",
  },
  REJECTED: {
    label: "Rejected",
    short: "Rejected",
    color: "#B93A32",
    icon: "close-circle-outline",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    short: "Withdrawn",
    color: "#63636E",
    icon: "remove-circle-outline",
  },
} as const satisfies Record<ApplicationStatus, StatusMeta>;

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

export const PIPELINE_STATUSES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
];

export const WORK_ARRANGEMENT_LABELS = {
  ONSITE: "On-site",
  HYBRID: "Hybrid",
  REMOTE: "Remote",
} as const satisfies Record<WorkArrangement, string>;

export const WORK_ARRANGEMENTS: WorkArrangement[] = ["ONSITE", "HYBRID", "REMOTE"];
