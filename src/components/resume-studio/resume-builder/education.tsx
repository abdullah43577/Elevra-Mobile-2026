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
  DEFAULT_EDUCATION,
  ResumeBuilderFormValues,
} from "@/schemas/resume-builder/resume-builder";

interface EducationProps {
  control: Control<ResumeBuilderFormValues>;
  errors?: FieldErrors<ResumeBuilderFormValues>;
  fields: FieldArrayWithId<ResumeBuilderFormValues, "education">[];
  append: UseFieldArrayAppend<ResumeBuilderFormValues, "education">;
  remove: UseFieldArrayRemove;
}

export function Education({
  control,
  errors,
  fields,
  append,
  remove,
}: EducationProps) {
  return (
    <View className="mt-4">
      {fields.map((field, index) => (
        <View
          key={field.id}
          className="mb-4 rounded-xl border border-gray-200 p-4"
        >
          <View className="mb-3 flex-row items-center justify-between">
            <AppText className="text-sm font-medium text-gray-700">
              Education {index + 1}
            </AppText>
            {fields.length > 1 && (
              <TouchableOpacity onPress={() => remove(index)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`education.${index}.school`}
            label="School"
            placeholder="Stanford University"
            errors={errors}
          />

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`education.${index}.degree`}
            label="Degree"
            placeholder="Bachelor of Science"
            errors={errors}
          />

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`education.${index}.field`}
            label="Field of Study"
            placeholder="Computer Science"
            errors={errors}
          />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <FormInput<ResumeBuilderFormValues>
                control={control}
                name={`education.${index}.startDate`}
                label="Start Date"
                placeholder="2016-09"
                errors={errors}
              />
            </View>
            <View className="flex-1">
              <FormInput<ResumeBuilderFormValues>
                control={control}
                name={`education.${index}.endDate`}
                label="End Date"
                placeholder="2020-06"
                errors={errors}
              />
            </View>
          </View>

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`education.${index}.gpa`}
            label="GPA (optional)"
            placeholder="3.8"
            errors={errors}
          />
        </View>
      ))}

      <TouchableOpacity
        onPress={() => append(DEFAULT_EDUCATION)}
        className="flex-row items-center gap-2 py-2"
      >
        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
        <AppText className="text-blue-500">Add Education</AppText>
      </TouchableOpacity>
    </View>
  );
}
