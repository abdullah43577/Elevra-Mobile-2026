import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { formatRelativeDate } from "@/constants/dashboard";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Resume } from "../../../types/resume/resume";

interface ResumeItemProps {
  resume: Resume;
  isExporting: boolean;
  onEdit: (id: string) => void;
  onExport: (resume: Resume) => void;
  onDelete: (id: string) => void;
}

const Action = function ({
  icon,
  label,
  color,
  busy,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  busy?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      hitSlop={6}
      className="flex-row items-center gap-1.5 rounded-full px-2 py-1.5 active:bg-surface-muted"
    >
      {busy ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Ionicons name={icon} size={15} color={color} />
      )}
      <AppText type="caption" style={{ color }}>
        {label}
      </AppText>
    </Pressable>
  );
};

export function ResumeItem({
  resume,
  isExporting,
  onEdit,
  onExport,
  onDelete,
}: ResumeItemProps) {
  const { foregroundMuted, danger, contentColor } = useThemeColors();
  const accent = contentColor("resume");

  return (
    <View className="rounded-2xl border-hairline border-line bg-surface p-4">
      <AppText type="label" numberOfLines={1} className="text-[15px]">
        {resume.title}
      </AppText>

      <View className="mt-1.5 flex-row items-center gap-2">
        <View
          className="rounded-full px-2 py-0.5"
          style={{ backgroundColor: `${accent}1F` }}
        >
          <AppText type="caption" style={{ color: accent }}>
            {resume.template?.name || "No template"}
          </AppText>
        </View>
        <AppText type="caption">
          Edited {formatRelativeDate(resume.updatedAt)}
        </AppText>
      </View>

      {!!resume.lastExportedAt && (
        <AppText type="caption" className="mt-1">
          Last exported {formatRelativeDate(resume.lastExportedAt)}
        </AppText>
      )}

      <View className="mt-3 flex-row items-center gap-1 border-t-hairline border-line pt-2">
        <Action icon="create-outline" label="Edit" color={foregroundMuted} onPress={() => onEdit(resume.id)} />
        <Action
          icon="download-outline"
          label="Export PDF"
          color={accent}
          busy={isExporting}
          onPress={() => onExport(resume)}
        />
        <View className="flex-1" />
        <Action icon="trash-outline" label="Delete" color={danger} onPress={() => onDelete(resume.id)} />
      </View>
    </View>
  );
}
