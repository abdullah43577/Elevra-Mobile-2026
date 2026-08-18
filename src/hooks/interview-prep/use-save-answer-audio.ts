import api from "@/provider/api";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { queryClient } from "@/utils/queryClient";
import { showToast } from "@/utils/show-toast";
import { useState } from "react";
import { InterviewAnswer } from "../../../types/interview-prep";
import { APIResponse } from "../../../types/response";

/*
  Multipart upload, so it does not go through useSubmitData — that builds a JSON
  body and sets no boundary. Same reason the profile picture upload posts a
  FormData directly.

  A rehearsal take is stored on the answer itself rather than as a VoiceRecording
  row: it is not a voice memo, and filing every take into the Voice Notes list
  would bury the user's actual recordings.
*/
export const useSaveAnswerAudio = function () {
  const [isUploading, setIsUploading] = useState(false);

  const invalidate = function () {
    queryClient.refetchQueries({
      queryKey: [API_ENDPOINTS.interviewPrep.questions],
    });
    queryClient.refetchQueries({
      queryKey: [API_ENDPOINTS.interviewPrep.stats],
    });
  };

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
