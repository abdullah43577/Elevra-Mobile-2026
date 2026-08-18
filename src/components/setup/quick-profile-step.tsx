import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { QuickProfileFormValues } from "@/schemas/setup/quick-profile";
import { Ionicons } from "@expo/vector-icons";
import { Control, FieldErrors } from "react-hook-form";
import { View } from "react-native";

interface Props {
  control: Control<QuickProfileFormValues>;
  errors: FieldErrors<QuickProfileFormValues>;
}

export const QuickProfileStep = function ({ control, errors }: Props) {
  const { color, holder } = useThemeColors().contentTint("profile");

  return (
    <View>
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 44, height: 44, backgroundColor: holder }}
      >
        <Ionicons name="person-outline" size={21} color={color} />
      </View>

      <AppText type="display" className="mt-5">
        Start your career profile
      </AppText>
      <AppText type="subtitle" className="mt-2">
        Enter this once and every resume, cover letter and application you build
        starts filled in instead of blank. You can add your full history later.
      </AppText>

      <View className="mt-7 gap-4">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <FormInput
              label="First name"
              name="firstName"
              control={control}
              errors={errors}
              placeholder="Ada"
            />
          </View>
          <View className="flex-1">
            <FormInput
              label="Last name"
              name="lastName"
              control={control}
              errors={errors}
              placeholder="Lovelace"
            />
          </View>
        </View>

        <FormInput
          label="Email"
          name="email"
          type="email"
          control={control}
          errors={errors}
          placeholder="you@example.com"
        />

        <FormInput
          label="Current role"
          name="title"
          control={control}
          errors={errors}
          placeholder="Product Designer"
        />

        <FormInput
          label="Location"
          name="location"
          control={control}
          errors={errors}
          placeholder="Lagos, Nigeria"
        />
      </View>
    </View>
  );
};
