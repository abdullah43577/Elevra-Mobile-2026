import { ResumeBuilderFormValues } from "@/schemas/resume-builder/resume-builder";
import { Ionicons } from "@expo/vector-icons";

export type ProfileSectionId = keyof ResumeBuilderFormValues;

export interface ProfileSection {
  id: ProfileSectionId;
  label: string;
  /** Chip label in the editor's section nav. */
  short: string;
  hint: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Plural noun for the row summary — "3 roles", "12 skills". */
  unit: string;
}

/*
  Same ids, same order as BUILDER_STEPS in the resume builder, because the
  career profile and a resume store the identical section shapes. Add a section
  to one and it has to be added to the other, or prefill quietly skips it.

  There is no `optional` flag here: on a profile every section is optional by
  definition — someone fills in their contact details today and their work
  history next week.
*/
export const PROFILE_SECTIONS: ProfileSection[] = [
  {
    id: "personalInfo",
    label: "Personal details",
    short: "About",
    hint: "Name, contact, and headline",
    icon: "person-outline",
    unit: "details",
  },
  {
    id: "experience",
    label: "Work experience",
    short: "Experience",
    hint: "Roles, dates, and what you did",
    icon: "briefcase-outline",
    unit: "roles",
  },
  {
    id: "education",
    label: "Education",
    short: "Education",
    hint: "Schools, degrees, and fields",
    icon: "school-outline",
    unit: "schools",
  },
  {
    id: "skills",
    label: "Skills",
    short: "Skills",
    hint: "What you are good at",
    icon: "bulb-outline",
    unit: "skills",
  },
  {
    id: "projects",
    label: "Projects",
    short: "Projects",
    hint: "Work worth showing off",
    icon: "folder-open-outline",
    unit: "projects",
  },
  {
    id: "certifications",
    label: "Certifications",
    short: "Certs",
    hint: "Credentials and licences",
    icon: "ribbon-outline",
    unit: "certifications",
  },
  {
    id: "languages",
    label: "Languages",
    short: "Languages",
    hint: "Languages you speak",
    icon: "chatbubbles-outline",
    unit: "languages",
  },
  {
    id: "references",
    label: "References",
    short: "References",
    hint: "People who can vouch for you",
    icon: "people-outline",
    unit: "references",
  },
];
