import { ApplicationStatus, JobApplication } from "../../types/job-application";

export type ProgressStepId = "posting" | "resume" | "letter" | "applied" | "questions" | "rehearsed";

export interface ProgressStep {
  id: ProgressStepId;
  label: string;
  isDone: boolean;
}

export interface PrepProgress {
  pinned: number;
  rehearsed: number;
}

const ACTIVE_STATUSES: ApplicationStatus[] = ["SAVED", "APPLIED", "INTERVIEWING"];

export const isActiveApplication = function (status: ApplicationStatus) {
  return ACTIVE_STATUSES.includes(status);
};

/*
  Every step is read from the application itself, never from a stored flag —
  the SetupChecklist rule — so the list cannot disagree with what is attached.
  Sending a follow-up is deliberately not a step: drafts are never stored, so
  there is nothing to read it from.
*/
export const applicationSteps = function (
  application: JobApplication,
  prep: PrepProgress,
): ProgressStep[] {
  return [
    { id: "posting", label: "Add the job posting", isDone: !!application.jobDescription?.trim() },
    { id: "resume", label: "Attach a resume tailored to it", isDone: !!application.resumeId },
    { id: "letter", label: "Add a cover letter", isDone: !!application.coverLetterId },
    { id: "applied", label: "Send it and mark it applied", isDone: application.status !== "SAVED" },
    { id: "questions", label: "Pin the questions they'll ask", isDone: prep.pinned > 0 },
    { id: "rehearsed", label: "Rehearse them out loud", isDone: prep.rehearsed > 0 },
  ];
};

export const nextStep = function (application: JobApplication, prep: PrepProgress) {
  return applicationSteps(application, prep).find((step) => !step.isDone) ?? null;
};
