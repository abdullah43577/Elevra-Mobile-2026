import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

/*
  A whole run reports once, at the end. Per-question requests would mean a
  session that half records itself on a bad connection — and rehearsing is
  exactly when someone is on a train or in a car park.

  Silent: the user asked to practise, not to be told the practice was filed.
*/
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
