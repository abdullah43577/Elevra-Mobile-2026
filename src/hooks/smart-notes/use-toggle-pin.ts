import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { Note } from "../../../types/notes";
import { useSubmitData } from "../use-submit-data";

export const useTogglePin = function ({ noteId }: { noteId: string }) {
  const { mutate, isPending } = useSubmitData<null, APIResponse<Note>>({
    url: API_ENDPOINTS.notes.togglePin(noteId),
    method: "post",
    onSuccessMessage: "Pin toggled successfully",
  });

  return {
    togglePin: mutate,
    isTogglingPin: isPending,
  };
};
