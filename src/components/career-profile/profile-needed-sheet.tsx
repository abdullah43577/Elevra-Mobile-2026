import { Illustration } from "@/components/illustrations/illustration";
import { AppButton } from "@/components/shared/app-button";
import { AppModal } from "@/components/shared/app-modal";
import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Pressable, View } from "react-native";
import { ImportPdfCard } from "./import-pdf-card";

interface Props {
  isVisible: boolean;
  isImporting: boolean;
  onImport: () => void;
  onFillIn: () => void;
  onClose: () => void;
}

export const ProfileNeededSheet = function ({
  isVisible,
  isImporting,
  onImport,
  onFillIn,
  onClose,
}: Props) {
  const { contentColor } = useThemeColors();

  return (
    <AppModal
      isVisible={isVisible}
      onClose={onClose}
      variant="bottom-sheet"
      showHandle
    >
      <View className="self-start">
        <Illustration name="setupProfile" color={contentColor("profile")} size={112} />
      </View>

      <AppText type="title" className="mt-3">
        Add your work history first
      </AppText>
      <AppText type="subtitle" className="mt-1.5">
        Elevra writes from your own experience and never makes any of it up, so
        it needs at least one job to work from. You only do this once.
      </AppText>

      <View className="mt-5">
        <ImportPdfCard isImporting={isImporting} onPress={onImport} />
      </View>

      <AppButton type="secondary" label="Fill it in myself" onPress={onFillIn} className="mt-3" />

      <Pressable onPress={onClose} hitSlop={8} className="mt-4 items-center py-1 active:opacity-60">
        <AppText type="caption">Not now</AppText>
      </Pressable>
    </AppModal>
  );
};
