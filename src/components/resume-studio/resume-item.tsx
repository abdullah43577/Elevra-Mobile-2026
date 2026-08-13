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
  const { deleteResume, isDeleting } = useDeleteResume({
    resumeId: resume.id,
  });

  const handleDelete = function () {
    deleteResume();
    onDelete(resume.id);
  };

  return (
    <View className="mx-4 mb-4 rounded-xl border border-gray-200 bg-white p-4">
      {/* Title */}
      <AppText
        type="subtitle"
        className="font-bricolage-semibold text-gray-900"
      >
        {resume.title}
      </AppText>

      {/* Template & Date */}
      <View className="mt-1 flex-row items-center gap-3">
        <View className="rounded-full bg-gray-100 px-2 py-0.5">
          <AppText className="text-xs text-gray-600">
            {resume.template?.name || "No template"}
          </AppText>
        </View>
        <AppText className="text-xs text-gray-400">
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
          <AppText className="text-sm text-blue-500">Edit</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onExport(resume.id)}
          className="flex-row items-center gap-1"
        >
          <Ionicons name="download-outline" size={18} color="#6B7280" />
          <AppText className="text-sm text-gray-500">Export</AppText>
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
              <AppText className="text-sm text-red-500">Delete</AppText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
