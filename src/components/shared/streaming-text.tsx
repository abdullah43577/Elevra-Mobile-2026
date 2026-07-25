import { useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  StyleProp,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "./app-text";

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  isComplete?: boolean;
  label?: string;
  labelIcon?: keyof typeof Ionicons.glyphMap;
  containerClassName?: string;
  labelClassName?: string;
  textClassName?: string;
  showCursor?: boolean;
  onStreamComplete?: () => void;
}

export function StreamingText({
  text,
  isStreaming,
  isComplete = false,
  label = "Generating...",
  labelIcon = "sparkles",
  containerClassName = "mt-3 rounded-lg bg-blue-50 p-3",
  labelClassName = "text-xs font-medium text-blue-700",
  textClassName = "mt-1 text-sm text-gray-700",
  showCursor = true,
  onStreamComplete,
}: StreamingTextProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isFirstRender = useRef(true);

  // Animate text appearance
  useEffect(() => {
    if (text && isFirstRender.current) {
      isFirstRender.current = false;
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [text]);

  // Trigger completion callback
  useEffect(() => {
    if (isComplete && onStreamComplete) {
      onStreamComplete();
    }
  }, [isComplete]);

  // Show nothing if no text and not streaming
  if (!text && !isStreaming) {
    return null;
  }

  return (
    <View className={containerClassName}>
      <View className="flex-row items-center gap-1.5">
        {labelIcon && (
          <Ionicons
            name={labelIcon}
            size={14}
            color={isStreaming ? "#3B82F6" : "#1D4ED8"}
          />
        )}
        <AppText className={labelClassName}>
          {isStreaming ? label : isComplete ? "Summary" : label}
        </AppText>
        {isStreaming && (
          <ActivityIndicator size="small" color="#3B82F6" className="ml-1" />
        )}
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <AppText className={textClassName}>
          {text}
          {isStreaming && showCursor && (
            <Text className="text-blue-500">▊</Text>
          )}
        </AppText>
      </Animated.View>
    </View>
  );
}
