import { MIN_SEARCH_LENGTH } from "@/constants/search";
import { useGetCoverLetters } from "@/hooks/cover-letters/use-get-cover-letters";
import { useGetQuestions } from "@/hooks/interview-prep/use-get-questions";
import { useGetApplications } from "@/hooks/job-applications/use-get-applications";
import { useGetResumes } from "@/hooks/resume/use-get-resumes";
import { useGetNotes } from "@/hooks/smart-notes/use-get-notes";
import { useGetRecordings } from "@/hooks/voice-notes/use-get-recordings";
import { searchLocally } from "@/utils/search";
import { useMemo } from "react";

interface UseLocalSearchOptions {
  query: string;
}

/*
  Search over the cache, for when the device is offline.

  Every list hook is called with `shouldFetch: false` — deliberately, and this is
  the whole reason the flag was added. Opening search must not fire six list
  requests behind the one the user actually asked for; a disabled useQuery still
  returns whatever is cached, which is exactly what this needs. The urls carry no
  query params so they hit the same cache keys the workspace screens and Home
  already populate.
*/
export const useLocalSearch = function (options: UseLocalSearchOptions) {
  const term = options.query.trim();
  const isSearchable = term.length >= MIN_SEARCH_LENGTH;

  const { notes } = useGetNotes({ shouldFetch: false });
  const { recordings } = useGetRecordings({ shouldFetch: false });
  const { resumes } = useGetResumes({ shouldFetch: false });
  const { applications } = useGetApplications({ shouldFetch: false });
  const { coverLetters } = useGetCoverLetters({ shouldFetch: false });
  const { questions } = useGetQuestions({}, { shouldFetch: false });

  const localResults = useMemo(() => {
    if (!isSearchable) return undefined;

    return searchLocally({
      term,
      notes,
      recordings,
      resumes,
      applications,
      coverLetters,
      questions,
    });
  }, [
    isSearchable,
    term,
    notes,
    recordings,
    resumes,
    applications,
    coverLetters,
    questions,
  ]);

  return { localResults };
};
