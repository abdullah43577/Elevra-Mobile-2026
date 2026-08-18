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
  resumeId?: string;
  coverLetterId?: string;
}

export interface UpdateApplicationRequest
  extends Partial<
    Omit<CreateApplicationRequest, "resumeId" | "coverLetterId">
  > {
  // Nullable, not just optional: JSON.stringify drops undefined keys, so
  // detaching a resume or a cover letter has to send an explicit null for the
  // server to clear it.
  resumeId?: string | null;
  coverLetterId?: string | null;
  isArchived?: boolean;
}
