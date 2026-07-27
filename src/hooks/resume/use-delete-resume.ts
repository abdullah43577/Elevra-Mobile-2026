import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

export const useDeleteResume = function ({ resumeId }: { resumeId: string }) {
  const { mutate, isPending } = useSubmitData<void, APIResponse<null>>({
    url: API_ENDPOINTS.resume.delete(resumeId),
    method: "delete",
    onSuccessMessage: "Resume deleted successfully",
  });

  return {
    deleteResume: mutate,
    isDeleting: isPending,
  };
};
