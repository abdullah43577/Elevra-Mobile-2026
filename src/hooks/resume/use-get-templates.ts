import { APIResponse } from "../../../types/response";
import { AnyTemplate } from "../../../types/resume/template";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseGetTemplatesOptions {
  category?: string;
  isPremium?: boolean;
  search?: string;
}

export const useGetTemplates = function (options?: UseGetTemplatesOptions) {
  const { category, isPremium, search } = options || {};

  const queryParams = new URLSearchParams();
  if (category) queryParams.append("category", category);
  if (isPremium !== undefined)
    queryParams.append("isPremium", String(isPremium));
  if (search) queryParams.append("search", search);

  const url = queryParams.toString()
    ? `${API_ENDPOINTS.resume.templatesList}?${queryParams.toString()}`
    : API_ENDPOINTS.resume.templatesList;

  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<AnyTemplate[]>
  >({
    url,
  });

  return {
    templates: data?.data || [],
    isFetchingTemplates: isFetching,
    errorTemplates: error,
    refetchTemplates: refetch,
  };
};
