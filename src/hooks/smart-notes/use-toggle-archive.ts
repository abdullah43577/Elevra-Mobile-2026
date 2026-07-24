import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { Note } from "../../../types/notes";
import { useSubmitData } from "../use-submit-data";

export const useToggleArchive = function ({ noteId }: { noteId: string }) {
  const { mutate, isPending } = useSubmitData<void, APIResponse<Note>>({
    url: API_ENDPOINTS.notes.toggleArchive(noteId),
    method: "post",
    onSuccessMessage: "Archive toggled successfully",
  });

  return {
    toggleArchive: mutate,
    isTogglingArchive: isPending,
  };
};
