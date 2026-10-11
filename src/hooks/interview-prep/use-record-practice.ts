import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

export const useRecordPractice = function () {
  const { mutateAsync, isPending } = useSubmitData<
    { questionIds: string[] },
    APIResponse<{ practised: number }>
  >({
    url: API_ENDPOINTS.interviewPrep.practice,
    method: "post",
    silent: true,
    additionalQueryKeys: [
      [API_ENDPOINTS.interviewPrep.questions],
      [API_ENDPOINTS.interviewPrep.stats],
    ],
  });

  return { recordPractice: mutateAsync, isRecordingPractice: isPending };
};
