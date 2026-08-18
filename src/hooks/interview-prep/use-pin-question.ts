import api from "@/provider/api";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { queryClient } from "@/utils/queryClient";
import { showToast } from "@/utils/show-toast";
import { useState } from "react";

/*
  Pins a question to one application, for rehearsing before a specific
  interview. Written against api directly rather than useSubmitData because both
  ids live in the path and the delete carries no body — the same shape that
  makes useSubmitData's `api[method](url, body, config)` misfire on axios's
  two-argument delete.
*/
export const usePinQuestion = function (applicationId: string) {
  const [isPinning, setIsPinning] = useState(false);

  const refresh = function () {
    queryClient.refetchQueries({
      queryKey: [API_ENDPOINTS.interviewPrep.questions],
    });
  };

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
