import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

export interface SetupTask {
  id: string;
  title: string;
  body: string;
  icon: keyof typeof Ionicons.glyphMap;
  isDone: boolean;
  onPress: () => void;
}

interface Props {
  tasks: SetupTask[];
  onDismiss: () => void;
}

/*
  What setup did not finish. It replaces the standalone career-profile prompt
  rather than sitting beside it — two cards on the front door both saying "set up
  your career profile" is worse than one list that happens to have a single row.

  It renders only while something is outstanding, and can be dismissed outright:
  a checklist that cannot be silenced becomes a permanent accusation on the
  screen someone opens every day.
*/
export const SetupChecklist = function ({ tasks, onDismiss }: Props) {
  const { contentTint, foregroundSubtle } = useThemeColors();
  const { color, holder } = contentTint("profile");

  const remaining = tasks.filter((task) => !task.isDone);
  if (!remaining.length) return null;

  const done = tasks.length - remaining.length;

  return (
    <View className="overflow-hidden rounded-3xl border-hairline border-line bg-surface">
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-4">
        <View
          className="items-center justify-center rounded-squircle"
          style={{ width: 36, height: 36, backgroundColor: holder }}
        >
          <Ionicons name="rocket-outline" size={17} color={color} />
        </View>

        <View className="flex-1">
          <AppText type="label" className="text-[15px]">
            Finish setting up
          </AppText>
          <AppText type="caption" className="mt-0.5">
            {done} of {tasks.length} done
          </AppText>
        </View>

        <Pressable onPress={onDismiss} hitSlop={10} className="active:opacity-60">
          <Ionicons name="close" size={18} color={foregroundSubtle} />
        </Pressable>
      </View>

      {remaining.map((task) => (
        <View key={task.id}>
          <View className="ml-4 h-px bg-line" />

          <Pressable
            onPress={task.onPress}
            className="flex-row items-center gap-3 px-4 py-3.5 active:bg-surface-muted"
          >
            <Ionicons name={task.icon} size={18} color={foregroundSubtle} />

            <View className="flex-1">
              <AppText type="label" className="text-[15px]">
                {task.title}
              </AppText>
              <AppText type="caption" className="mt-0.5">
                {task.body}
              </AppText>
            </View>

            <Ionicons name="chevron-forward" size={16} color={foregroundSubtle} />
          </Pressable>
        </View>
      ))}
    </View>
  );
};
