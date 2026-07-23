import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { Tag } from "../../../types/notes";
import { useSubmitData } from "../use-submit-data";

export const useCreateTag = function () {
  const { mutate, isPending } = useSubmitData<
    { name: string },
    APIResponse<Tag>
  >({
    url: API_ENDPOINTS.notes.createTag,
    method: "post",
    onSuccessMessage: "Tag created successfully",
  });

  return {
    createTag: mutate,
    isCreating: isPending,
  };
};
