import { ResumeData } from "./resume/data";

/*
  The user's master career history — one per account. It holds the exact same
  section shapes as Resume so the builder can prefill from it with no mapping
  layer, and so a section component written for one works for the other.

  A resume is a snapshot taken from this, never a live reference: editing the
  profile must not rewrite resumes that have already been sent.

  Sections are `null` rather than absent when the user has not filled them in —
  the server stores them as nullable Json columns.
*/
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

/*
  A profile read out of an uploaded resume PDF. Never saved by the server: it
  goes into the editor for the user to review, and only Save persists it.
*/
export interface ImportedProfile {
  profile: SaveCareerProfileRequest;
  report: {
    // Values dropped because they could not be found in the PDF.
    omittedValues: number;
    // Experience and education entries with no start date, which the editor
    // needs before it will save.
    entriesMissingDates: number;
  };
}
