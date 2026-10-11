import { useResumeImportFlow } from "@/hooks/career-profile/use-resume-import-flow";
import { useProfileNeededStore } from "@/store/profile-needed";
import { useRouter } from "expo-router";
import { ProfileNeededSheet } from "./profile-needed-sheet";

export const ProfileNeededHost = function () {
  const router = useRouter();
  const isOpen = useProfileNeededStore((state) => state.isOpen);
  const close = useProfileNeededStore((state) => state.close);

  const importFlow = useResumeImportFlow({
    hasExistingProfile: false,
    overCurrentTab: true,
    onImported: close,
  });

  const handleFillIn = function () {
    close();
    router.push({
      pathname: "/(dashboard)/profile-editor",
      params: { section: "experience" },
    });
  };

  return (
    <ProfileNeededSheet
      isVisible={isOpen}
      isImporting={importFlow.isImporting}
      onImport={importFlow.handleStart}
      onFillIn={handleFillIn}
      onClose={close}
    />
  );
};
