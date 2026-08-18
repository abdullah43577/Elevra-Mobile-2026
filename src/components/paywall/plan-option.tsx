import { AppText } from "@/components/shared/app-text";
import { Plan } from "@/constants/plans";
import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { Pressable, View } from "react-native";

interface Props {
  plan: Plan;
  isSelected: boolean;
  accent: string;
  onSelect: () => void;
}

export const PlanOption = function ({ plan, isSelected, accent, onSelect }: Props) {
  return (
    <Pressable
      onPress={onSelect}
      className={clsx(
        "flex-row items-center gap-3 rounded-2xl border bg-surface px-4 py-3.5 active:opacity-80",
        isSelected ? "border-2" : "border-hairline border-line",
      )}
      style={isSelected ? { borderColor: accent, backgroundColor: `${accent}0D` } : undefined}
    >
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: 20,
          height: 20,
          borderWidth: 2,
          borderColor: isSelected ? accent : "#B4B4BF",
          backgroundColor: isSelected ? accent : "transparent",
        }}
      >
        {isSelected && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <AppText type="label">{plan.label}</AppText>
          {plan.badge && (
            <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: accent }}>
              <AppText type="caption" className="text-foreground-inverse">
                {plan.badge}
              </AppText>
            </View>
          )}
        </View>
        {plan.caption && (
          <AppText type="caption" className="mt-0.5">
            {plan.caption}
          </AppText>
        )}
      </View>

      <View className="items-end">
        <AppText type="label" className="text-[15px]">
          {plan.price}
        </AppText>
        <AppText type="caption">{plan.period}</AppText>
      </View>
    </Pressable>
  );
};
