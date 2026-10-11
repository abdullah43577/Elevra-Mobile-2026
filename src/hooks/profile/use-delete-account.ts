import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

interface UseDeleteAccountOptions {
  onSuccess?: () => void;
}

export const useDeleteAccount = function (
  options: UseDeleteAccountOptions = {},
) {
  const { mutate, isPending } = useSubmitData<
    { password?: string },
    APIResponse<null>
  >({
    url: API_ENDPOINTS.auth.deleteAccount,
    method: "delete",
    // axios delete is (url, config), so the body rides in { data }. Not in the URL: a password
    // in a query string is written to every access log on the way.
    getBody: (data) => ({ data }),
    onSuccessMessage: "Your account has been deleted",
    ...(options.onSuccess && { onSuccess: () => options.onSuccess!() }),
  });

  return { deleteAccount: mutate, isDeletingAccount: isPending };
};
