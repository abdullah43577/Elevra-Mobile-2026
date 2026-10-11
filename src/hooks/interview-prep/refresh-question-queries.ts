import { API_ENDPOINTS } from "@/provider/endpoints";
import { queryClient } from "@/utils/queryClient";

// Keys are full urls and React Query matches elements exactly, so match by prefix
// to reach filtered variants such as ?applicationId=...
export const refreshQuestionQueries = function () {
  return queryClient.refetchQueries({
    predicate: (query) => {
      const [url] = query.queryKey;
      return typeof url === "string" && url.startsWith(API_ENDPOINTS.interviewPrep.questions);
    },
  });
};
