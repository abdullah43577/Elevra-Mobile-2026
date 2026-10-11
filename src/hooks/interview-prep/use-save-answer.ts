import { API_ENDPOINTS } from "@/provider/endpoints";
import {
  InterviewAnswer,
  SaveAnswerRequest,
} from "../../../types/interview-prep";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

interface Options {
  questionId: string;
  silent?: boolean;
  onSuccess?: () => void;
}

export const useSaveAnswer = function (options: Options) {
  const { mutateAsync, isPending } = useSubmitData<
    SaveAnswerRequest,
    APIResponse<InterviewAnswer>
  >({
    url: API_ENDPOINTS.interviewPrep.saveAnswer(options.questionId),
    method: "put",
    onSuccessMessage: "Answer saved",
    silent: options.silent ?? false,
    additionalQueryKeys: [
      [API_ENDPOINTS.interviewPrep.questions],
      [API_ENDPOINTS.interviewPrep.stats],
    ],
    ...(options.onSuccess && { onSuccess: options.onSuccess }),
  });

  return { saveAnswer: mutateAsync, isSavingAnswer: isPending };
};
