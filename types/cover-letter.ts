import { ResumeData } from "./resume/data";
import { AnyTemplate } from "./resume/template";

export interface CoverLetter {
  id: string;
  title: string;
  userId: string;
  templateId: string;
  template?: AnyTemplate;
  personalInfo?: ResumeData["personalInfo"] | null;
  company: string;
  role: string;
  recipientName?: string | null;
  recipientTitle?: string | null;
  companyAddress?: string | null;
  body: string;
  closing?: string | null;
  letterDate: string;
  lastExportedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveCoverLetterRequest {
  title?: string;
  templateId: string;
  personalInfo?: ResumeData["personalInfo"];
  company: string;
  role: string;
  recipientName?: string;
  recipientTitle?: string;
  companyAddress?: string;
  body: string;
  closing?: string;
  // Create only: the server attaches the new letter to this application.
  applicationId?: string;
}

// Nullable on update only: JSON.stringify drops undefined keys, so clearing must
// send null, and the server's create schema rejects null.
export interface UpdateCoverLetterRequest
  extends Partial<
    Omit<
      SaveCoverLetterRequest,
      "recipientName" | "recipientTitle" | "companyAddress" | "closing" | "applicationId"
    >
  > {
  recipientName?: string | null;
  recipientTitle?: string | null;
  companyAddress?: string | null;
  closing?: string | null;
}

export interface DraftCoverLetterRequest {
  company: string;
  role: string;
  recipientName?: string;
  applicationId?: string;
}

export interface CoverLetterDraft {
  body: string;
  removedSentences: number;
  addedTerms: { term: string; evidence: string }[];
  source: { kind: "resume" | "profile"; title: string };
}
