import { CareerProfile } from "../../types/career-profile";
import {
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCE,
  ResumeBuilderFormValues,
} from "@/schemas/resume-builder/resume-builder";
import { ProfileSectionId } from "@/constants/career-profile";

const EMPTY_PERSONAL_INFO = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  title: "",
  summary: "",
};

interface AccountDefaults {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

export const toProfileFormValues = function (
  profile?: Omit<CareerProfile, "id" | "userId" | "createdAt" | "updatedAt">,
  account?: AccountDefaults,
): ResumeBuilderFormValues {
  return {
    personalInfo: {
      ...EMPTY_PERSONAL_INFO,
      firstName: profile?.personalInfo?.firstName || account?.firstName || "",
      lastName: profile?.personalInfo?.lastName || account?.lastName || "",
      email: profile?.personalInfo?.email || account?.email || "",
      phone: profile?.personalInfo?.phone || "",
      location: profile?.personalInfo?.location || "",
      title: profile?.personalInfo?.title || "",
      summary: profile?.personalInfo?.summary || "",
    },
    experience: profile?.experience ?? [],
    education: profile?.education ?? [],
    skills: profile?.skills ?? [],
    projects: profile?.projects ?? [],
    certifications: profile?.certifications ?? [],
    languages: profile?.languages ?? [],
    references: profile?.references ?? [],
  };
};

export const countProfileSection = function (
  profile: CareerProfile | undefined,
  sectionId: ProfileSectionId,
): number {
  if (!profile) return 0;

  if (sectionId === "personalInfo") {
    return Object.values(profile.personalInfo ?? {}).some((value) => !!value)
      ? 1
      : 0;
  }

  return profile[sectionId]?.length ?? 0;
};

// Required sections fall back to the builder's blank row; optional ones stay
// empty, since a blank row fails its item schema.
export const toResumeFormValues = function (
  profile: CareerProfile,
): ResumeBuilderFormValues {
  const values = toProfileFormValues(profile);

  return {
    ...values,
    experience: values.experience?.length ? values.experience : [DEFAULT_EXPERIENCE],
    education: values.education?.length ? values.education : [DEFAULT_EDUCATION],
  };
};
