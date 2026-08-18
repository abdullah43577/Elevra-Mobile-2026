import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { Pressable, View } from "react-native";

interface Props {
  isFirst: boolean;
  isLast: boolean;
  isSaving: boolean;
  accent: string;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
}

/*
  Save sits on every section rather than only the last one. Unlike the resume
  builder, this editor is usually entered from the overview to change one
  section — making someone page to the end to commit that would be absurd.
*/
export const ProfileEditorFooter = function ({
  isFirst,
  isLast,
  isSaving,
  accent,
  onPrevious,
  onNext,
  onSave,
}: Props) {
  return (
    <View className="flex-row items-center gap-3 border-t-hairline border-line bg-surface px-5 py-4">
      {!isFirst && (
        <Pressable
          onPress={onPrevious}
          hitSlop={8}
          className="px-2 py-3 active:opacity-70"
        >
          <AppText type="label" className="text-foreground-muted">
            Back
          </AppText>
        </Pressable>
      )}

      <View className="flex-1" />

      {!isLast && (
        <Pressable
          onPress={onNext}
          hitSlop={8}
          className="px-2 py-3 active:opacity-70"
        >
          <AppText type="label" className="text-foreground-muted">
            Next
          </AppText>
        </Pressable>
      )}

      <AppButton
        type="submit"
        label="Save profile"
        onPress={onSave}
        isLoading={isSaving}
        className="px-6"
        style={{ backgroundColor: accent }}
      />
    </View>
  );
};
