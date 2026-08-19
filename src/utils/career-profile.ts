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

/*
  A CareerProfile and the resume builder's form values hold the same shapes, so
  this is a null-flattening pass rather than a mapping layer: the server stores
  unfilled sections as null and react-hook-form needs arrays and strings.

  `account` seeds the name and email of a profile that has never been saved —
  the user already gave us those at sign-up, so asking again is busywork.
*/
export const toProfileFormValues = function (
  profile?: CareerProfile,
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

/** How many entries a section holds. Personal details count as 0 or 1. */
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

/*
  The same copy, adjusted for the resume builder rather than the profile editor.

  A profile may legitimately have no experience yet; a resume form cannot show
  an empty required section, so those three fall back to the builder's blank
  row. The optional sections stay empty — seeding a blank row into them is what
  used to make saving impossible, since a blank row fails its item schema.
*/
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
