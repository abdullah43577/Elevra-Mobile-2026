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
  DEFAULT_CERTIFICATION,
  ResumeBuilderFormValues,
} from "@/schemas/resume-builder/resume-builder";

interface CertificationsProps {
  control: Control<ResumeBuilderFormValues>;
  errors?: FieldErrors<ResumeBuilderFormValues>;
  fields: FieldArrayWithId<ResumeBuilderFormValues, "certifications">[];
  append: UseFieldArrayAppend<ResumeBuilderFormValues, "certifications">;
  remove: UseFieldArrayRemove;
}

export function Certifications({
  control,
  errors,
  fields,
  append,
  remove,
}: CertificationsProps) {
  return (
    <View className="mt-4">
      {fields.map((field, index) => (
        <View
          key={field.id}
          className="mb-4 gap-4 rounded-xl border border-gray-200 p-4"
        >
          <View className="mb-3 flex-row items-center justify-between">
            <AppText type="subtitle" className="font-medium text-gray-700">
              Certification {index + 1}
            </AppText>
            {fields.length > 1 && (
              <TouchableOpacity onPress={() => remove(index)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`certifications.${index}.name`}
            label="Certification Name"
            placeholder="AWS Certified Developer"
            errors={errors}
          />

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`certifications.${index}.issuer`}
            label="Issuer"
            placeholder="Amazon Web Services"
            errors={errors}
          />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <FormInput<ResumeBuilderFormValues>
                control={control}
                name={`certifications.${index}.date`}
                label="Date Earned"
                placeholder="2022-06"
                errors={errors}
              />
            </View>
            <View className="flex-1">
              <FormInput<ResumeBuilderFormValues>
                control={control}
                name={`certifications.${index}.expiry`}
                label="Expiry (optional)"
                placeholder="2025-06"
                errors={errors}
              />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={() => append(DEFAULT_CERTIFICATION)}
        className="flex-row items-center gap-2 py-2"
      >
        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
        <AppText className="text-blue-500">Add Certification</AppText>
      </TouchableOpacity>
    </View>
  );
}
