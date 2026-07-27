import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import {
  Control,
  FieldErrors,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { FormInput } from "@/components/shared/form-input";
import { AppText } from "@/components/shared/app-text";
import { BottomSheetPicker } from "@/components/shared/bottom-sheet-picker";
import {
  ResumeBuilderFormValues,
  DEFAULT_EDUCATION,
  EDUCATIONAL_DEGREES,
  EDUCATIONAL_FIELDS,
} from "@/schemas/resume-builder/resume-builder";

interface EducationProps {
  control: Control<ResumeBuilderFormValues>;
  errors?: FieldErrors<ResumeBuilderFormValues>;
  fields: FieldArrayWithId<ResumeBuilderFormValues, "education">[];
  append: UseFieldArrayAppend<ResumeBuilderFormValues, "education">;
  remove: UseFieldArrayRemove;
  setValue: UseFormSetValue<ResumeBuilderFormValues>;
}

export function Education({
  control,
  errors,
  fields,
  append,
  remove,
  setValue,
}: EducationProps) {
  const [degreePickerIndex, setDegreePickerIndex] = useState<number | null>(
    null,
  );
  const [fieldPickerIndex, setFieldPickerIndex] = useState<number | null>(null);

  const getDegreeLabel = (value: string) => {
    const found = EDUCATIONAL_DEGREES.find((d) => d.value === value);
    return found?.label || "Select degree";
  };

  const getFieldLabel = (value: string) => {
    const found = EDUCATIONAL_FIELDS.find((f) => f.value === value);
    return found?.label || "Select field";
  };

  const watchedEducation = useWatch({ control, name: "education" });

  return (
    <View className="mt-4">
      {fields.map((field, index) => {
        const degree = watchedEducation?.[index]?.degree;
        const fieldOfStudy = watchedEducation?.[index]?.field;

        return (
          <View
            key={field.id}
            className="mb-6 gap-4 rounded-xl border border-gray-200 p-5"
          >
            <View className="mb-4 flex-row items-center justify-between">
              <AppText className="text-base font-medium text-gray-700">
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

            {/* Degree - Bottom Sheet Picker */}
            <TouchableOpacity
              onPress={() => setDegreePickerIndex(index)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3"
            >
              <AppText className="text-xs text-gray-500">Degree</AppText>
              <AppText
                className={
                  degree ? "text-base text-gray-900" : "text-base text-gray-400"
                }
              >
                {degree ? getDegreeLabel(degree) : "Select degree"}
              </AppText>
            </TouchableOpacity>

            {/* Field - Bottom Sheet Picker */}
            <TouchableOpacity
              onPress={() => setFieldPickerIndex(index)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3"
            >
              <AppText className="text-xs text-gray-500">
                Field of Study
              </AppText>
              <AppText
                className={
                  fieldOfStudy
                    ? "text-base text-gray-900"
                    : "text-base text-gray-400"
                }
              >
                {fieldOfStudy ? getFieldLabel(fieldOfStudy) : "Select field"}
              </AppText>
            </TouchableOpacity>

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
        );
      })}

      <TouchableOpacity
        onPress={() => append(DEFAULT_EDUCATION)}
        className="flex-row items-center gap-2 py-3"
      >
        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
        <AppText className="text-blue-500">Add Education</AppText>
      </TouchableOpacity>

      {/* Degree Picker */}
      {degreePickerIndex !== null && (
        <BottomSheetPicker
          visible={degreePickerIndex !== null}
          selectedValue={watchedEducation?.[degreePickerIndex]?.degree ?? null}
          options={EDUCATIONAL_DEGREES}
          title="Select Degree"
          searchPlaceholder="Search degrees..."
          onSelect={(value) => {
            setValue(`education.${degreePickerIndex}.degree`, value, {
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
          onClose={() => setDegreePickerIndex(null)}
        />
      )}

      {/* Field Picker */}
      {fieldPickerIndex !== null && (
        <BottomSheetPicker
          visible={fieldPickerIndex !== null}
          selectedValue={watchedEducation?.[fieldPickerIndex]?.field ?? null}
          options={EDUCATIONAL_FIELDS}
          title="Select Field of Study"
          searchPlaceholder="Search fields..."
          onSelect={(value) => {
            setValue(`education.${fieldPickerIndex}.field`, value, {
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
          onClose={() => setFieldPickerIndex(null)}
        />
      )}
    </View>
  );
}
