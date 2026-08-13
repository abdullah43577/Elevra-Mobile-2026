import { ProfileFormValues } from "@/schemas/settings/profile";
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
        <AppText
          type="default"
          className="font-bricolage-medium mb-1.5 text-sm text-neutral-700"
        >
          Profession
        </AppText>
        <Pressable
          className="flex-row items-center justify-between rounded-xl border border-neutral-200 px-4 py-3.5"
          //   onPress={() => setProfessionPickerVisible(true)}
          onPress={onOpenProfessionPicker}
        >
          <AppText
            type="default"
            className={selectedProfessionName ? "" : "text-neutral-400"}
          >
            {selectedProfessionName ?? "Select a profession"}
          </AppText>
          <AppText type="default" className="text-neutral-400">
            ›
          </AppText>
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
        // onPress={handleSubmit(onSubmit)}
        onPress={onSubmit}
        className="mt-1"
      >
        <AppText type="default" className="font-bricolage-semibold text-white">
          {isUpdatingProfile ? "Saving…" : "Save changes"}
        </AppText>
      </AppButton>
    </View>
  );
};
