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
  DEFAULT_SKILL,
  ResumeBuilderFormValues,
} from "@/schemas/resume-builder/resume-builder";

interface SkillsProps {
  control: Control<ResumeBuilderFormValues>;
  errors?: FieldErrors<ResumeBuilderFormValues>;
  fields: FieldArrayWithId<ResumeBuilderFormValues, "skills">[];
  append: UseFieldArrayAppend<ResumeBuilderFormValues, "skills">;
  remove: UseFieldArrayRemove;
}

export function Skills({
  control,
  errors,
  fields,
  append,
  remove,
}: SkillsProps) {
  return (
    <View className="mt-4">
      <AppText className="mb-2 text-sm text-gray-500">
        Add your professional skills
      </AppText>

      <View className="flex-row flex-wrap gap-2">
        {fields.map((field, index) => (
          <View
            key={field.id}
            className="flex-row items-center rounded-full bg-gray-100 px-3 py-1"
          >
            <FormInput<ResumeBuilderFormValues>
              control={control}
              label="Skills"
              name={`skills.${index}.name`}
              placeholder="Skill name"
              className="min-w-[80px] py-0 text-sm"
              errors={errors}
            />
            {fields.length > 1 && (
              <TouchableOpacity onPress={() => remove(index)} className="ml-1">
                <Ionicons name="close" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => append(DEFAULT_SKILL)}
        className="mt-3 flex-row items-center gap-2 py-2"
      >
        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
        <AppText className="text-blue-500">Add Skill</AppText>
      </TouchableOpacity>
    </View>
  );
}
