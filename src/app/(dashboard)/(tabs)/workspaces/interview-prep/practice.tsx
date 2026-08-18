import { PracticeCard } from "@/components/interview-prep/practice-card";
import { PracticeControls } from "@/components/interview-prep/practice-controls";
import { PracticeSummary } from "@/components/interview-prep/practice-summary";
import { AppText } from "@/components/shared/app-text";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ScreenHeader } from "@/components/shared/screen-header";
import { useGetQuestions } from "@/hooks/interview-prep/use-get-questions";
import { useRecordPractice } from "@/hooks/interview-prep/use-record-practice";
import { useSaveAnswer } from "@/hooks/interview-prep/use-save-answer";
import { useSaveAnswerAudio } from "@/hooks/interview-prep/use-save-answer-audio";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { buildPracticeSet } from "@/utils/interview-prep";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AnswerStatus,
  InterviewCategory,
} from "../../../../../../types/interview-prep";

export default function Practice() {
  const router = useRouter();
  const { contentColor } = useThemeColors();
  const accent = contentColor("interview");

  const params = useLocalSearchParams<{
    size?: string;
    category?: InterviewCategory;
    applicationId?: string;
  }>();

  const { questions, isFetchingQuestions } = useGetQuestions({
    ...(params.category && { category: params.category }),
    ...(params.applicationId && { applicationId: params.applicationId }),
  });

  const [index, setIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isExitVisible, setIsExitVisible] = useState(false);
  const [ratings, setRatings] = useState<Record<string, AnswerStatus>>({});

  /*
    The set is frozen on first load. Recomputing it as answers change would
    reorder the queue under the user mid-session — the ordering is a starting
    condition, not a live view.
  */
  const [frozenIds, setFrozenIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (frozenIds || questions.length === 0) return;

    const size = params.size ? Number(params.size) : null;
    setFrozenIds(buildPracticeSet(questions, size).map((item) => item.id));
  }, [questions, frozenIds, params.size]);

  const set = useMemo(() => {
    if (!frozenIds) return [];
    const byId = new Map(questions.map((item) => [item.id, item]));
    return frozenIds.map((id) => byId.get(id)).filter(Boolean) as typeof questions;
  }, [frozenIds, questions]);

  const current = set[index];

  // Answer timer, restarted for each question.
  useEffect(() => {
    if (isFinished || !current) return;

    setSeconds(0);
    const tick = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(tick);
  }, [index, isFinished, current]);

  const recorder = useVoiceRecorder();
  const { saveAnswerAudio, isUploading } = useSaveAnswerAudio();
  const { recordPractice } = useRecordPractice();
  const { saveAnswer } = useSaveAnswer({
    questionId: current?.id ?? "",
    silent: true,
  });

  // Fired once, when the run ends. Reporting per question would leave a session
  // half recorded on a bad connection.
  const hasReported = useRef(false);

  const finish = async function (rehearsedIds: string[]) {
    setIsFinished(true);

    if (hasReported.current || rehearsedIds.length === 0) return;
    hasReported.current = true;

    await recordPractice({ questionIds: rehearsedIds });
  };

  const handleToggleRecord = async function () {
    if (!current) return;

    if (recorder.isRecording) {
      const take = await recorder.stopRecording();
      if (take) {
        await saveAnswerAudio({
          questionId: current.id,
          uri: take.uri,
          duration: take.duration,
        });
      }
      return;
    }

    await recorder.startRecording();
  };

  const handleRate = async function (status: "NEEDS_WORK" | "READY") {
    if (!current) return;

    // Stop a take still running rather than losing it silently on advance.
    if (recorder.isRecording) {
      const take = await recorder.stopRecording();
      if (take) {
        await saveAnswerAudio({
          questionId: current.id,
          uri: take.uri,
          duration: take.duration,
        });
      }
    }

    setRatings((previous) => ({ ...previous, [current.id]: status }));
    setTotalSeconds((previous) => previous + seconds);
    saveAnswer({ status });

    if (index >= set.length - 1) {
      await finish(set.map((item) => item.id));
      return;
    }

    setIsRevealed(false);
    setIndex((previous) => previous + 1);
  };

  const handlePractiseFlagged = function () {
    const flagged = set
      .filter((item) => ratings[item.id] === "NEEDS_WORK")
      .map((item) => item.id);

    if (flagged.length === 0) return;

    hasReported.current = false;
    setFrozenIds(flagged);
    setRatings({});
    setIndex(0);
    setIsRevealed(false);
    setTotalSeconds(0);
    setIsFinished(false);
  };

  const rated = Object.values(ratings);

  if (isFetchingQuestions && set.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color={accent} />
      </SafeAreaView>
    );
  }

  if (isFinished) {
    return (
      <SafeAreaView className="flex-1 bg-canvas">
        <ScreenHeader title="Session complete" onBack={() => router.back()} />
        <PracticeSummary
          rehearsed={rated.length}
          ready={rated.filter((status) => status === "READY").length}
          needsWork={rated.filter((status) => status === "NEEDS_WORK").length}
          totalSeconds={totalSeconds}
          accent={accent}
          onPractiseFlagged={handlePractiseFlagged}
          onDone={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  if (!current) {
    return (
      <SafeAreaView className="flex-1 bg-canvas">
        <ScreenHeader title="Practice" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center px-10">
          <AppText type="title" className="text-center">
            Nothing to practise
          </AppText>
          <AppText type="subtitle" className="mt-1.5 text-center">
            No questions matched that filter.
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScreenHeader
        title="Practice"
        backIcon="close"
        onBack={() => setIsExitVisible(true)}
      />

      <PracticeCard
        question={current}
        index={index}
        total={set.length}
        seconds={seconds}
        isRevealed={isRevealed}
        accent={accent}
        onReveal={() => setIsRevealed(true)}
      />

      <PracticeControls
        isRecording={recorder.isRecording}
        isUploading={isUploading}
        recordSeconds={recorder.elapsed}
        isLast={index >= set.length - 1}
        accent={accent}
        onToggleRecord={handleToggleRecord}
        onRate={handleRate}
      />

      <ConfirmDialog
        visible={isExitVisible}
        title="End this session?"
        message={
          rated.length > 0
            ? `${rated.length} rehearsed so far. Ending now keeps what you have marked.`
            : "Nothing has been rehearsed yet."
        }
        confirmLabel="End session"
        cancelLabel="Keep going"
        onConfirm={async () => {
          setIsExitVisible(false);
          const rehearsedIds = set.slice(0, index).map((item) => item.id);
          await finish(rehearsedIds);
        }}
        onCancel={() => setIsExitVisible(false)}
      />
    </SafeAreaView>
  );
}
