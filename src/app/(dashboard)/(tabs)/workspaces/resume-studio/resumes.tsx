import { ResumeItem } from "@/components/resume-studio/resume-item";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { useDeleteResume } from "@/hooks/resume/use-delete-resume";
import { useDuplicateResume } from "@/hooks/resume/use-duplicate-resume";
import { useExportResume } from "@/hooks/resume/use-export-resume";
import { useGetResumes } from "@/hooks/resume/use-get-resumes";
import { useProAction } from "@/components/shared/pro-gate";
import { PRO_FEATURES } from "@/constants/entitlements";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { showToast } from "@/utils/show-toast";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";
import { Resume } from "../../../../../../types/resume/resume";

export default function Resumes() {
  const router = useRouter();
  const { contentColor } = useThemeColors();
  const accent = contentColor("resume");

  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const { resumes, isFetchingResumes, refetchResumes } = useGetResumes();
  const { exportResume } = useExportResume();
  const { allowed: canExport, copy: exportCopy } = useProAction(PRO_FEATURES.RESUME_EXPORT);

  const { deleteResume, isDeleting } = useDeleteResume({
    resumeId: deleteTarget?.id ?? "",
  });

  /*
    Duplicating opens the copy in the builder rather than dropping the user back
    on the list. Nobody duplicates a resume to admire it — they do it to tailor
    it for one more role, so the next step is always editing.
  */
  const { duplicateResume } = useDuplicateResume({
    onSuccess: (response) => {
      setDuplicatingId(null);
      router.push({
        pathname: "/(dashboard)/(tabs)/workspaces/resume-studio/resume-builder",
        params: { resumeId: response.data.id },
      });
    },
  });

  const handleDuplicateResume = function (resume: Resume) {
    setDuplicatingId(resume.id);
    duplicateResume(
      { resumeId: resume.id },
      { onError: () => setDuplicatingId(null) },
    );
  };

  const handleEditResume = function (resumeId: string) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/resume-studio/resume-builder",
      params: { resumeId },
    });
  };

  const handleExportResume = async function (resume: Resume) {
    /*
      The button stays visible for free users — hiding it would leave them with
      no idea the feature exists. Tapping it opens the paywall rather than just
      refusing: someone who has built a resume and reached for Export is at the
      single highest-intent moment in the app.

      The server rejects the call with a 402 regardless; this only saves them a
      round trip.
    */
    if (!canExport) {
      showToast("warning", exportCopy.blurb);
      router.push("/(dashboard)/paywall");
      return;
    }

    if (!resume.template?.theme) {
      showToast("error", "This resume is missing its template");
      return;
    }

    setExportingId(resume.id);

    await exportResume({
      resumeId: resume.id,
      template: resume.template,
      title: resume.title,
      data: {
        personalInfo: resume.personalInfo,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        languages: resume.languages,
        certifications: resume.certifications,
        projects: resume.projects,
        references: resume.references,
      },
    });

    setExportingId(null);
    refetchResumes();
  };

  const handleConfirmDelete = function () {
    deleteResume();
    setDeleteTarget(null);
  };

  if (isFetchingResumes && resumes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={accent} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={resumes}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingResumes && resumes.length > 0}
            onRefresh={refetchResumes}
            tintColor={accent}
          />
        }
        renderItem={({ item }) => (
          <ResumeItem
            resume={item}
            isExporting={exportingId === item.id}
            isDuplicating={duplicatingId === item.id}
            onEdit={handleEditResume}
            onDuplicate={handleDuplicateResume}
            onExport={handleExportResume}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 110,
          gap: 12,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="document-outline"
            accentColor={accent}
            title="No resumes yet"
            subtitle="Pick a template to build your first resume"
          />
        }
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        title="Delete resume"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="delete"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}
