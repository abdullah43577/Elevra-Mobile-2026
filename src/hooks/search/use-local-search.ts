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

// shouldFetch: false reads the cache without firing six list requests.
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
