import { useThemeColors } from "@/hooks/use-theme-colors";
import { ProfileFormValues } from "@/schemas/settings/profile";
import { ChevronRight } from "lucide-react-native";
import { Control, FieldErrors } from "react-hook-form";
import { Pressable, View } from "react-native";
import { AppButton } from "../shared/app-button";
import { AppText } from "../shared/app-text";
import { FormInput } from "../shared/form-input";
import { FormSegmentedControl } from "../shared/form-segmented-control";

interface Props {
  control: Control<ProfileFormValues>;
  errors?: FieldErrors<ProfileFormValues>;
  selectedProfessionName: string | null;
  onOpenProfessionPicker: () => void;
  isUpdatingProfile: boolean;
  canSave: boolean;
  onSubmit: () => void;
}

export const AccountDetailsEdit = function ({
  control,
  errors,
  selectedProfessionName,
  onOpenProfessionPicker,
  isUpdatingProfile,
  canSave,
  onSubmit,
}: Props) {
  const { foregroundSubtle } = useThemeColors();

  return (
    <View className="gap-4">
      <FormInput
        label="First name"
        control={control}
        name="first_name"
        errors={errors}
      />
      <FormInput
        label="Last name"
        control={control}
        name="last_name"
        errors={errors}
      />

      <View>
        <AppText type="label" className="mb-1.5">
          Profession
        </AppText>
        <Pressable
          className="flex-row items-center justify-between rounded-2xl border-hairline border-line bg-canvas px-4 py-3.5 active:opacity-70"
          onPress={onOpenProfessionPicker}
        >
          <AppText
            type="default"
            className={selectedProfessionName ? "" : "text-foreground-subtle"}
          >
            {selectedProfessionName ?? "Select a profession"}
          </AppText>
          <ChevronRight size={16} color={foregroundSubtle} />
        </Pressable>
      </View>

      <FormSegmentedControl
        control={control}
        name="gender"
        label="Gender"
        errors={errors}
        disabled={isUpdatingProfile}
        options={[
          { label: "Male", value: "MALE" },
          { label: "Female", value: "FEMALE" },
          { label: "Other", value: "OTHER" },
        ]}
      />

      <AppButton
        type="submit"
        isLoading={isUpdatingProfile}
        disabled={!canSave}
        onPress={onSubmit}
        label="Save changes"
        className="mt-1"
      />
    </View>
  );
};
