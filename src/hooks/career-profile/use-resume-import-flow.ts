import { useProfileImportStore } from "@/store/profile-import";
import { showToast } from "@/utils/show-toast";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useImportResumePdf } from "./use-import-resume-pdf";

// Mirrors MAX_PDF_BYTES on the server; checked here so an oversized file is
// refused before it is uploaded rather than after.
const MAX_PDF_BYTES = 5 * 1024 * 1024;

interface UseResumeImportFlowOptions {
  /** Asks before importing, since saving the import replaces what is there. */
  hasExistingProfile: boolean;
  onImported?: () => void;
}

/*
  Pick a PDF, read it on the server, and open the editor holding the result.
  Nothing is saved here: the import is handed over through the profile-import
  store, and only the editor's Save button persists it.
*/
export const useResumeImportFlow = function ({ hasExistingProfile, onImported }: UseResumeImportFlowOptions) {
  const router = useRouter();
  const setDraft = useProfileImportStore((state) => state.setDraft);
  const [isConfirmingReplace, setIsConfirmingReplace] = useState(false);

  const { importResumePdf, isImportingResumePdf } = useImportResumePdf({
    onSuccess: (response) => {
      setDraft(response.data);
      onImported?.();
      router.push({
        pathname: "/(dashboard)/(tabs)/workspaces/career-profile/profile-editor",
        params: { section: "personalInfo" },
      });
    },
  });

  const pickAndImport = async function () {
    let asset: DocumentPicker.DocumentPickerAsset | undefined;
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      asset = result.assets?.[0];
    } catch {
      showToast("error", "Couldn't open your files. Please try again.");
      return;
    }

    if (!asset) return;
    if (asset.size && asset.size > MAX_PDF_BYTES) {
      showToast("warning", "That PDF is over 5 MB. Export a smaller copy of your resume and try again.");
      return;
    }

    const form = new FormData();
    form.append("file", {
      uri: asset.uri,
      name: asset.name || "resume.pdf",
      type: "application/pdf",
    } as unknown as Blob);
    importResumePdf(form);
  };

  const handleStart = function () {
    if (hasExistingProfile) {
      setIsConfirmingReplace(true);
      return;
    }
    pickAndImport();
  };

  const handleConfirmReplace = function () {
    setIsConfirmingReplace(false);
    pickAndImport();
  };

  return {
    isImporting: isImportingResumePdf,
    isConfirmingReplace,
    handleStart,
    handleConfirmReplace,
    handleCancelReplace: () => setIsConfirmingReplace(false),
  };
};
