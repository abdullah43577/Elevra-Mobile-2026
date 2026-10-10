import api from "@/provider/api";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { showToast } from "@/utils/show-toast";
import { useState } from "react";
import { refreshQuestionQueries } from "./refresh-question-queries";

/*
  Pins a question to one application, for rehearsing before a specific
  interview. Written against api directly rather than useSubmitData because both
  ids live in the path and the delete carries no body — the same shape that
  makes useSubmitData's `api[method](url, body, config)` misfire on axios's
  two-argument delete.
*/
export const usePinQuestion = function (applicationId: string) {
  const [isPinning, setIsPinning] = useState(false);

  const refresh = refreshQuestionQueries;

  const pinQuestion = async function (questionId: string) {
    setIsPinning(true);
    try {
      await api.post(
        API_ENDPOINTS.interviewPrep.pinToApplication(questionId, applicationId),
      );
      refresh();
    } catch {
      showToast("error", "Could not pin that question");
    } finally {
      setIsPinning(false);
    }
  };

  const unpinQuestion = async function (questionId: string) {
    setIsPinning(true);
    try {
      await api.delete(
        API_ENDPOINTS.interviewPrep.unpinFromApplication(questionId, applicationId),
      );
      refresh();
    } catch {
      showToast("error", "Could not unpin that question");
    } finally {
      setIsPinning(false);
    }
  };

  return { pinQuestion, unpinQuestion, isPinning };
};
