import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

export const useDeleteCoverLetter = function ({
  coverLetterId,
}: {
  coverLetterId: string;
}) {
  const { mutateAsync, isPending } = useSubmitData<void, APIResponse<null>>({
    url: API_ENDPOINTS.coverLetters.delete(coverLetterId),
    method: "delete",
    // axios delete is (url, config), so a body would be read as config; the id goes in the URL.
    getBody: () => undefined,
    onSuccessMessage: "Cover letter deleted",
    additionalQueryKeys: [[API_ENDPOINTS.coverLetters.list]],
  });

  return {
    deleteCoverLetter: mutateAsync,
    isDeletingCoverLetter: isPending,
  };
};
