import { ResumeData } from "./resume/data";

export interface CareerProfile {
  id: string;
  userId: string;
  personalInfo?: ResumeData["personalInfo"] | null;
  experience?: ResumeData["experience"] | null;
  education?: ResumeData["education"] | null;
  skills?: ResumeData["skills"] | null;
  languages?: ResumeData["languages"] | null;
  certifications?: ResumeData["certifications"] | null;
  projects?: ResumeData["projects"] | null;
  references?: ResumeData["references"] | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveCareerProfileRequest {
  personalInfo?: ResumeData["personalInfo"];
  experience?: ResumeData["experience"];
  education?: ResumeData["education"];
  skills?: ResumeData["skills"];
  languages?: ResumeData["languages"];
  certifications?: ResumeData["certifications"];
  projects?: ResumeData["projects"];
  references?: ResumeData["references"];
}

export interface ImportedProfile {
  profile: SaveCareerProfileRequest;
  report: {
    omittedValues: number;
    entriesMissingDates: number;
  };
}
