import { APIResponse } from "../../../types/response";
import { ResumeData } from "../../../types/resume/data";
import { Resume } from "../../../types/resume/resume";
import { useSubmitData } from "../use-submit-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface SaveResumeData {
  title: string;
  templateId: string;
  personalInfo?: ResumeData["personalInfo"];
  experience?: ResumeData["experience"];
  education?: ResumeData["education"];
  skills?: ResumeData["skills"];
  languages?: ResumeData["languages"];
  certifications?: ResumeData["certifications"];
  projects?: ResumeData["projects"];
  references?: ResumeData["references"];
}

export const useSaveResume = function ({
  resumeId,
}: { resumeId?: string } = {}) {
  const isUpdate = !!resumeId;

  const { mutate, isPending } = useSubmitData<
    SaveResumeData,
    APIResponse<Resume>
  >({
    url: isUpdate
      ? API_ENDPOINTS.resume.update(resumeId)
      : API_ENDPOINTS.resume.create,
    method: isUpdate ? "put" : "post",
    onSuccessMessage: isUpdate
      ? "Resume updated successfully"
      : "Resume created successfully",
    redirectTo: "/(dashboard)/(tabs)/workspaces/resume-studio",
  });

  return {
    saveResume: mutate,
    isSaving: isPending,
    isUpdate,
  };
};
