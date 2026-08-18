import { ResumeData } from "./resume/data";
import { AnyTemplate } from "./resume/template";

/*
  A cover letter reuses the resume Template catalogue rather than owning one, so
  a letter and the resume sent with it read as a matched set. `personalInfo` is
  the sender block and holds the same shape as Resume.personalInfo, so it
  prefills from the career profile as a direct copy.

  `body` is one string with blank lines between paragraphs — see §19 for why it
  is not rich text.
*/
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
}

/*
  The optional recipient fields are nullable here and not on create, for the same
  reason UpdateApplicationRequest splits them out: JSON.stringify drops undefined
  keys, so an omitted key reads as "unchanged" and there is no way to say "I
  cleared this". A letter addressed to a named person could not be un-addressed.

  Create has nothing to clear, and the server's create schema rejects null.
*/
export interface UpdateCoverLetterRequest
  extends Partial<
    Omit<
      SaveCoverLetterRequest,
      "recipientName" | "recipientTitle" | "companyAddress" | "closing"
    >
  > {
  recipientName?: string | null;
  recipientTitle?: string | null;
  companyAddress?: string | null;
  closing?: string | null;
}
