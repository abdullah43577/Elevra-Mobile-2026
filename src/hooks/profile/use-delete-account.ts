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
    /*
      useSubmitData calls `api[method](url, body, config)`, but axios types
      `delete` as `(url, config)` — so for a delete the "body" argument lands in
      the config slot. `{ data: ... }` is exactly how axios carries a body on a
      DELETE, so wrapping it here produces `api.delete(url, { data: { password } })`
      and the password arrives intact.

      CLAUDE.md §9a says a delete needing per-call data should put it in the URL.
      That holds for ids and does NOT hold here: a password in a query string is
      written to every access log and proxy along the way.
    */
    getBody: (data) => ({ data }),
    onSuccessMessage: "Your account has been deleted",
    ...(options.onSuccess && { onSuccess: () => options.onSuccess!() }),
  });

  return { deleteAccount: mutate, isDeletingAccount: isPending };
};
