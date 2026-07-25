import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

export const useDeleteRecording = function ({
  recordingId,
}: {
  recordingId: string;
}) {
  const { mutate, isPending } = useSubmitData<void, APIResponse<null>>({
    url: API_ENDPOINTS.voiceNotes.delete(recordingId),
    method: "delete",
    onSuccessMessage: "Recording deleted successfully",
  });

  return {
    deleteRecording: mutate,
    isDeleting: isPending,
  };
};
