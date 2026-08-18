/*
  Mirrors the server's SEARCH_RESULT_TYPES, which are themselves the keys of
  CONTENT_META — a result carries its own icon, colour and label with no
  translation table in between. `satisfies Record<SearchResultType, ...>` in
  src/constants/search.ts is what fails the build if the two ever drift.
*/
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
