import { isAiErrorCode } from "@/constants/ai";
import { IMPORT_ERROR_CODES, isImportErrorCode } from "@/constants/import";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { JobApplicationFormValues } from "@/schemas/job-application/job-application";
import { showToast } from "@/utils/show-toast";
import { useRef } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { JobDraft, ParseJobRequest, ParseJobResult } from "../../../types/job-application";
import { APIResponse } from "../../../types/response";
import { useHandleErrors } from "../use-handle-errors";
import { useSubmitData } from "../use-submit-data";

interface UseJobPostingImportOptions {
  getValues: UseFormGetValues<JobApplicationFormValues>;
  setValue: UseFormSetValue<JobApplicationFormValues>;
}

const LINK = /^https?:\/\/\S+$/i;

type TextField = Exclude<keyof JobApplicationFormValues, "workArrangement" | "status" | "resumeId" | "coverLetterId">;

const asFormValues = function (draft: JobDraft): Partial<Record<TextField, string>> {
  return {
    ...(draft.company && { company: draft.company }),
    ...(draft.role && { role: draft.role }),
    ...(draft.location && { location: draft.location }),
    ...(draft.jobUrl && { jobUrl: draft.jobUrl }),
    ...(draft.source && { source: draft.source }),
    ...(draft.salaryMin && { salaryMin: String(draft.salaryMin) }),
    ...(draft.salaryMax && { salaryMax: String(draft.salaryMax) }),
    ...(draft.salaryCurrency && { salaryCurrency: draft.salaryCurrency }),
    ...(draft.jobDescription && { jobDescription: draft.jobDescription }),
  };
};

export const useJobPostingImport = function ({ getValues, setValue }: UseJobPostingImportOptions) {
  const handleErrors = useHandleErrors();
  const lastLink = useRef<string | null>(null);

  const fillEmpty = function (field: TextField, value: string) {
    if (!getValues(field)?.trim()) setValue(field, value, { shouldDirty: true, shouldValidate: true });
  };

  const { mutate, isPending } = useSubmitData<ParseJobRequest, APIResponse<ParseJobResult>>({
    url: API_ENDPOINTS.jobApplications.parse,
    method: "post",
    silent: true,
    onSuccess: ({ data }) => {
      const values = asFormValues(data.draft);
      (Object.keys(values) as TextField[]).forEach((field) => fillEmpty(field, values[field]!));
      if (data.draft.workArrangement && !getValues("workArrangement")) {
        setValue("workArrangement", data.draft.workArrangement, { shouldDirty: true });
      }
      showToast("success", "Filled from the posting. Check the details, then save.");
    },
    onError: (error) => {
      const body = error.response?.data;
      if (body?.code === IMPORT_ERROR_CODES.FETCH_BLOCKED && lastLink.current) fillEmpty("jobUrl", lastLink.current);
      if (isImportErrorCode(body?.code) || isAiErrorCode(body?.code)) {
        return showToast("warning", body?.message ?? "That posting couldn't be read.");
      }
      handleErrors(error);
    },
  });

  const importPosting = function (input: string) {
    const value = input.trim();
    if (!value) return;

    const isLink = LINK.test(value);
    lastLink.current = isLink ? value : null;
    mutate(isLink ? { url: value } : { text: value });
  };

  return { importPosting, isImportingPosting: isPending };
};
