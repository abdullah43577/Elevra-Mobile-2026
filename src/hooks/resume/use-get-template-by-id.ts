import { APIResponse } from "../../../types/response";
import { AnyTemplate } from "../../../types/resume/template";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseGetTemplateByIdOptions {
  templateId: string;
}

export const useGetTemplateById = function ({
  templateId,
}: UseGetTemplateByIdOptions) {
  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<AnyTemplate>
  >({
    url: API_ENDPOINTS.resume.templateDetail(templateId),
  });

  return {
    template: data?.data,
    isFetchingTemplate: isFetching,
    errorTemplate: error,
    refetchTemplate: refetch,
  };
};
