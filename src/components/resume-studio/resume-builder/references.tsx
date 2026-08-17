import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import {
  DEFAULT_REFERENCE,
  ResumeBuilderFormValues,
} from "@/schemas/resume-builder/resume-builder";
import { Ionicons } from "@expo/vector-icons";
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

interface ReferencesProps {
  control: Control<ResumeBuilderFormValues>;
  errors?: FieldErrors<ResumeBuilderFormValues>;
  fields: FieldArrayWithId<ResumeBuilderFormValues, "references">[];
  append: UseFieldArrayAppend<ResumeBuilderFormValues, "references">;
  remove: UseFieldArrayRemove;
}

export function References({
  control,
  errors,
  fields,
  append,
  remove,
}: ReferencesProps) {
  return (
    <View className="mt-4">
      {fields.map((field, index) => (
        <View
          key={field.id}
          className="mb-4 gap-4 rounded-xl border border-line p-4"
        >
          <View className="mb-3 flex-row items-center justify-between">
            <AppText
              type="subtitle"
              className="font-bricolage-medium text-foreground"
            >
              Reference {index + 1}
            </AppText>
            {fields.length > 1 && (
              <TouchableOpacity onPress={() => remove(index)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`references.${index}.name`}
            label="Full Name"
            placeholder="Jane Smith"
            errors={errors}
          />

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`references.${index}.position`}
            label="Position"
            placeholder="Engineering Manager"
            errors={errors}
          />

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`references.${index}.company`}
            label="Company"
            placeholder="Google"
            errors={errors}
          />

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`references.${index}.email`}
            label="Email"
            placeholder="jane@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            errors={errors}
          />

          <FormInput<ResumeBuilderFormValues>
            control={control}
            name={`references.${index}.phone`}
            label="Phone (optional)"
            placeholder="+1 (555) 123-4567"
            keyboardType="phone-pad"
            errors={errors}
          />
        </View>
      ))}

      <TouchableOpacity
        onPress={() => append(DEFAULT_REFERENCE)}
        className="flex-row items-center gap-2 py-2"
      >
        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
        <AppText className="text-accent">Add Reference</AppText>
      </TouchableOpacity>
    </View>
  );
}
