import { SearchResultType } from "../../types/search";

// Two characters is also the server's floor. Below it `contains` matches most
// of the library and the result list is noise.
export const MIN_SEARCH_LENGTH = 2;

/*
   Each content type is capped so no one of them can crowd out the rest. The
   filter chips narrow this set client-side rather than re-querying: they have to
   show a count for every type to be usable, and asking the server for a single
   type would zero out the other five the moment a chip was tapped.

   The trade is that filtering to Notes can only ever show these 20. Past that
   the answer is a better query, not a longer list.
*/
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
