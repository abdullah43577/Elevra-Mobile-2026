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

/*
  Transcribes and critiques the current take. Pro-gated before the request, so
  a free user meets the paywall at the moment they reach for feedback rather
  than after a refused upload. Asking again for the same take is free on the
  server — it returns what is stored.
*/
export const useCoachAnswer = function (questionId: string) {
  const router = useRouter();
  const handleErrors = useHandleErrors();
  const { allowed, copy } = useProAction(PRO_FEATURES.AI_ANSWER_COACHING);

  const { mutate, isPending } = useSubmitData<void, APIResponse<InterviewAnswer>>({
    url: API_ENDPOINTS.interviewPrep.coachAnswer(questionId),
    method: "post",
    getBody: () => undefined,
    // The feedback appearing is the confirmation.
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
