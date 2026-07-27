import { View, TouchableOpacity } from "react-native";
import {
  Control,
  FieldErrors,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { FormInput } from "@/components/shared/form-input";
import { AppText } from "@/components/shared/app-text";
import {
  DEFAULT_EXPERIENCE,
  ResumeBuilderFormValues,
} from "@/schemas/resume-builder/resume-builder";

interface ExperienceProps {
  control: Control<ResumeBuilderFormValues>;
  errors?: FieldErrors<ResumeBuilderFormValues>;
  fields: FieldArrayWithId<ResumeBuilderFormValues, "experience">[];
  append: UseFieldArrayAppend<ResumeBuilderFormValues, "experience">;
  remove: UseFieldArrayRemove;
}

export function Experience({
  control,
  errors,
  fields,
  append,
  remove,
}: ExperienceProps) {
  return (
    <View className="mt-4 gap-4">
      {fields.map((field, index) => (
        <View
          key={field.id}
          className="mb-4 rounded-xl border border-gray-200 p-4"
        >
          <View className="mb-3 flex-row items-center justify-between">
            <AppText className="text-sm font-medium text-gray-700">
              Experience {index + 1}
            </AppText>
            {fields.length > 1 && (
              <TouchableOpacity onPress={() => remove(index)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`experience.${index}.position`}
            label="Position"
            placeholder="Software Engineer"
            errors={errors}
          />

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`experience.${index}.company`}
            label="Company"
            placeholder="Google"
            errors={errors}
          />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <FormInput<ResumeBuilderFormValues>
                control={control}
                name={`experience.${index}.startDate`}
                label="Start Date"
                placeholder="2020-01"
                errors={errors}
              />
            </View>
            <View className="flex-1">
              <FormInput<ResumeBuilderFormValues>
                control={control}
                name={`experience.${index}.endDate`}
                label="End Date"
                placeholder="2023-12 (or leave blank for present)"
                errors={errors}
              />
            </View>
          </View>

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`experience.${index}.description`}
            label="Description"
            placeholder="Describe your role and responsibilities..."
            multiline
            numberOfLines={3}
            errors={errors}
          />
        </View>
      ))}

      <TouchableOpacity
        onPress={() => append(DEFAULT_EXPERIENCE)}
        className="flex-row items-center gap-2 py-2"
      >
        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
        <AppText className="text-blue-500">Add Experience</AppText>
      </TouchableOpacity>
    </View>
  );
}
