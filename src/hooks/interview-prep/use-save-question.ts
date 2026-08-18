import { API_ENDPOINTS } from "@/provider/endpoints";
import {
  InterviewQuestion,
  SaveQuestionRequest,
} from "../../../types/interview-prep";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

interface Options {
  questionId?: string;
  onSuccess?: () => void;
}

export const useSaveQuestion = function (options: Options = {}) {
  const isUpdate = !!options.questionId;

  const { mutateAsync, isPending } = useSubmitData<
    SaveQuestionRequest,
    APIResponse<InterviewQuestion>
  >({
    url: isUpdate
      ? API_ENDPOINTS.interviewPrep.update(options.questionId!)
      : API_ENDPOINTS.interviewPrep.create,
    method: isUpdate ? "put" : "post",
    onSuccessMessage: isUpdate ? "Question updated" : "Question added",
    additionalQueryKeys: [
      [API_ENDPOINTS.interviewPrep.questions],
      [API_ENDPOINTS.interviewPrep.stats],
    ],
    ...(options.onSuccess && { onSuccess: options.onSuccess }),
  });

  return { saveQuestion: mutateAsync, isSavingQuestion: isPending };
};
