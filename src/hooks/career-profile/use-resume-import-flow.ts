import { useProfileImportStore } from "@/store/profile-import";
import { showToast } from "@/utils/show-toast";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useImportResumePdf } from "./use-import-resume-pdf";

// Mirrors MAX_PDF_BYTES on the server.
const MAX_PDF_BYTES = 5 * 1024 * 1024;

interface UseResumeImportFlowOptions {
  hasExistingProfile: boolean;
  onImported?: () => void;
  overCurrentTab?: boolean;
}

export const useResumeImportFlow = function ({
  hasExistingProfile,
  onImported,
  overCurrentTab,
}: UseResumeImportFlowOptions) {
  const router = useRouter();
  const setDraft = useProfileImportStore((state) => state.setDraft);
  const [isConfirmingReplace, setIsConfirmingReplace] = useState(false);

  const { importResumePdf, isImportingResumePdf } = useImportResumePdf({
    onSuccess: (response) => {
      setDraft(response.data);
      onImported?.();
      router.push({
        pathname: overCurrentTab
          ? "/(dashboard)/profile-editor"
          : "/(dashboard)/(tabs)/workspaces/career-profile/profile-editor",
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
