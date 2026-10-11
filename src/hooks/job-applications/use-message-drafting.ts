import { useProAction } from "@/components/shared/pro-gate";
import { isAiErrorCode } from "@/constants/ai";
import { PRO_FEATURES } from "@/constants/entitlements";
import { useCandidateBackground } from "@/hooks/career-profile/use-candidate-background";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { showToast } from "@/utils/show-toast";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ApplicationMessage, DraftMessageRequest, MessageKind } from "../../../types/job-application";
import { APIResponse } from "../../../types/response";
import { useHandleErrors } from "../use-handle-errors";
import { useSubmitData } from "../use-submit-data";

const WRITES_FROM_BACKGROUND: MessageKind[] = ["FOLLOW_UP", "THANK_YOU"];

export const useMessageDrafting = function (applicationId: string) {
  const router = useRouter();
  const handleErrors = useHandleErrors();
  const { allowed, copy } = useProAction(PRO_FEATURES.AI_MESSAGE_DRAFTS);
  const { requireBackground } = useCandidateBackground();

  const [kind, setKind] = useState<MessageKind | null>(null);
  const [message, setMessage] = useState<ApplicationMessage | null>(null);

  const { mutate, isPending } = useSubmitData<DraftMessageRequest, APIResponse<ApplicationMessage>>({
    url: API_ENDPOINTS.jobApplications.messages(applicationId),
    method: "post",
    silent: true,
    onSuccess: (response) => setMessage(response.data),
    onError: (error) => {
      const body = error.response?.data;
      if (isAiErrorCode(body?.code)) return showToast("warning", body?.message ?? "Please try again in a moment.");
      handleErrors(error);
    },
  });

  const handleOpen = function (next: MessageKind) {
    if (WRITES_FROM_BACKGROUND.includes(next) && !requireBackground()) return;

    if (!allowed) {
      showToast("warning", copy.blurb);
      router.push("/(dashboard)/paywall");
      return;
    }
    setMessage(null);
    setKind(next);
  };

  const handleWrite = function (details: { interviewerName?: string; points?: string }) {
    if (!kind) return;
    mutate({
      kind,
      ...(details.interviewerName?.trim() && { interviewerName: details.interviewerName.trim() }),
      ...(details.points?.trim() && { points: details.points.trim() }),
    });
  };

  return {
    isPro: allowed,
    kind,
    message,
    isWriting: isPending,
    handleOpen,
    handleWrite,
    handleStartOver: () => setMessage(null),
    handleClose: () => {
      setKind(null);
      setMessage(null);
    },
  };
};

export type MessageDrafting = ReturnType<typeof useMessageDrafting>;
