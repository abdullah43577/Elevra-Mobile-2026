import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import { FormTextArea } from "@/components/shared/form-text-area";
import { SectionHeader } from "@/components/shared/section-header";
import {
  APPLICATION_STATUS_META,
  WORK_ARRANGEMENTS,
  WORK_ARRANGEMENT_LABELS,
} from "@/constants/job-applications";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { JobApplicationFormValues } from "@/schemas/job-application/job-application";
import { Ionicons } from "@expo/vector-icons";
import { Control, FieldErrors } from "react-hook-form";
import { Pressable, View } from "react-native";
import {
  ApplicationStatus,
  WorkArrangement,
} from "../../../types/job-application";

interface Props {
  control: Control<JobApplicationFormValues>;
  errors: FieldErrors<JobApplicationFormValues>;
  status: ApplicationStatus;
  workArrangement?: WorkArrangement | null;
  resumeLabel: string | null;
  accentColor: string;
  onOpenStatusPicker: () => void;
  onOpenResumePicker: () => void;
  onSelectWorkArrangement: (value: WorkArrangement | null) => void;
}

const SelectRow = function ({
  label,
  value,
  placeholder,
  color,
  onPress,
}: {
  label: string;
  value: string | null;
  placeholder: string;
  color?: string;
  onPress: () => void;
}) {
  const { foregroundMuted } = useThemeColors();

  return (
    <View>
      <AppText type="label" className="mb-1.5">
        {label}
      </AppText>
      <Pressable
        onPress={onPress}
        className="h-[50px] flex-row items-center justify-between rounded-2xl border border-line bg-surface-muted px-4 active:opacity-70"
      >
        <AppText
          numberOfLines={1}
          className={value ? "flex-1 text-[14px]" : "flex-1 text-[14px] text-foreground-subtle"}
          style={value && color ? { color } : undefined}
        >
          {value ?? placeholder}
        </AppText>
        <Ionicons name="chevron-down" size={16} color={foregroundMuted} />
      </Pressable>
    </View>
  );
};

export const ApplicationFormFields = function ({
  control,
  errors,
  status,
  workArrangement,
  resumeLabel,
  accentColor,
  onOpenStatusPicker,
  onOpenResumePicker,
  onSelectWorkArrangement,
}: Props) {
  return (
    <View>
      <View className="gap-4">
        <FormInput<JobApplicationFormValues>
          control={control}
          name="company"
          label="Company"
          placeholder="Stripe"
          errors={errors}
        />

        <FormInput<JobApplicationFormValues>
          control={control}
          name="role"
          label="Role"
          placeholder="Senior React Native Engineer"
          errors={errors}
        />

        <SelectRow
          label="Status"
          value={APPLICATION_STATUS_META[status].label}
          placeholder="Select status"
          color={APPLICATION_STATUS_META[status].color}
          onPress={onOpenStatusPicker}
        />
      </View>

      <View className="mt-8">
        <SectionHeader title="Where" />
        <View className="gap-4">
          <FormInput<JobApplicationFormValues>
            control={control}
            name="location"
            label="Location"
            placeholder="Berlin, Germany"
            errors={errors}
          />

          <View>
            <AppText type="label" className="mb-1.5">
              Work arrangement
            </AppText>
            <View className="flex-row gap-2">
              {WORK_ARRANGEMENTS.map((option) => {
                const isSelected = workArrangement === option;

                return (
                  <Pressable
                    key={option}
                    onPress={() =>
                      onSelectWorkArrangement(isSelected ? null : option)
                    }
                    className="flex-1 items-center rounded-2xl border-hairline py-3 active:opacity-70"
                    style={
                      isSelected
                        ? {
                            backgroundColor: `${accentColor}1F`,
                            borderColor: accentColor,
                          }
                        : undefined
                    }
                  >
                    <AppText
                      type="caption"
                      className={isSelected ? "font-bricolage-semibold" : ""}
                      style={isSelected ? { color: accentColor } : undefined}
                    >
                      {WORK_ARRANGEMENT_LABELS[option]}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      <View className="mt-8">
        <SectionHeader title="Compensation" />
        <View className="gap-4">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormInput<JobApplicationFormValues>
                control={control}
                name="salaryMin"
                label="Minimum"
                placeholder="140000"
                keyboardType="number-pad"
                errors={errors}
              />
            </View>
            <View className="flex-1">
              <FormInput<JobApplicationFormValues>
                control={control}
                name="salaryMax"
                label="Maximum"
                placeholder="180000"
                keyboardType="number-pad"
                errors={errors}
              />
            </View>
          </View>

          <FormInput<JobApplicationFormValues>
            control={control}
            name="salaryCurrency"
            label="Currency"
            placeholder="USD"
            autoCapitalize="characters"
            maxLength={3}
            errors={errors}
          />
        </View>
      </View>

      <View className="mt-8">
        <SectionHeader title="Details" />
        <View className="gap-4">
          <FormInput<JobApplicationFormValues>
            control={control}
            name="jobUrl"
            label="Job posting URL"
            placeholder="https://..."
            autoCapitalize="none"
            errors={errors}
          />

          <FormInput<JobApplicationFormValues>
            control={control}
            name="source"
            label="Source"
            placeholder="LinkedIn, referral, careers page"
            errors={errors}
          />

          <SelectRow
            label="Resume sent"
            value={resumeLabel}
            placeholder="None selected"
            onPress={onOpenResumePicker}
          />

          <FormTextArea<JobApplicationFormValues>
            control={control}
            name="notes"
            label="Notes"
            placeholder="Referred by Ada. Team is 12 people, mostly remote."
            errors={errors}
          />
        </View>
      </View>
    </View>
  );
};
