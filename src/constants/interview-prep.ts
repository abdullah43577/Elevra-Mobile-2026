import { Ionicons } from "@expo/vector-icons";
import {
  AnswerStatus,
  InterviewCategory,
} from "../../types/interview-prep";

export const INTERVIEW_CATEGORIES: InterviewCategory[] = [
  "BACKGROUND",
  "BEHAVIOURAL",
  "SITUATIONAL",
  "MOTIVATION",
  "STRENGTHS",
  "CLOSING",
];

export const CATEGORY_META: Record<
  InterviewCategory,
  { label: string; short: string; icon: keyof typeof Ionicons.glyphMap; blurb: string }
> = {
  BACKGROUND: {
    label: "Your background",
    short: "Background",
    icon: "person-outline",
    blurb: "Who you are and how you got here",
  },
  BEHAVIOURAL: {
    label: "Behavioural",
    short: "Behavioural",
    icon: "git-branch-outline",
    blurb: "Tell me about a time you…",
  },
  SITUATIONAL: {
    label: "Situational",
    short: "Situational",
    icon: "help-buoy-outline",
    blurb: "What would you do if…",
  },
  MOTIVATION: {
    label: "Motivation",
    short: "Motivation",
    icon: "compass-outline",
    blurb: "Why this role, why now",
  },
  STRENGTHS: {
    label: "Strengths and self-awareness",
    short: "Strengths",
    icon: "barbell-outline",
    blurb: "What you are good at, and what you are not",
  },
  CLOSING: {
    label: "Closing",
    short: "Closing",
    icon: "flag-outline",
    blurb: "The end of the interview, and what to ask them",
  },
};

/*
  DRAFT is the state an answer lands in when it is created — including the empty
  rows the practice runner creates for questions rehearsed out loud but never
  written down. It reads as "started", not "finished".
*/
export const STATUS_META: Record<
  AnswerStatus,
  { label: string; short: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  DRAFT: {
    label: "In progress",
    short: "Draft",
    color: "#7D7D8A",
    icon: "ellipse-outline",
  },
  NEEDS_WORK: {
    label: "Needs work",
    short: "Needs work",
    color: "#C4761C",
    icon: "alert-circle-outline",
  },
  READY: {
    label: "Ready",
    short: "Ready",
    color: "#0F9B7A",
    icon: "checkmark-circle",
  },
};

/** Options offered when starting a run. `null` means every matching question. */
export const PRACTICE_SIZES: { label: string; value: number | null }[] = [
  { label: "5 questions", value: 5 },
  { label: "10 questions", value: 10 },
  { label: "20 questions", value: 20 },
  { label: "Everything", value: null },
];

/*
  A strong spoken answer runs about ninety seconds to two minutes. The timer is
  not a limit — it is the single most useful piece of feedback in rehearsal,
  because rambling is the most common way a good answer goes wrong.
*/
export const ANSWER_TARGET_SECONDS = 120;
export const ANSWER_LONG_SECONDS = 180;
