import { Resume } from "./resume/resume";

export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEWING"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

export type WorkArrangement = "ONSITE" | "HYBRID" | "REMOTE";

export interface LinkedResume {
  id: string;
  title: string;
  templateId?: string;
  updatedAt?: string;
}

export interface LinkedNote {
  id: string;
  applicationId: string;
  noteId: string;
  createdAt: string;
  note: {
    id: string;
    title: string;
    updatedAt: string;
  };
}

export interface LinkedRecording {
  id: string;
  applicationId: string;
  recordingId: string;
  createdAt: string;
  recording: {
    id: string;
    title: string;
    duration: number;
    fileUrl: string;
    createdAt: string;
  };
}

export interface LinkedCoverLetter {
  id: string;
  title: string;
  company?: string;
  role?: string;
  updatedAt?: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  workArrangement?: WorkArrangement | null;
  jobUrl?: string | null;
  source?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  status: ApplicationStatus;
  appliedAt?: string | null;
  notes?: string | null;
  // The posting, pasted in. Ads get taken down or rewritten between applying
  // and interviewing, so keeping a copy is the only way to still have it later.
  jobDescription?: string | null;
  isArchived: boolean;
  userId: string;
  resumeId?: string | null;
  resume?: LinkedResume | null;
  coverLetterId?: string | null;
  coverLetter?: LinkedCoverLetter | null;
  linkedNotes?: LinkedNote[];
  linkedRecordings?: LinkedRecording[];
  _count?: {
    linkedNotes: number;
    linkedRecordings: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationStats {
  byStatus: Record<ApplicationStatus, number>;
  total: number;
  active: number;
}

export interface CreateApplicationRequest {
  company: string;
  role: string;
  location?: string;
  workArrangement?: WorkArrangement;
  jobUrl?: string;
  source?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  status?: ApplicationStatus;
  notes?: string;
  jobDescription?: string;
  resumeId?: string;
  coverLetterId?: string;
}

export interface UpdateApplicationRequest
  extends Partial<
    Omit<
      CreateApplicationRequest,
      | "resumeId"
      | "coverLetterId"
      | "notes"
      | "jobDescription"
      | "location"
      | "workArrangement"
      | "jobUrl"
      | "source"
      | "salaryMin"
      | "salaryMax"
      | "salaryCurrency"
    >
  > {
  /*
    Nullable, not just optional: JSON.stringify drops undefined keys, so
    detaching a resume, or clearing out notes you have emptied, has to send an
    explicit null for the server to act on it. Omitting the key means "leave it
    alone", which is indistinguishable from "I deleted this text".
  */
  resumeId?: string | null;
  coverLetterId?: string | null;
  notes?: string | null;
  jobDescription?: string | null;
  location?: string | null;
  workArrangement?: WorkArrangement | null;
  jobUrl?: string | null;
  source?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  isArchived?: boolean;
}

export interface JobKeyword {
  term: string;
  required: boolean;
}

// Computed on the server from extracted keywords, never generated — the same
// resume against the same posting always scores the same.
export interface KeywordCoverage {
  score: number;
  total: number;
  matched: string[];
  missing: JobKeyword[];
}

export interface ApplicationMatch {
  resumeId: string;
  coverage: KeywordCoverage;
}

export interface TailorReport {
  before: KeywordCoverage;
  after: KeywordCoverage;
  changes: string[];
  addedTerms: { term: string; evidence: string }[];
  // Sections the server reverted to the original because the rewrite added
  // something the resume does not say.
  keptOriginal: number;
}

export interface TailorResult {
  resume: Resume;
  report: TailorReport;
}

export interface TailorResumeRequest {
  // Omitted to tailor from the career profile.
  baseResumeId?: string;
}

// Fields read from a job posting, for the new-application form to review.
export interface JobDraft {
  company?: string;
  role?: string;
  location?: string;
  workArrangement?: WorkArrangement;
  jobUrl?: string;
  source?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  jobDescription?: string;
}

export type ParseJobRequest = { url: string } | { text: string };

export interface ParseJobResult {
  draft: JobDraft;
  // "structured" means the page carried schema.org job data and no AI was used.
  method: "structured" | "ai";
}
