import { Ionicons } from "@expo/vector-icons";
import { ResumeBuilderFormValues } from "@/schemas/resume-builder/resume-builder";

export interface BuilderStep {
  id: keyof ResumeBuilderFormValues;
  label: string;
  short: string;
  icon: keyof typeof Ionicons.glyphMap;
  optional: boolean;
}

/*
  Optional steps are genuinely optional: they start with no entries at all.

  The builder used to seed one blank item into every array, which meant a user
  who filled in only their experience still failed validation on References,
  Projects, Certifications and Languages — each item schema requires its fields,
  so a blank row is an invalid row. Worse, those errors landed on steps the user
  had never opened, so the save button just silently did nothing.
*/
export const BUILDER_STEPS: BuilderStep[] = [
  { id: "personalInfo", label: "Personal details", short: "About", icon: "person-outline", optional: false },
  { id: "experience", label: "Work experience", short: "Experience", icon: "briefcase-outline", optional: false },
  { id: "education", label: "Education", short: "Education", icon: "school-outline", optional: false },
  { id: "skills", label: "Skills", short: "Skills", icon: "bulb-outline", optional: false },
  { id: "projects", label: "Projects", short: "Projects", icon: "folder-open-outline", optional: true },
  { id: "certifications", label: "Certifications", short: "Certs", icon: "ribbon-outline", optional: true },
  { id: "languages", label: "Languages", short: "Languages", icon: "chatbubbles-outline", optional: true },
  { id: "references", label: "References", short: "References", icon: "people-outline", optional: true },
];
