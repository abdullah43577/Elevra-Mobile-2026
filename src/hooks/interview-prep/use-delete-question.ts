import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

export const useDeleteQuestion = function ({
  questionId,
}: {
  questionId: string;
}) {
  const { mutateAsync, isPending } = useSubmitData<void, APIResponse<null>>({
    url: API_ENDPOINTS.interviewPrep.delete(questionId),
    method: "delete",
    // axios's delete signature is (url, config), so a body would be read as the
    // request config. Send nothing and keep the id in the URL.
    getBody: () => undefined,
    onSuccessMessage: "Question deleted",
    additionalQueryKeys: [
      [API_ENDPOINTS.interviewPrep.questions],
      [API_ENDPOINTS.interviewPrep.stats],
    ],
  });

  return { deleteQuestion: mutateAsync, isDeletingQuestion: isPending };
};
