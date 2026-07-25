import { router } from "expo-router";
import { VoiceRecording } from "../../../types/voice-notes";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { showToast } from "@/utils/show-toast";

interface UseSaveRecordingOptions {
  recordingId?: string;
  onSuccess?: (data: VoiceRecording) => void;
  onError?: (error: any) => void;
}

export const useSaveRecording = function (options?: UseSaveRecordingOptions) {
  const { recordingId, onSuccess, onError } = options || {};

  const isUpdate = !!recordingId;

  const { mutate, isPending } = useSubmitData<
    FormData,
    APIResponse<VoiceRecording>
  >({
    url: isUpdate
      ? API_ENDPOINTS.voiceNotes.update(recordingId)
      : API_ENDPOINTS.voiceNotes.create,
    method: isUpdate ? "put" : "post",
    onSuccessMessage: isUpdate
      ? "Recording updated successfully"
      : "Recording saved successfully",
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data.data);
      router.replace("/(dashboard)/(tabs)/workspaces/voice-notes");
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });

  return {
    saveRecording: mutate,
    isSaving: isPending,
    isUpdate,
  };
};
