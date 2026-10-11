import { useProAction } from "@/components/shared/pro-gate";
import { isAiErrorCode } from "@/constants/ai";
import { PRO_FEATURES } from "@/constants/entitlements";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { showToast } from "@/utils/show-toast";
import { useRouter } from "expo-router";
import { InterviewAnswer } from "../../../types/interview-prep";
import { APIResponse } from "../../../types/response";
import { useHandleErrors } from "../use-handle-errors";
import { useSubmitData } from "../use-submit-data";
import { refreshQuestionQueries } from "./refresh-question-queries";

export const useCoachAnswer = function (questionId: string) {
  const router = useRouter();
  const handleErrors = useHandleErrors();
  const { allowed, copy } = useProAction(PRO_FEATURES.AI_ANSWER_COACHING);

  const { mutate, isPending } = useSubmitData<void, APIResponse<InterviewAnswer>>({
    url: API_ENDPOINTS.interviewPrep.coachAnswer(questionId),
    method: "post",
    getBody: () => undefined,
    silent: true,
    onSuccess: () => {
      refreshQuestionQueries();
    },
    onError: (error) => {
      const body = error.response?.data;
      if (isAiErrorCode(body?.code)) return showToast("warning", body?.message ?? "Please try again in a moment.");
      handleErrors(error);
    },
  });

  const handleCoach = function () {
    if (!allowed) {
      showToast("warning", copy.blurb);
      router.push("/(dashboard)/paywall");
      return;
    }
    mutate();
  };

  return { isPro: allowed, isCoaching: isPending, handleCoach };
};
