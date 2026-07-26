import { APIResponse } from "../../../types/response";
import { Template } from "../../../types/resume/template";
import { useSubmitData } from "../use-submit-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

type UploadThumbnailPayload = {
  templateId: string;
  formData: FormData;
};

export const useUploadTemplateThumbnail = function () {
  const { mutateAsync, isPending } = useSubmitData<
    UploadThumbnailPayload,
    APIResponse<Template>
  >({
    url: ({ templateId }) => API_ENDPOINTS.resume.uploadThumbnail(templateId),
    getBody: ({ formData }) => formData,
    method: "post",
    onSuccessMessage: "Thumbnail uploaded successfully",
  });

  return {
    uploadThumbnailAsync: mutateAsync,
    isUploading: isPending,
  };
};
