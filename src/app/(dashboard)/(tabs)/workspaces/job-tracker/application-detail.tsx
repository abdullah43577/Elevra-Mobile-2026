import { ApplicationOverview } from "@/components/job-tracker/application-overview";
import { LinkedItemsSection } from "@/components/job-tracker/linked-items-section";
import { StatusPill } from "@/components/job-tracker/status-pill";
import { AppText } from "@/components/shared/app-text";
import { BottomSheetPicker } from "@/components/shared/bottom-sheet-picker";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { IconButton } from "@/components/shared/icon-button";
import { ScreenHeader } from "@/components/shared/screen-header";
import { SectionHeader } from "@/components/shared/section-header";
import { CONTENT_COLORS } from "@/constants/content-colors";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_META,
} from "@/constants/job-applications";
import { useDeleteApplication } from "@/hooks/job-applications/use-delete-application";
import { useGetApplicationById } from "@/hooks/job-applications/use-get-application-by-id";
import { useLinkNote } from "@/hooks/job-applications/use-link-note";
import { useLinkRecording } from "@/hooks/job-applications/use-link-recording";
import { useSaveApplication } from "@/hooks/job-applications/use-save-application";
import { useGetQuestions } from "@/hooks/interview-prep/use-get-questions";
import { usePinQuestion } from "@/hooks/interview-prep/use-pin-question";
import { useGetNotes } from "@/hooks/smart-notes/use-get-notes";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useGetRecordings } from "@/hooks/voice-notes/use-get-recordings";
import { formatTime } from "@/provider/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationStatus } from "../../../../../../types/job-application";

type PickerTarget = "status" | "note" | "recording" | "question" | null;

export default function ApplicationDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { contentColor } = useThemeColors();
  const accent = contentColor("application");

  const [picker, setPicker] = useState<PickerTarget>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const { application, isFetchingApplication } = useGetApplicationById({
    applicationId: id,
  });

  const { saveApplication, isSavingApplication } = useSaveApplication({
    applicationId: id,
  });

  const { deleteApplication, isDeletingApplication } = useDeleteApplication({
    applicationId: id,
    onSuccess: () => router.back(),
  });

  const { linkNote, unlinkNote, isLinkingNote } = useLinkNote({ applicationId: id });
  const { linkRecording, unlinkRecording, isLinkingRecording } = useLinkRecording({
    applicationId: id,
  });

  // Every question, for the picker; and just the pinned ones, for the section.
  const { questions } = useGetQuestions();
  const { questions: pinnedQuestions } = useGetQuestions({ applicationId: id });
  const { pinQuestion, unpinQuestion, isPinning } = usePinQuestion(id);

  const { notes } = useGetNotes();
  const { recordings } = useGetRecordings();

  const linkedNotes = application?.linkedNotes ?? [];
  const linkedRecordings = application?.linkedRecordings ?? [];

  const linkedNoteIds = new Set(linkedNotes.map((link) => link.noteId));
  const linkedRecordingIds = new Set(
    linkedRecordings.map((link) => link.recordingId),
  );

  const handleStatusChange = function (status: string) {
    saveApplication({ status: status as ApplicationStatus });
  };

  const handleEdit = function () {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/job-tracker/application-form",
      params: { id },
    });
  };

  const handleDelete = function () {
    setDeleteDialogVisible(false);
    deleteApplication();
  };

  if (isFetchingApplication && !application) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color={accent} />
      </SafeAreaView>
    );
  }

  if (!application) {
    return (
      <SafeAreaView className="flex-1 bg-canvas">
        <ScreenHeader title="Application" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center px-10">
          <AppText type="title" className="text-center">
            Application not found
          </AppText>
          <AppText type="subtitle" className="mt-1.5 text-center">
            It may have been deleted.
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScreenHeader
        title="Application"
        onBack={() => router.back()}
        right={
          <View className="flex-row">
            <IconButton icon="create-outline" onPress={handleEdit} />
            <IconButton
              icon="trash-outline"
              color={APPLICATION_STATUS_META.REJECTED.color}
              onPress={() => setDeleteDialogVisible(true)}
              disabled={isDeletingApplication}
            />
          </View>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-6">
          <AppText type="display">{application.company}</AppText>
          <AppText type="subtitle" className="mt-1 text-[15px]">
            {application.role}
          </AppText>

          <Pressable
            onPress={() => setPicker("status")}
            disabled={isSavingApplication}
            className="mt-4 flex-row items-center gap-2 active:opacity-70"
          >
            <StatusPill status={application.status} />
            <AppText type="caption" style={{ color: accent }}>
              Change
            </AppText>
          </Pressable>

          <ApplicationOverview application={application} accentColor={accent} />

          {application.notes && (
            <View className="mt-8">
              <SectionHeader title="Notes" />
              <View className="rounded-2xl border-hairline border-line bg-surface px-4 py-3.5">
                <AppText type="body" className="text-[15px]">
                  {application.notes}
                </AppText>
              </View>
            </View>
          )}

          <LinkedItemsSection
            title="Resume sent"
            icon="document-outline"
            color={CONTENT_COLORS.resume}
            addLabel={application.resume ? "Change" : "Attach"}
            emptyLabel="No resume attached to this application yet"
            items={
              application.resume
                ? [{ id: application.resume.id, title: application.resume.title }]
                : []
            }
            onAdd={handleEdit}
            onRemove={() => saveApplication({ resumeId: null })}
            disabled={isSavingApplication}
          />

          <LinkedItemsSection
            title="Cover letter sent"
            icon="mail-outline"
            color={CONTENT_COLORS.letter}
            addLabel={application.coverLetter ? "Change" : "Attach"}
            emptyLabel="No cover letter attached to this application yet"
            items={
              application.coverLetter
                ? [
                    {
                      id: application.coverLetter.id,
                      title: application.coverLetter.title,
                    },
                  ]
                : []
            }
            onAdd={handleEdit}
            onRemove={() => saveApplication({ coverLetterId: null })}
            disabled={isSavingApplication}
          />

          <LinkedItemsSection
            title="Interview questions"
            icon="chatbubbles-outline"
            color={CONTENT_COLORS.interview}
            addLabel="Pin question"
            emptyLabel="Pin the questions you expect for this role, then rehearse them"
            items={pinnedQuestions.map((question) => ({
              id: question.id,
              title: question.text,
            }))}
            onAdd={() => setPicker("question")}
            onRemove={(questionId) => unpinQuestion(questionId)}
            disabled={isPinning}
          />

          {pinnedQuestions.length > 0 && (
            <Pressable
              onPress={() =>
                router.push({
                  pathname:
                    "/(dashboard)/(tabs)/workspaces/interview-prep/practice",
                  params: { applicationId: id },
                })
              }
              className="mt-3 flex-row items-center justify-center gap-2 rounded-2xl px-4 py-3.5 active:opacity-80"
              style={{ backgroundColor: CONTENT_COLORS.interview }}
            >
              <AppText type="label" className="text-white">
                Rehearse these {pinnedQuestions.length}
              </AppText>
            </Pressable>
          )}

          <LinkedItemsSection
            title="Notes"
            icon="document-text-outline"
            color={CONTENT_COLORS.note}
            addLabel="Link note"
            emptyLabel="Link interview prep or research notes"
            items={linkedNotes.map((link) => ({
              id: link.noteId,
              title: link.note.title,
            }))}
            onAdd={() => setPicker("note")}
            onRemove={(noteId) => unlinkNote({ noteId })}
            disabled={isLinkingNote}
          />

          <LinkedItemsSection
            title="Recordings"
            icon="mic-outline"
            color={CONTENT_COLORS.recording}
            addLabel="Link recording"
            emptyLabel="Link a post-interview debrief"
            items={linkedRecordings.map((link) => ({
              id: link.recordingId,
              title: link.recording.title,
              meta: formatTime(link.recording.duration),
            }))}
            onAdd={() => setPicker("recording")}
            onRemove={(recordingId) => unlinkRecording({ recordingId })}
            disabled={isLinkingRecording}
          />
        </View>
      </ScrollView>

      <BottomSheetPicker
        visible={picker === "status"}
        title="Update status"
        selectedValue={application.status}
        showSearch={false}
        accentColor={accent}
        options={APPLICATION_STATUSES.map((status) => ({
          label: APPLICATION_STATUS_META[status].label,
          value: status,
        }))}
        onSelect={handleStatusChange}
        onClose={() => setPicker(null)}
      />

      <BottomSheetPicker
        visible={picker === "note"}
        title="Link a note"
        selectedValue={null}
        accentColor={CONTENT_COLORS.note}
        searchPlaceholder="Search notes..."
        emptyLabel="No unlinked notes available"
        options={notes
          .filter((note) => !linkedNoteIds.has(note.id))
          .map((note) => ({ label: note.title, value: note.id }))}
        onSelect={(noteId) => linkNote({ noteId })}
        onClose={() => setPicker(null)}
      />

      <BottomSheetPicker
        visible={picker === "question"}
        title="Pin an interview question"
        selectedValue={null}
        accentColor={CONTENT_COLORS.interview}
        searchPlaceholder="Search questions..."
        emptyLabel="No questions available"
        options={questions
          .filter((question) => !pinnedQuestions.some((pinned) => pinned.id === question.id))
          .map((question) => ({ label: question.text, value: question.id }))}
        onSelect={(value) => pinQuestion(value)}
        onClose={() => setPicker(null)}
      />

      <BottomSheetPicker
        visible={picker === "recording"}
        title="Link a recording"
        selectedValue={null}
        accentColor={CONTENT_COLORS.recording}
        searchPlaceholder="Search recordings..."
        emptyLabel="No unlinked recordings available"
        options={recordings
          .filter((recording) => !linkedRecordingIds.has(recording.id))
          .map((recording) => ({
            label: recording.title,
            value: recording.id,
            description: formatTime(recording.duration),
          }))}
        onSelect={(recordingId) => linkRecording({ recordingId })}
        onClose={() => setPicker(null)}
      />

      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Delete application"
        message={`Delete your ${application.role} application at ${application.company}? Linked notes and recordings are not deleted.`}
        confirmLabel="Delete"
        variant="delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogVisible(false)}
      />
    </SafeAreaView>
  );
}
