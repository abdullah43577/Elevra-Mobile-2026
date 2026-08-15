import { ResumeItem } from "@/components/resume-studio/resume-item";
import { AppText } from "@/components/shared/app-text";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useGetResumes } from "@/hooks/resume/use-get-resumes";
import { showToast } from "@/utils/show-toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Resumes() {
  const router = useRouter();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { resumes, isFetchingResumes, refetchResumes } = useGetResumes();

  const handleCreateResume = function () {
    router.push("/(dashboard)/(tabs)/workspaces/resume-studio");
  };

  const handleEditResume = function (resumeId: string) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/resume-studio/resume-builder",
      params: { resumeId },
    });
  };

  const handleExportResume = function (resumeId: string) {
    // TODO: Implement export
    showToast("info", "Export feature coming soon");
  };

  const handleDeleteResume = function (resumeId: string) {
    setDeleteTargetId(resumeId);
  };

  const confirmDelete = function () {
    if (!deleteTargetId) return;
    refetchResumes();
    setDeleteTargetId(null);
  };

  const formatDate = function (dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isFetchingResumes && resumes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <AppText type="title" className="font-bricolage-bold text-gray-900">
          My Resumes
        </AppText>
        <TouchableOpacity
          onPress={handleCreateResume}
          className="rounded-full bg-blue-500 p-3"
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Resumes List */}
      <FlatList
        data={resumes}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingResumes}
            onRefresh={refetchResumes}
            tintColor="#3B82F6"
          />
        }
        renderItem={({ item }) => (
          <ResumeItem
            resume={item}
            onEdit={handleEditResume}
            onExport={handleExportResume}
            onDelete={handleDeleteResume}
            formatDate={formatDate}
          />
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center py-16">
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <AppText className="mt-4 font-bricolage-semibold text-xl text-gray-700">
              No resumes yet
            </AppText>
            <AppText className="mt-1 text-sm text-gray-400">
              Create your first resume to get started
            </AppText>
            <TouchableOpacity
              onPress={handleCreateResume}
              className="mt-6 rounded-lg bg-blue-500 px-6 py-3"
            >
              <AppText className="font-bricolage-semibold text-white">
                Create Resume
              </AppText>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        visible={!!deleteTargetId}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </SafeAreaView>
  );
}
