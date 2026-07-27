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
  DEFAULT_LANGUAGE,
  ResumeBuilderFormValues,
} from "@/schemas/resume-builder/resume-builder";

interface LanguagesProps {
  control: Control<ResumeBuilderFormValues>;
  errors?: FieldErrors<ResumeBuilderFormValues>;
  fields: FieldArrayWithId<ResumeBuilderFormValues, "languages">[];
  append: UseFieldArrayAppend<ResumeBuilderFormValues, "languages">;
  remove: UseFieldArrayRemove;
}

export function Languages({
  control,
  errors,
  fields,
  append,
  remove,
}: LanguagesProps) {
  return (
    <View className="mt-4">
      {fields.map((field, index) => (
        <View
          key={field.id}
          className="mb-4 flex-row items-center gap-4 rounded-xl border border-gray-200 p-4"
        >
          <View className="flex-1">
            <FormInput<ResumeBuilderFormValues>
              control={control}
              name={`languages.${index}.name`}
              label="Language"
              placeholder="Spanish"
              errors={errors}
            />
          </View>
          <View className="flex-1">
            <FormInput<ResumeBuilderFormValues>
              control={control}
              name={`languages.${index}.proficiency`}
              label="Proficiency"
              placeholder="Native / Fluent / Conversational"
              errors={errors}
            />
          </View>
          {fields.length > 1 && (
            <TouchableOpacity
              onPress={() => remove(index)}
              className="self-end pb-1"
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity
        onPress={() => append(DEFAULT_LANGUAGE)}
        className="flex-row items-center gap-2 py-2"
      >
        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
        <AppText className="text-blue-500">Add Language</AppText>
      </TouchableOpacity>
    </View>
  );
}
