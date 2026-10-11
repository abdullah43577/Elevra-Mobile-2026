import { Illustration } from "@/components/illustrations/illustration";
import { BenefitRow } from "@/components/paywall/benefit-row";
import { AppText } from "@/components/shared/app-text";
import { PRO_BENEFITS } from "@/constants/plans";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { View } from "react-native";

interface Props {
  trial: string | null;
}

export const TrialStep = function ({ trial }: Props) {
  const { accent } = useThemeColors();

  return (
    <View>
      <View className="self-start">
        <Illustration name="paywall" color={accent} size={148} />
      </View>

      <AppText type="display" className="mt-4">
        {trial ? `Try Pro — ${trial}` : "Try Elevra Pro"}
      </AppText>
      <AppText type="subtitle" className="mt-2">
        {trial
          ? "Nothing is charged until the trial ends, and you can cancel from your store account before then."
          : "Everything you have seen so far stays free. Pro adds the AI that works on each application."}
      </AppText>

      <View className="mt-7 gap-4">
        {PRO_BENEFITS.slice(0, 3).map((benefit) => (
          <BenefitRow key={benefit.title} {...benefit} accent={accent} />
        ))}
      </View>
    </View>
  );
};
