import { useThemeColors } from "@/hooks/use-theme-colors";
import { AppText } from "@/components/shared/app-text";
import { useDeleteResume } from "@/hooks/resume/use-delete-resume";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Resume } from "../../../types/resume/resume";

interface ResumeItemProps {
  resume: Resume;
  onEdit: (id: string) => void;
  onExport: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

export function ResumeItem({
  resume,
  onEdit,
  onExport,
  onDelete,
  formatDate,
}: ResumeItemProps) {
  const { foregroundMuted } = useThemeColors();

  const { deleteResume, isDeleting } = useDeleteResume({
    resumeId: resume.id,
  });

  const handleDelete = function () {
    deleteResume();
    onDelete(resume.id);
  };

  return (
    <View className="mx-4 mb-4 rounded-xl border border-line bg-surface p-4">
      {/* Title */}
      <AppText
        type="subtitle"
        className="font-bricolage-semibold text-foreground"
      >
        {resume.title}
      </AppText>

      {/* Template & Date */}
      <View className="mt-1 flex-row items-center gap-3">
        <View className="rounded-full bg-surface-muted px-2 py-0.5">
          <AppText className="text-xs text-foreground-muted">
            {resume.template?.name || "No template"}
          </AppText>
        </View>
        <AppText className="text-xs text-foreground-subtle">
          Updated {formatDate(resume.updatedAt)}
        </AppText>
      </View>

      {/* Actions */}
      <View className="mt-3 flex-row items-center gap-4">
        <TouchableOpacity
          onPress={() => onEdit(resume.id)}
          className="flex-row items-center gap-1"
        >
          <Ionicons name="create-outline" size={18} color="#3B82F6" />
          <AppText className="text-sm text-accent">Edit</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onExport(resume.id)}
          className="flex-row items-center gap-1"
        >
          <Ionicons name="download-outline" size={18} color={foregroundMuted} />
          <AppText className="text-sm text-foreground-muted">Export</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="flex-row items-center gap-1"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <AppText className="text-sm text-danger">Delete</AppText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
