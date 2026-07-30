import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
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
  containerClassName = "flex-1 bg-white",
}: ErrorFallbackProps) => {
  const errorMessage =
    description ||
    (typeof error === "string" ? error : error?.message) ||
    "An unexpected error occurred. Please try again.";

  //   const handleGoBack = () => {
  //     if (router.canGoBack()) {
  //       router.back();
  //     } else {
  //       router.replace("/(tabs)/"); // Fallback to main screen
  //     }
  //   };

  return (
    <View className={containerClassName}>
      <SafeAreaView className="flex-1 items-center justify-center px-5">
        <View className="items-center">
          {/* Error Icon */}
          <View className="mb-6 size-16 items-center justify-center rounded-full bg-red-100">
            <AppText className="text-2xl">⚠️</AppText>
          </View>

          {/* Title */}
          <AppText className="mb-3 text-center text-lg font-semibold text-[#374151]">
            {title}
          </AppText>

          {/* Description */}
          <AppText className="mb-8 text-center text-sm leading-5 text-[#6B7280]">
            {errorMessage}
          </AppText>

          {/* Retry Button */}
          {showRetryButton && (
            <View className="flex-row gap-3">
              {/* <TouchableOpacity
                className="rounded-[8px] bg-gray-500 px-6 py-3"
                onPress={handleGoBack}
              >
                <Text className="text-sm font-semibold text-white">
                  Go Back
                </Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                className="rounded-[8px] bg-green-500 px-6 py-3"
                onPress={onRetry}
              >
                <AppText className="text-sm font-semibold text-white">
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
