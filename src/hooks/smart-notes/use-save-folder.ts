import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";
import {
  CreateFolderRequest,
  Folder,
  UpdateFolderRequest,
} from "../../../types/notes";
import { router } from "expo-router";

interface UseSaveFolderProps {
  folderId?: string;
}

export const useSaveFolder = function ({ folderId }: UseSaveFolderProps = {}) {
  const isUpdate = !!folderId;

  const { mutate, isPending } = useSubmitData<
    CreateFolderRequest | UpdateFolderRequest,
    APIResponse<Folder>
  >({
    url: isUpdate
      ? API_ENDPOINTS.notes.updateFolder(folderId!)
      : API_ENDPOINTS.notes.createFolder,
    method: isUpdate ? "put" : "post",
    onSuccessMessage: isUpdate
      ? "Folder updated successfully"
      : "Folder created successfully",
    onSuccess: () => {
      router.replace("/(dashboard)/(tabs)/workspaces/smart-notes/folders");
    },
  });

  return {
    saveFolder: mutate,
    isSaving: isPending,
    isUpdate,
  };
};
