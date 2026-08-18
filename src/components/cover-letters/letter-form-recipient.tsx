import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import { FormTextArea } from "@/components/shared/form-text-area";
import { SectionHeader } from "@/components/shared/section-header";
import { CoverLetterFormValues } from "@/schemas/cover-letter/cover-letter";
import { Control, FieldErrors } from "react-hook-form";
import { View } from "react-native";

interface Props {
  control: Control<CoverLetterFormValues>;
  errors?: FieldErrors<CoverLetterFormValues>;
}

export const LetterFormRecipient = function ({ control, errors }: Props) {
  return (
    <View>
      <SectionHeader title="Who it's for" />

      <View className="gap-4">
        <FormInput<CoverLetterFormValues>
          control={control}
          name="company"
          label="Company"
          placeholder="Acme Inc"
          errors={errors}
        />

        <FormInput<CoverLetterFormValues>
          control={control}
          name="role"
          label="Role"
          placeholder="Senior Software Engineer"
          errors={errors}
        />

        <View className="flex-row gap-4">
          <View className="flex-1">
            <FormInput<CoverLetterFormValues>
              control={control}
              name="recipientName"
              label="Hiring manager"
              placeholder="Optional"
              errors={errors}
            />
          </View>
          <View className="flex-1">
            <FormInput<CoverLetterFormValues>
              control={control}
              name="recipientTitle"
              label="Their title"
              placeholder="Optional"
              errors={errors}
            />
          </View>
        </View>

        <FormTextArea<CoverLetterFormValues>
          control={control}
          name="companyAddress"
          label="Company address"
          placeholder="Optional — one line per line of the address"
          errors={errors}
        />

        <AppText type="caption">
          Leave the hiring manager blank and the letter opens with &quot;Dear
          Hiring Manager&quot;.
        </AppText>
      </View>
    </View>
  );
};
