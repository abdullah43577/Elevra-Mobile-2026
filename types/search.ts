// Mirrors the server's SEARCH_RESULT_TYPES.
export type SearchResultType =
  | "Note"
  | "Recording"
  | "Resume"
  | "Application"
  | "CoverLetter"
  | "InterviewQuestion";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  snippet?: string;
  updatedAt: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  counts: Record<SearchResultType, number>;
  total: number;
}
