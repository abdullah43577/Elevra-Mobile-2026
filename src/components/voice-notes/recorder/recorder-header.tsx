import { AppText } from "@/components/shared/app-text";
import { ScreenHeader } from "@/components/shared/screen-header";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { ActivityIndicator, Pressable } from "react-native";

interface RecorderHeaderProps {
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasFile: boolean;
}

export function RecorderHeader({
  onBack,
  onSave,
  isSaving,
  hasFile,
}: RecorderHeaderProps) {
  return (
    <ScreenHeader
      title="New recording"
      onBack={onBack}
      backIcon="close"
      right={
        isSaving ? (
          <ActivityIndicator size="small" color={CONTENT_COLORS.recording} />
        ) : (
          <Pressable onPress={onSave} disabled={!hasFile} hitSlop={8}>
            <AppText
              type="link"
              className={hasFile ? "" : "text-foreground-subtle"}
              style={hasFile ? { color: CONTENT_COLORS.recording } : undefined}
            >
              Save
            </AppText>
          </Pressable>
        )
      }
    />
  );
}
