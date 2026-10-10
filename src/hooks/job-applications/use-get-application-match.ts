import { API_ENDPOINTS } from "@/provider/endpoints";
import { ApplicationMatch } from "../../../types/job-application";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";

interface UseGetApplicationMatchOptions {
  applicationId: string;
  shouldFetch?: boolean;
}

// Null until a tailoring has extracted keywords for the current posting and a
// resume is attached. Free to fetch: it is scoring, not a model call.
export const useGetApplicationMatch = function (
  options: UseGetApplicationMatchOptions,
) {
  const { data, isFetching } = useGetData<APIResponse<ApplicationMatch | null>>({
    url: API_ENDPOINTS.jobApplications.match(options.applicationId),
    shouldFetch: (options.shouldFetch ?? true) && !!options.applicationId,
  });

  return { match: data?.data ?? null, isFetchingMatch: isFetching };
};
