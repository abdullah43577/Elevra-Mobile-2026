import { AppText } from "@/components/shared/app-text";
import { BottomSheetPicker } from "@/components/shared/bottom-sheet-picker";
import { FormInput } from "@/components/shared/form-input";
import {
  DEFAULT_LANGUAGE,
  ResumeBuilderFormValues,
} from "@/schemas/resume-builder/resume-builder";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

interface LanguagesProps {
  control: Control<ResumeBuilderFormValues>;
  errors?: FieldErrors<ResumeBuilderFormValues>;
  fields: FieldArrayWithId<ResumeBuilderFormValues, "languages">[];
  append: UseFieldArrayAppend<ResumeBuilderFormValues, "languages">;
  remove: UseFieldArrayRemove;
  setValue: UseFormSetValue<ResumeBuilderFormValues>;
}

const PROFICIENCIES = [
  { label: "Basic", value: "basic" },
  { label: "Conversational", value: "conversational" },
  { label: "Professional", value: "professional" },
  { label: "Native", value: "native" },
];

export function Languages({
  control,
  errors,
  fields,
  append,
  remove,
  setValue,
}: LanguagesProps) {
  const [proficiencyPickerIndex, setProficiencyPickerIndex] = useState<
    number | null
  >(null);

  const getProficiencyLabel = (value: string) => {
    const found = PROFICIENCIES.find((p) => p.value === value);
    return found?.label || "Select proficiency";
  };

  const watchedLanguages = useWatch({ control, name: "languages" });

  return (
    <View className="mt-4">
      {fields.map((field, index) => {
        const proficiency = watchedLanguages?.[index]?.proficiency;

        return (
          <View
            key={field.id}
            className="mb-6 gap-4 rounded-xl border border-line p-5"
          >
            <View className="mb-4 flex-row items-center justify-between">
              <AppText
                type="subtitle"
                className="font-bricolage-medium text-foreground"
              >
                Language {index + 1}
              </AppText>
              {fields.length > 1 && (
                <TouchableOpacity onPress={() => remove(index)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>

            <FormInput<ResumeBuilderFormValues>
              control={control}
              name={`languages.${index}.name`}
              label="Language"
              placeholder="Spanish"
              errors={errors}
            />

            {/* Proficiency - Bottom Sheet Picker */}
            <TouchableOpacity
              onPress={() => setProficiencyPickerIndex(index)}
              className="rounded-xl border border-line bg-surface px-4 py-3"
            >
              <AppText
                className={
                  proficiency
                    ? "text-base text-foreground"
                    : "text-base text-foreground-subtle"
                }
              >
                {proficiency
                  ? getProficiencyLabel(proficiency)
                  : "Select proficiency"}
              </AppText>
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity
        onPress={() => append(DEFAULT_LANGUAGE)}
        className="flex-row items-center gap-2 py-3"
      >
        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
        <AppText className="text-accent">Add Language</AppText>
      </TouchableOpacity>

      {/* Proficiency Picker */}
      {proficiencyPickerIndex !== null && (
        <BottomSheetPicker
          visible={proficiencyPickerIndex !== null}
          selectedValue={
            proficiencyPickerIndex !== null
              ? (watchedLanguages?.[proficiencyPickerIndex]?.proficiency ??
                null)
              : null
          }
          options={PROFICIENCIES}
          title="Select Proficiency"
          searchPlaceholder="Search proficiency levels..."
          onSelect={(value) => {
            setValue(
              `languages.${proficiencyPickerIndex}.proficiency`,
              value as any,
              {
                shouldDirty: true,
                shouldTouch: true,
              },
            );
          }}
          onClose={() => setProficiencyPickerIndex(null)}
        />
      )}
    </View>
  );
}
