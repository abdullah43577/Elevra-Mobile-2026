import { useProAction } from "@/components/shared/pro-gate";
import { formatRelativeDate } from "@/constants/dashboard";
import { PRO_FEATURES } from "@/constants/entitlements";
import { useGetCareerProfile } from "@/hooks/career-profile/use-get-career-profile";
import { useGetResumes } from "@/hooks/resume/use-get-resumes";
import { showToast } from "@/utils/show-toast";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TailorResult } from "../../../types/job-application";
import { useGetApplicationMatch } from "./use-get-application-match";
import { useTailorResume } from "./use-tailor-resume";

const PROFILE_BASE = "career-profile";

interface UseResumeTailoringOptions {
  applicationId: string;
  hasJobDescription: boolean;
}

export const useResumeTailoring = function ({
  applicationId,
  hasJobDescription,
}: UseResumeTailoringOptions) {
  const router = useRouter();
  const { allowed, copy } = useProAction(PRO_FEATURES.AI_RESUME_TAILOR);

  const [isPickingBase, setIsPickingBase] = useState(false);
  const [result, setResult] = useState<TailorResult | null>(null);

  const { match } = useGetApplicationMatch({
    applicationId,
    shouldFetch: hasJobDescription,
  });
  const { resumes } = useGetResumes();
  const { hasCareerProfile } = useGetCareerProfile();

  const { tailorResume, isTailoring } = useTailorResume({
    applicationId,
    onSuccess: (response) => setResult(response.data),
  });

  const baseOptions = [
    ...(hasCareerProfile
      ? [{ label: "Career profile", value: PROFILE_BASE, description: "Your full work history" }]
      : []),
    ...resumes.map((resume) => ({
      label: resume.title,
      value: resume.id,
      description: `Updated ${formatRelativeDate(resume.updatedAt)}`,
    })),
  ];

  /*
    Gated before the picker opens, not after: a free user should meet the offer
    at the moment they reach for the feature, not after choosing a base for a
    request that was always going to be refused.
  */
  const handleStart = function () {
    if (!allowed) {
      showToast("warning", copy.blurb);
      router.push("/(dashboard)/paywall");
      return;
    }

    if (!baseOptions.length) {
      showToast("warning", "Build a resume or fill in your career profile first. Tailoring works from what you've written.");
      return;
    }

    setIsPickingBase(true);
  };

  const handleSelectBase = function (value: string) {
    setIsPickingBase(false);
    tailorResume(value === PROFILE_BASE ? {} : { baseResumeId: value });
  };

  const handleReview = function () {
    const resumeId = result?.resume.id;
    setResult(null);
    if (!resumeId) return;

    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/resume-studio/resume-builder",
      params: { resumeId },
    });
  };

  return {
    match,
    isPro: allowed,
    isTailoring,
    isPickingBase,
    baseOptions,
    result,
    handleStart,
    handleSelectBase,
    handleCloseBasePicker: () => setIsPickingBase(false),
    handleReview,
    handleDismissReport: () => setResult(null),
  };
};

export type ResumeTailoring = ReturnType<typeof useResumeTailoring>;
