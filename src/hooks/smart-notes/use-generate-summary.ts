import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

interface GenerateSummaryResponse {
  summary: string;
  noteId: string;
  generatedAt: string;
}

interface UseGenerateSummaryOptions {
  onSuccess?: (data: GenerateSummaryResponse) => void;
  onError?: (error: any) => void;
}

export const useGenerateSummary = function ({
  options,
  noteId,
}: {
  options?: UseGenerateSummaryOptions;
  noteId: string;
}) {
  const { onSuccess, onError } = options || {};

  const { mutate, isPending } = useSubmitData<
    null,
    APIResponse<GenerateSummaryResponse>
  >({
    url: API_ENDPOINTS.notes.generateSummary(noteId),
    method: "post",
    onSuccessMessage: "Summary generated successfully",
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data.data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });

  return {
    generateSummary: mutate,
    isGenerating: isPending,
  };
};
