import { useProAction } from "@/components/shared/pro-gate";
import { isAiErrorCode } from "@/constants/ai";
import { PRO_FEATURES } from "@/constants/entitlements";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { showToast } from "@/utils/show-toast";
import { useRouter } from "expo-router";
import { VoiceRecording } from "../../../types/voice-notes";
import { APIResponse } from "../../../types/response";
import { useHandleErrors } from "../use-handle-errors";
import { useSubmitData } from "../use-submit-data";

export const useTranscribeRecording = function (recordingId: string) {
  const router = useRouter();
  const handleErrors = useHandleErrors();
  const { allowed, copy } = useProAction(PRO_FEATURES.VOICE_TRANSCRIPTION);

  const { mutate, isPending } = useSubmitData<void, APIResponse<VoiceRecording>>({
    url: API_ENDPOINTS.voiceNotes.transcribe(recordingId),
    method: "post",
    getBody: () => undefined,
    silent: true,
    additionalQueryKeys: [[API_ENDPOINTS.voiceNotes.detail(recordingId)], [API_ENDPOINTS.voiceNotes.list]],
    onError: (error) => {
      const body = error.response?.data;
      if (isAiErrorCode(body?.code)) return showToast("warning", body?.message ?? "Please try again in a moment.");
      handleErrors(error);
    },
  });

  const handleTranscribe = function () {
    if (!allowed) {
      showToast("warning", copy.blurb);
      router.push("/(dashboard)/paywall");
      return;
    }
    mutate();
  };

  return { isPro: allowed, isTranscribing: isPending, handleTranscribe };
};
