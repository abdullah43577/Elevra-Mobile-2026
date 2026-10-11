import { SearchResultType } from "../../types/search";

// Matches the server's floor.
export const MIN_SEARCH_LENGTH = 2;

export const SEARCH_LIMIT = 20;

export const RECENT_SEARCHES_KEY = "elevra.recent-searches";
export const MAX_RECENT_SEARCHES = 6;

export const SEARCH_FILTERS = [
  "Note",
  "Application",
  "Resume",
  "CoverLetter",
  "Recording",
  "InterviewQuestion",
] as const satisfies readonly SearchResultType[];
