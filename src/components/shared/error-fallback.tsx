import { Illustration } from "@/components/illustrations/illustration";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "./app-text";

interface ErrorFallbackProps {
  error?: Error | string;
  onRetry?: () => void;
  title?: string;
  description?: string;
  showRetryButton?: boolean;
  containerClassName?: string;
}

export const ErrorFallback = ({
  error,
  onRetry,
  title = "Something went wrong",
  description,
  showRetryButton = true,
  containerClassName = "flex-1 bg-surface",
}: ErrorFallbackProps) => {
  const errorMessage =
    description ||
    (typeof error === "string" ? error : error?.message) ||
    "An unexpected error occurred. Please try again.";
  const { danger } = useThemeColors();

  return (
    <View className={containerClassName}>
      <SafeAreaView className="flex-1 items-center justify-center px-5">
        <View className="items-center">
          <View className="mb-5">
            <Illustration name="error" color={danger} size={156} />
          </View>

          <AppText className="mb-3 text-center font-bricolage-semibold text-lg text-foreground">
            {title}
          </AppText>

          <AppText className="mb-8 text-center text-sm leading-5 text-foreground-muted">
            {errorMessage}
          </AppText>

          {showRetryButton && (
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="rounded-[8px] bg-accent px-6 py-3"
                onPress={onRetry}
              >
                <AppText className="font-bricolage-semibold text-sm text-white">
                  Try Again
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};
