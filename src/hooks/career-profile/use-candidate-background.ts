import { useGetResumes } from "@/hooks/resume/use-get-resumes";
import { useProfileNeededStore } from "@/store/profile-needed";
import { useGetCareerProfile } from "./use-get-career-profile";

// Mirrors CandidateSourceService on the server: only an experience entry counts.
export const useCandidateBackground = function () {
  const { careerProfile, hasLoadedCareerProfile } = useGetCareerProfile();
  const { resumes } = useGetResumes();
  const openProfileNeeded = useProfileNeededStore((state) => state.open);

  const hasProfileExperience = !!careerProfile?.experience?.length;
  const hasBackground =
    hasProfileExperience || resumes.some((resume) => !!resume.experience?.length);

  // Run before the Pro check so a free user with no history is not sent to the paywall.
  // Lets the action through until the profile has loaded.
  const requireBackground = function () {
    if (!hasLoadedCareerProfile || hasBackground) return true;
    openProfileNeeded();
    return false;
  };

  return {
    hasBackground,
    hasProfileExperience,
    hasLoadedBackground: hasLoadedCareerProfile,
    requireBackground,
  };
};
