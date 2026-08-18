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
    // axios's delete signature is (url, config), so useSubmitData's body
    // argument would be read as the request config. Send nothing and keep the
    // id in the URL — same trap the application unlink hooks hit.
    getBody: () => undefined,
    onSuccessMessage: "Cover letter deleted",
    additionalQueryKeys: [[API_ENDPOINTS.coverLetters.list]],
  });

  return {
    deleteCoverLetter: mutateAsync,
    isDeletingCoverLetter: isPending,
  };
};
