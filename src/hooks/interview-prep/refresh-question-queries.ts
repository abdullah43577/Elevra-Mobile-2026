import { API_ENDPOINTS } from "@/provider/endpoints";
import { queryClient } from "@/utils/queryClient";

/*
  Refetches every interview-prep query — the bank, each filtered list, the
  pinned list for any application, and the stats.

  Query keys are the full url, query string included, and React Query matches
  key elements exactly — so a refetch keyed on "/interview-prep" never reached
  "/interview-prep?applicationId=…", and pinning a question on an application
  left that screen's pinned list stale until you navigated away. Match by
  prefix instead.
*/
export const refreshQuestionQueries = function () {
  return queryClient.refetchQueries({
    predicate: (query) => {
      const [url] = query.queryKey;
      return typeof url === "string" && url.startsWith(API_ENDPOINTS.interviewPrep.questions);
    },
  });
};
