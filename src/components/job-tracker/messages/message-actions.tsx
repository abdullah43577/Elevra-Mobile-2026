import { AppText } from "@/components/shared/app-text";
import { Badge } from "@/components/shared/badge";
import { SectionHeader } from "@/components/shared/section-header";
import { MESSAGE_KIND_META, MESSAGES_FOR_STATUS } from "@/constants/messages";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { ApplicationStatus, MessageKind } from "../../../../types/job-application";

interface Props {
  status: ApplicationStatus;
  isPro: boolean;
  onOpen: (kind: MessageKind) => void;
}

export const MessageActions = function ({ status, isPro, onOpen }: Props) {
  const { contentTint, foregroundSubtle } = useThemeColors();
  const tint = contentTint("application");
  const kinds = MESSAGES_FOR_STATUS[status];

  if (!kinds.length) return null;

  return (
    <View className="mt-8">
      <View className="flex-row items-center gap-2">
        <SectionHeader title="Write to them" />
        {!isPro && <Badge label="Pro" className="mb-3" />}
      </View>

      <View className="overflow-hidden rounded-2xl border-hairline border-line bg-surface">
        {kinds.map((kind, index) => {
          const meta = MESSAGE_KIND_META[kind];
          return (
            <View key={kind}>
              {index > 0 && <View className="ml-16 h-px bg-line" />}
              <Pressable onPress={() => onOpen(kind)} className="flex-row items-center gap-3 px-4 py-3.5 active:bg-surface-muted">
                <View
                  className="items-center justify-center rounded-squircle"
                  style={{ width: 32, height: 32, backgroundColor: tint.holder }}
                >
                  <Ionicons name={meta.icon} size={16} color={tint.color} />
                </View>
                <View className="flex-1">
                  <AppText type="label">{meta.label}</AppText>
                  <AppText type="caption" className="mt-0.5">
                    {meta.hint}
                  </AppText>
                </View>
                <Ionicons name="chevron-forward" size={16} color={foregroundSubtle} />
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};
