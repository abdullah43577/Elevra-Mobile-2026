import { AppText } from "@/components/shared/app-text";
import { quickActions } from "@/constants/dashboard";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

const PER_ROW = 3;

const chunk = function <T>(items: T[], size: number) {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
};

export const QuickActions = function () {
  const rows = chunk([...quickActions], PER_ROW);

  return (
    <View className="gap-3">
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row gap-3">
          {row.map((action) => (
            <Pressable
              key={action.id}
              onPress={action.onPress}
              className="flex-1 items-center rounded-2xl px-3 py-4 active:opacity-70"
              style={{ backgroundColor: `${action.color}12` }}
            >
              {/* Size in style: a column parent's default stretch beats width utilities. */}
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

          {/* Keeps a short final row aligned with the full rows above it. */}
          {row.length < PER_ROW &&
            Array.from({ length: PER_ROW - row.length }).map((_, index) => (
              <View key={`spacer-${index}`} className="flex-1" />
            ))}
        </View>
      ))}
    </View>
  );
};
