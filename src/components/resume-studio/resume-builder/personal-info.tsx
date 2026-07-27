import { View } from "react-native";
import { Control, FieldErrors } from "react-hook-form";
import { FormInput } from "@/components/shared/form-input";
import { AppText } from "@/components/shared/app-text";
import { ResumeBuilderFormValues } from "@/schemas/resume-builder/resume-builder";

interface PersonalInfoProps {
  control: Control<ResumeBuilderFormValues>;
  errors?: FieldErrors<ResumeBuilderFormValues>;
}

export function PersonalInfo({ control, errors }: PersonalInfoProps) {
  return (
    <View className="mt-4 gap-4">
      <AppText className="text-sm text-gray-500">
        Fill in your personal details
      </AppText>

      <View className="flex-row gap-4">
        <View className="flex-1">
          <FormInput<ResumeBuilderFormValues>
            control={control}
            name="personalInfo.firstName"
            label="First Name"
            placeholder="John"
            errors={errors}
          />
        </View>
        <View className="flex-1">
          <FormInput<ResumeBuilderFormValues>
            control={control}
            name="personalInfo.lastName"
            label="Last Name"
            placeholder="Doe"
            errors={errors}
          />
        </View>
      </View>

      <FormInput<ResumeBuilderFormValues>
        control={control}
        name="personalInfo.email"
        label="Email"
        placeholder="john@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        errors={errors}
      />

      <FormInput<ResumeBuilderFormValues>
        control={control}
        name="personalInfo.phone"
        label="Phone"
        placeholder="+1 (555) 123-4567"
        keyboardType="phone-pad"
        errors={errors}
      />

      <FormInput<ResumeBuilderFormValues>
        control={control}
        name="personalInfo.location"
        label="Location"
        placeholder="New York, NY"
        errors={errors}
      />

      <FormInput<ResumeBuilderFormValues>
        control={control}
        name="personalInfo.title"
        label="Professional Title"
        placeholder="Software Engineer"
        errors={errors}
      />

      <FormInput<ResumeBuilderFormValues>
        control={control}
        name="personalInfo.summary"
        label="Professional Summary"
        placeholder="Write a brief summary of your experience..."
        multiline
        numberOfLines={4}
        errors={errors}
      />
    </View>
  );
}
