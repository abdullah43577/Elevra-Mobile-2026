import { isAiErrorCode } from "@/constants/ai";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { showToast } from "@/utils/show-toast";
import { GenerateQuestionsResult } from "../../../types/interview-prep";
import { APIResponse } from "../../../types/response";
import { useHandleErrors } from "../use-handle-errors";
import { useSubmitData } from "../use-submit-data";
import { refreshQuestionQueries } from "./refresh-question-queries";

interface UseGenerateQuestionsOptions {
  onSuccess?: (data: GenerateQuestionsResult) => void;
}

export const useGenerateQuestions = function (options: UseGenerateQuestionsOptions = {}) {
  const handleErrors = useHandleErrors();

  const { mutate, isPending } = useSubmitData<{ applicationId: string }, APIResponse<GenerateQuestionsResult>>({
    url: API_ENDPOINTS.interviewPrep.generate,
    method: "post",
    silent: true,
    onSuccess: (response) => {
      refreshQuestionQueries();
      options.onSuccess?.(response.data);
    },
    onError: (error) => {
      const body = error.response?.data;
      if (isAiErrorCode(body?.code)) return showToast("warning", body?.message ?? "Please try again in a moment.");
      handleErrors(error);
    },
  });

  return { generateQuestions: mutate, isGeneratingQuestions: isPending };
};
