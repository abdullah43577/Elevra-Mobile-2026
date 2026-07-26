import { ResumeData } from "./data";
import { Template } from "./template";
import { LayoutKey, ThemeFor } from "./theme";

export interface Resume {
  id: string;
  title: string;
  templateId: string;
  template?: Template;
  userId: string;
  personalInfo?: ResumeData["personalInfo"];
  experience?: ResumeData["experience"];
  education?: ResumeData["education"];
  skills?: ResumeData["skills"];
  languages?: ResumeData["languages"];
  certifications?: ResumeData["certifications"];
  projects?: ResumeData["projects"];
  references?: ResumeData["references"];
  customThemeId?: string;
  customTheme?: ThemeFor<LayoutKey>;
  isPublished: boolean;
  lastExportedAt?: string;
  createdAt: string;
  updatedAt: string;
}
