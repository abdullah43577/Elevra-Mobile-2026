import { AppText } from "@/components/shared/app-text";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

interface Props {
  color: string;
  onPress: () => void;
}

export const WriteLetterLink = function ({ color, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="mt-2 flex-row items-center gap-1.5 self-start py-1 active:opacity-70"
    >
      <Ionicons name="create-outline" size={15} color={color} />
      <AppText type="caption" style={{ color }}>
        Write one for this job
      </AppText>
    </Pressable>
  );
};
