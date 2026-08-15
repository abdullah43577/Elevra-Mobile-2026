import { AppText } from "@/components/shared/app-text";
import { quickActions } from "@/constants/dashboard";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

export const QuickActions = function () {
  return (
    <View className="flex-row gap-3">
      {quickActions.map((action) => (
        <Pressable
          key={action.id}
          onPress={action.onPress}
          className="flex-1 items-center rounded-2xl px-3 py-4 active:opacity-70"
          style={{ backgroundColor: `${action.color}12` }}
        >
          {/* Dimensions live in `style`: this is a child of a column parent, so
              RN's default align-items:stretch beats width utility classes. */}
          <View
            className="mb-2.5 items-center justify-center rounded-full"
            style={{
              width: 40,
              height: 40,
              backgroundColor: `${action.color}26`,
            }}
          >
            <Ionicons name={action.icon} size={19} color={action.color} />
          </View>

          <AppText type="label" numberOfLines={1}>
            {action.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
};
