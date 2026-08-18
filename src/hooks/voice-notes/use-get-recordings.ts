import { APIResponse } from "../../../types/response";
import { VoiceRecording } from "../../../types/voice-notes";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseGetRecordingsOptions {
  search?: string;
  isTranscribed?: boolean;
  shouldFetch?: boolean;
}

export const useGetRecordings = function (options?: UseGetRecordingsOptions) {
  const { search, isTranscribed, shouldFetch } = options || {};

  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (isTranscribed !== undefined)
    queryParams.append("isTranscribed", String(isTranscribed));

  const url = queryParams.toString()
    ? `${API_ENDPOINTS.voiceNotes.list}?${queryParams.toString()}`
    : API_ENDPOINTS.voiceNotes.list;

  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<VoiceRecording[]>
  >({
    url,
    ...(shouldFetch !== undefined && { shouldFetch }),
  });

  return {
    recordings: data?.data || [],
    isFetchingRecordings: isFetching,
    errorRecordings: error,
    refetchRecordings: refetch,
  };
};
