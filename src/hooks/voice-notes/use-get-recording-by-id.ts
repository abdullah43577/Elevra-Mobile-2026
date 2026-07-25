import { APIResponse } from "../../../types/response";
import { VoiceRecording } from "../../../types/voice-notes";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseGetRecordingByIdOptions {
  recordingId: string;
  shouldFetch?: boolean;
}

export const useGetRecordingById = function (
  options: UseGetRecordingByIdOptions,
) {
  const { recordingId, shouldFetch = true } = options;

  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<VoiceRecording>
  >({
    url: API_ENDPOINTS.voiceNotes.detail(recordingId),
    shouldFetch: shouldFetch && !!recordingId,
  });

  return {
    recording: data?.data,
    isFetchingRecording: isFetching,
    errorRecording: error,
    refetchRecording: refetch,
  };
};
