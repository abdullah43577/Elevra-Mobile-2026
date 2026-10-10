import { useProAction } from "@/components/shared/pro-gate";
import { PRO_FEATURES } from "@/constants/entitlements";
import { showToast } from "@/utils/show-toast";
import { useRouter } from "expo-router";
import { useState } from "react";
import { CoverLetterDraft } from "../../../types/cover-letter";
import { useDraftCoverLetter } from "./use-draft-cover-letter";

interface DraftInputs {
  company: string;
  role: string;
  recipientName?: string;
  body: string;
}

interface UseCoverLetterDraftingOptions {
  applicationId?: string;
  getValues: () => DraftInputs;
  onDrafted: (body: string) => void;
}

const describeDraft = function (draft: CoverLetterDraft) {
  const from = draft.source.kind === "profile" ? "your career profile" : `“${draft.source.title}”`;

  if (draft.removedSentences > 0) {
    const count = draft.removedSentences === 1 ? "One sentence was" : `${draft.removedSentences} sentences were`;
    return { type: "warning" as const, message: `Draft written from ${from}. ${count} left out because your resume doesn’t support it.` };
  }

  return { type: "success" as const, message: `Draft written from ${from}. Read it through and make it yours.` };
};

export const useCoverLetterDrafting = function ({
  applicationId,
  getValues,
  onDrafted,
}: UseCoverLetterDraftingOptions) {
  const router = useRouter();
  const { allowed, copy } = useProAction(PRO_FEATURES.AI_COVER_LETTER);
  const [isConfirmingOverwrite, setIsConfirmingOverwrite] = useState(false);

  const { draftCoverLetter, isDrafting } = useDraftCoverLetter({
    ...(applicationId && { applicationId }),
    onSuccess: (response) => {
      onDrafted(response.data.body);
      const { type, message } = describeDraft(response.data);
      showToast(type, message);
    },
  });

  const runDraft = function () {
    const { company, role, recipientName } = getValues();
    draftCoverLetter({
      company: company.trim(),
      role: role.trim(),
      ...(recipientName?.trim() && { recipientName: recipientName.trim() }),
      ...(applicationId && { applicationId }),
    });
  };

  const handleDraft = function () {
    if (!allowed) {
      showToast("warning", copy.blurb);
      router.push("/(dashboard)/paywall");
      return;
    }

    const { company, role, body } = getValues();
    if (!company.trim() || !role.trim()) {
      showToast("warning", "Add the company and role first. The draft is written for them.");
      return;
    }

    // Never silently replace what someone has already written.
    if (body.trim()) {
      setIsConfirmingOverwrite(true);
      return;
    }

    runDraft();
  };

  const handleConfirmOverwrite = function () {
    setIsConfirmingOverwrite(false);
    runDraft();
  };

  return {
    isPro: allowed,
    isDrafting,
    isConfirmingOverwrite,
    handleDraft,
    handleConfirmOverwrite,
    handleCancelOverwrite: () => setIsConfirmingOverwrite(false),
  };
};
