import api from "@/provider/api";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { showToast } from "@/utils/show-toast";
import { useState } from "react";
import { InterviewAnswer } from "../../../types/interview-prep";
import { APIResponse } from "../../../types/response";
import { refreshQuestionQueries } from "./refresh-question-queries";

/*
  Posts the FormData through api directly to manage its own loading and error
  states. (useSubmitData passes a FormData through untouched as well — voice
  notes and the resume PDF import upload that way — so either works.)

  A rehearsal take is stored on the answer itself rather than as a VoiceRecording
  row: it is not a voice memo, and filing every take into the Voice Notes list
  would bury the user's actual recordings.
*/
export const useSaveAnswerAudio = function () {
  const [isUploading, setIsUploading] = useState(false);

  // Covers the question's own detail and every filtered list, not just the bank.
  const invalidate = refreshQuestionQueries;

  const saveAnswerAudio = async function ({
    questionId,
    uri,
    duration,
  }: {
    questionId: string;
    uri: string;
    duration: number;
  }): Promise<InterviewAnswer | undefined> {
    setIsUploading(true);

    try {
      const form = new FormData();
      form.append("audio", {
        uri,
        name: `answer-${questionId}.m4a`,
        type: "audio/m4a",
      } as any);
      form.append("duration", String(Math.round(duration)));

      const response = await api.post<APIResponse<InterviewAnswer>>(
        API_ENDPOINTS.interviewPrep.uploadAnswerAudio(questionId),
        form,
      );

      invalidate();
      return response.data.data;
    } catch {
      showToast("error", "Could not save that recording");
      return undefined;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteAnswerAudio = async function (questionId: string) {
    try {
      await api.delete(API_ENDPOINTS.interviewPrep.deleteAnswerAudio(questionId));
      invalidate();
      showToast("success", "Recording removed");
    } catch {
      showToast("error", "Could not remove that recording");
    }
  };

  return { saveAnswerAudio, deleteAnswerAudio, isUploading };
};
