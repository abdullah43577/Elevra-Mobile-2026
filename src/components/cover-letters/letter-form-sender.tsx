import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import { SectionHeader } from "@/components/shared/section-header";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { CoverLetterFormValues } from "@/schemas/cover-letter/cover-letter";
import { Ionicons } from "@expo/vector-icons";
import { Control, FieldErrors } from "react-hook-form";
import { Pressable, View } from "react-native";

interface Props {
  control: Control<CoverLetterFormValues>;
  errors?: FieldErrors<CoverLetterFormValues>;
  canPrefill: boolean;
  onPrefill: () => void;
}

export const LetterFormSender = function ({
  control,
  errors,
  canPrefill,
  onPrefill,
}: Props) {
  const { contentTint } = useThemeColors();
  const { color, surface, holder } = contentTint("profile");

  return (
    <View>
      <SectionHeader title="Your details" />

      {canPrefill && (
        <Pressable
          onPress={onPrefill}
          className="mb-4 flex-row items-center gap-3 rounded-2xl p-4 active:opacity-70"
          style={{ backgroundColor: surface }}
        >
          <View
            className="items-center justify-center rounded-squircle"
            style={{ width: 36, height: 36, backgroundColor: holder }}
          >
            <Ionicons name="flash-outline" size={18} color={color} />
          </View>

          <View className="flex-1">
            <AppText type="label" style={{ color }}>
              Use my career profile
            </AppText>
            <AppText type="caption" className="mt-0.5">
              Fill your name and contact details from your saved profile
            </AppText>
          </View>
        </Pressable>
      )}

      <View className="gap-4">
        <View className="flex-row gap-4">
          <View className="flex-1">
            <FormInput<CoverLetterFormValues>
              control={control}
              name="personalInfo.firstName"
              label="First name"
              placeholder="John"
              errors={errors}
            />
          </View>
          <View className="flex-1">
            <FormInput<CoverLetterFormValues>
              control={control}
              name="personalInfo.lastName"
              label="Last name"
              placeholder="Doe"
              errors={errors}
            />
          </View>
        </View>

        <FormInput<CoverLetterFormValues>
          control={control}
          name="personalInfo.title"
          label="Headline"
          placeholder="Senior Software Engineer"
          errors={errors}
        />

        <FormInput<CoverLetterFormValues>
          control={control}
          name="personalInfo.email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          errors={errors}
        />

        <View className="flex-row gap-4">
          <View className="flex-1">
            <FormInput<CoverLetterFormValues>
              control={control}
              name="personalInfo.phone"
              label="Phone"
              placeholder="+234 800 000 0000"
              errors={errors}
            />
          </View>
          <View className="flex-1">
            <FormInput<CoverLetterFormValues>
              control={control}
              name="personalInfo.location"
              label="Location"
              placeholder="Lagos, Nigeria"
              errors={errors}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
