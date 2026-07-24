import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

export const useDeleteNote = function ({ noteId }: { noteId: string }) {
  const { mutate, isPending } = useSubmitData<void, APIResponse<null>>({
    url: API_ENDPOINTS.notes.delete(noteId),
    method: "delete",
    onSuccessMessage: "Note deleted successfully",
  });

  return {
    deleteNote: mutate,
    isDeleting: isPending,
  };
};
