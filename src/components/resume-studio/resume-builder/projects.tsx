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
  DEFAULT_PROJECT,
  ResumeBuilderFormValues,
} from "@/schemas/resume-builder/resume-builder";

interface ProjectsProps {
  control: Control<ResumeBuilderFormValues>;
  errors?: FieldErrors<ResumeBuilderFormValues>;
  fields: FieldArrayWithId<ResumeBuilderFormValues, "projects">[];
  append: UseFieldArrayAppend<ResumeBuilderFormValues, "projects">;
  remove: UseFieldArrayRemove;
}

export function Projects({
  control,
  errors,
  fields,
  append,
  remove,
}: ProjectsProps) {
  return (
    <View className="mt-4">
      {fields.map((field, index) => (
        <View
          key={field.id}
          className="mb-4 gap-4 rounded-xl border border-gray-200 p-4"
        >
          <View className="mb-3 flex-row items-center justify-between">
            <AppText type="subtitle" className="font-medium text-gray-700">
              Project {index + 1}
            </AppText>
            {fields.length > 1 && (
              <TouchableOpacity onPress={() => remove(index)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`projects.${index}.name`}
            label="Project Name"
            placeholder="E-Commerce Platform"
            errors={errors}
          />

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`projects.${index}.description`}
            label="Description"
            placeholder="Describe the project..."
            multiline
            numberOfLines={3}
            errors={errors}
          />

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`projects.${index}.url`}
            label="Project URL (optional)"
            placeholder="https://github.com/..."
            errors={errors}
          />
        </View>
      ))}

      <TouchableOpacity
        onPress={() => append(DEFAULT_PROJECT)}
        className="flex-row items-center gap-2 py-2"
      >
        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
        <AppText className="text-blue-500">Add Project</AppText>
      </TouchableOpacity>
    </View>
  );
}
