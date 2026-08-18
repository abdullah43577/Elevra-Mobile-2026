import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { Pressable, View } from "react-native";

interface Props {
  isFirst: boolean;
  isLast: boolean;
  isOptionalStep: boolean;
  isSaving: boolean;
  isEditing: boolean;
  accent: string;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  onSave: () => void;
}

export const BuilderFooter = function ({
  isFirst,
  isLast,
  isOptionalStep,
  isSaving,
  isEditing,
  accent,
  onPrevious,
  onNext,
  onSkip,
  onSave,
}: Props) {
  return (
    <View className="flex-row items-center gap-3 border-t-hairline border-line bg-surface px-5 py-4">
      {!isFirst && (
        <Pressable onPress={onPrevious} hitSlop={8} className="px-2 py-3 active:opacity-70">
          <AppText type="label" className="text-foreground-muted">
            Back
          </AppText>
        </Pressable>
      )}

      <View className="flex-1" />

      {isOptionalStep && !isLast && (
        <Pressable onPress={onSkip} hitSlop={8} className="px-2 py-3 active:opacity-70">
          <AppText type="label" className="text-foreground-muted">
            Skip
          </AppText>
        </Pressable>
      )}

      {isLast ? (
        <AppButton
          type="submit"
          label={isEditing ? "Save changes" : "Create resume"}
          onPress={onSave}
          isLoading={isSaving}
          className="px-7"
          style={{ backgroundColor: accent }}
        />
      ) : (
        <AppButton
          type="submit"
          label="Continue"
          onPress={onNext}
          className="px-9"
          style={{ backgroundColor: accent }}
        />
      )}
    </View>
  );
};
