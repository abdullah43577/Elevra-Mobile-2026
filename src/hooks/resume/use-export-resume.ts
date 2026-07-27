import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

interface ExportResumeResponse {
  resumeId: string;
  exportedAt: string;
  message: string;
}

export const useExportResume = function ({ resumeId }: { resumeId: string }) {
  const { mutate, isPending } = useSubmitData<
    null,
    APIResponse<ExportResumeResponse>
  >({
    url: API_ENDPOINTS.resume.export(resumeId),
    method: "post",
    onSuccessMessage: "Resume exported successfully",
  });

  return {
    exportResume: mutate,
    isExporting: isPending,
  };
};
