import { useProAction } from "@/components/shared/pro-gate";
import { PRO_FEATURES } from "@/constants/entitlements";
import { useCandidateBackground } from "@/hooks/career-profile/use-candidate-background";
import { showToast } from "@/utils/show-toast";
import { useRouter } from "expo-router";
import { GenerateQuestionsResult } from "../../../types/interview-prep";
import { useGenerateQuestions } from "./use-generate-questions";

interface UseQuestionGenerationOptions {
  applicationId: string;
  hasJobDescription: boolean;
}

const describeResult = function ({ questions, pinnedExisting }: GenerateQuestionsResult) {
  const added = questions.length === 1 ? "1 question" : `${questions.length} questions`;
  const reused = pinnedExisting > 0 ? ` and pinned ${pinnedExisting} you already had` : "";
  return `Added ${added} for this role${reused}. Rehearse them below.`;
};

export const useQuestionGeneration = function ({ applicationId, hasJobDescription }: UseQuestionGenerationOptions) {
  const router = useRouter();
  const { allowed, copy } = useProAction(PRO_FEATURES.AI_INTERVIEW_QUESTIONS);
  const { requireBackground } = useCandidateBackground();

  const { generateQuestions, isGeneratingQuestions } = useGenerateQuestions({
    onSuccess: (result) => showToast("success", describeResult(result)),
  });

  const handleGenerate = function () {
    if (!requireBackground()) return;

    if (!allowed) {
      showToast("warning", copy.blurb);
      router.push("/(dashboard)/paywall");
      return;
    }

    if (!hasJobDescription) {
      showToast("warning", "Paste the job description into this application first. The questions are written from it.");
      return;
    }

    generateQuestions({ applicationId });
  };

  return { isPro: allowed, isGenerating: isGeneratingQuestions, handleGenerate };
};
