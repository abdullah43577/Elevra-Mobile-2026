import { APIResponse } from "../../../types/response";
import { AnyTemplate } from "../../../types/resume/template";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseGetTemplateByIdOptions {
  templateId: string;
  shouldFetch?: boolean;
}

export const useGetTemplateById = function ({
  templateId,
  shouldFetch,
}: UseGetTemplateByIdOptions) {
  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<AnyTemplate>
  >({
    url: API_ENDPOINTS.resume.templateDetail(templateId),
    // An empty id resolves to `/resume/templates/`, which Express matches to
    // the *list* route — so the query resolves with an array where a template
    // is expected, and every `template.x` read comes back undefined.
    shouldFetch: shouldFetch ?? !!templateId,
  });

  return {
    template: data?.data,
    isFetchingTemplate: isFetching,
    errorTemplate: error,
    refetchTemplate: refetch,
  };
};
