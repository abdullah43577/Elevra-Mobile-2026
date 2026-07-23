import { router } from "expo-router";
import {
  CreateNoteRequest,
  Note,
  UpdateNoteRequest,
} from "../../../types/notes";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseSaveNoteOptions {
  noteId?: string;
}

export const useSaveNote = function (options?: UseSaveNoteOptions) {
  const { noteId } = options || {};

  const isUpdate = !!noteId;

  const { mutate, isPending } = useSubmitData<
    CreateNoteRequest | UpdateNoteRequest,
    APIResponse<Note>
  >({
    url: isUpdate
      ? API_ENDPOINTS.notes.update(noteId)
      : API_ENDPOINTS.notes.create,
    method: isUpdate ? "put" : "post",
    onSuccessMessage: isUpdate
      ? "Note updated successfully"
      : "Note created successfully",
    onSuccess: (data) => {
      router.replace("/(dashboard)/(tabs)/workspaces/smart-notes");
    },
  });

  return {
    saveNote: mutate,
    isSaving: isPending,
    isUpdate,
  };
};
