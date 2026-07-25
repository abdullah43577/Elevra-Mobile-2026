import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../shared/app-text";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  buttonText,
  onButtonPress,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <Ionicons name={icon} size={64} color="#D1D5DB" />
      <AppText className="mt-4 text-xl font-semibold text-gray-700">
        {title}
      </AppText>
      <AppText className="mt-1 px-8 text-center text-sm text-gray-400">
        {subtitle}
      </AppText>
      {buttonText && onButtonPress && (
        <TouchableOpacity
          onPress={onButtonPress}
          className="mt-6 rounded-lg bg-blue-500 px-6 py-3"
        >
          <AppText className="font-semibold text-white">{buttonText}</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}
