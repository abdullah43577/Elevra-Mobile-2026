import { AppText } from "@/components/shared/app-text";
import { SectionHeader } from "@/components/shared/section-header";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { ProgressStep, ProgressStepId } from "@/utils/application-progress";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

interface Props {
  steps: ProgressStep[];
  accent: string;
  onStep: (id: ProgressStepId) => void;
}

export const NextStepsCard = function ({ steps, accent, onStep }: Props) {
  const { foregroundSubtle } = useThemeColors();
  const doneCount = steps.filter((step) => step.isDone).length;
  const nextId = steps.find((step) => !step.isDone)?.id;

  return (
    <View className="mt-8">
      <SectionHeader title={`Next steps · ${doneCount} of ${steps.length}`} />

      <View className="overflow-hidden rounded-2xl border-hairline border-line bg-surface">
        {steps.map((step, index) => {
          const isNext = step.id === nextId;
          return (
            <View key={step.id}>
              {index > 0 && <View className="ml-12 h-px bg-line" />}
              <Pressable
                onPress={() => onStep(step.id)}
                disabled={step.isDone}
                className="flex-row items-center gap-3 px-4 py-3 active:bg-surface-muted"
              >
                <Ionicons
                  name={step.isDone ? "checkmark-circle" : isNext ? "arrow-forward-circle" : "ellipse-outline"}
                  size={20}
                  color={step.isDone || isNext ? accent : foregroundSubtle}
                />
                <AppText
                  type={isNext ? "label" : "body"}
                  className={step.isDone ? "flex-1 text-foreground-subtle line-through" : "flex-1"}
                >
                  {step.label}
                </AppText>
                {!step.isDone && <Ionicons name="chevron-forward" size={16} color={foregroundSubtle} />}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};
