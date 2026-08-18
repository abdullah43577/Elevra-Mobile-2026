import { AnswerRecorder } from "@/components/interview-prep/answer-recorder";
import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { ScreenHeader } from "@/components/shared/screen-header";
import { SectionHeader } from "@/components/shared/section-header";
import { TextArea } from "@/components/primitives/text-area";
import { CATEGORY_META, STATUS_META } from "@/constants/interview-prep";
import { useGetQuestions } from "@/hooks/interview-prep/use-get-questions";
import { useSaveAnswer } from "@/hooks/interview-prep/use-save-answer";
import { useSaveAnswerAudio } from "@/hooks/interview-prep/use-save-answer-audio";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { answerOf } from "@/utils/interview-prep";
import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnswerStatus } from "../../../../../../types/interview-prep";

const STATUS_CHOICES: AnswerStatus[] = ["DRAFT", "NEEDS_WORK", "READY"];

export default function QuestionDetail() {
  const router = useRouter();
  const { contentColor } = useThemeColors();
  const accent = contentColor("interview");

  const { questionId } = useLocalSearchParams<{ questionId: string }>();

  // The list is already cached, so reading the question out of it avoids a
  // second request and keeps this screen instant on a slow connection.
  const { questions, isFetchingQuestions } = useGetQuestions();
  const question = questions.find((item) => item.id === questionId);
  const answer = question ? answerOf(question) : undefined;

  const [text, setText] = useState("");
  const [status, setStatus] = useState<AnswerStatus>("DRAFT");

  const { saveAnswer, isSavingAnswer } = useSaveAnswer({
    questionId: questionId ?? "",
    onSuccess: () => router.back(),
  });
  const { saveAnswerAudio, deleteAnswerAudio, isUploading } = useSaveAnswerAudio();

  // Guarded by id: the query object changes identity on every background
  // refetch, and re-running this would wipe whatever the user has typed.
  const hydratedId = useRef<string | null>(null);

  useEffect(() => {
    if (!question || hydratedId.current === question.id) return;
    hydratedId.current = question.id;

    setText(answer?.text ?? "");
    setStatus(answer?.status ?? "DRAFT");
  }, [question, answer]);

  const handleSave = function () {
    saveAnswer({ text: text.trim() || null, status });
  };

  if (isFetchingQuestions && !question) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color={accent} />
      </SafeAreaView>
    );
  }

  if (!question) {
    return (
      <SafeAreaView className="flex-1 bg-canvas">
        <ScreenHeader title="Question" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center px-10">
          <AppText type="title" className="text-center">
            Question not found
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  const category = CATEGORY_META[question.category];

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScreenHeader title={category.short} onBack={() => router.back()} />

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <AppText type="title" className="text-[21px] leading-[28px]">
          {question.text}
        </AppText>

        {!!question.guidance && (
          <View
            className="mt-4 rounded-2xl p-4"
            style={{ backgroundColor: `${accent}14` }}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="bulb-outline" size={15} color={accent} />
              <AppText type="caption" style={{ color: accent }}>
                What a strong answer covers
              </AppText>
            </View>
            <AppText type="body" className="mt-1.5 text-[14px] leading-[20px]">
              {question.guidance}
            </AppText>
          </View>
        )}

        <View className="mt-8">
          <SectionHeader title="Your answer" />
          <TextArea
            placeholder="Write the version you would actually say out loud. Bullet points are fine."
            value={text}
            onChangeText={setText}
            style={{ minHeight: 180, textAlignVertical: "top" }}
          />
        </View>

        <View className="mt-8">
          <SectionHeader title="How ready is it?" />
          <View className="flex-row gap-2">
            {STATUS_CHOICES.map((choice) => {
              const meta = STATUS_META[choice];
              const isSelected = status === choice;

              return (
                <Pressable
                  key={choice}
                  onPress={() => setStatus(choice)}
                  className={clsx(
                    "flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl border-hairline px-3 py-3 active:opacity-70",
                    isSelected ? "border-transparent" : "border-line bg-surface",
                  )}
                  style={isSelected ? { backgroundColor: `${meta.color}1F`, borderColor: meta.color } : undefined}
                >
                  <Ionicons
                    name={meta.icon}
                    size={15}
                    color={isSelected ? meta.color : undefined}
                  />
                  <AppText
                    type="caption"
                    style={isSelected ? { color: meta.color } : undefined}
                  >
                    {meta.short}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-8">
          <AnswerRecorder
            audioUrl={answer?.audioUrl}
            audioDuration={answer?.audioDuration}
            isUploading={isUploading}
            accent={accent}
            onSaveTake={(take) =>
              saveAnswerAudio({
                questionId: question.id,
                uri: take.uri,
                duration: take.duration,
              })
            }
            onDeleteTake={() => deleteAnswerAudio(question.id)}
          />
        </View>
      </KeyboardAwareScrollView>

      <View className="border-t-hairline border-line bg-surface px-5 py-4">
        <AppButton
          type="submit"
          label="Save answer"
          onPress={handleSave}
          isLoading={isSavingAnswer}
          style={{ backgroundColor: accent }}
        />
      </View>
    </SafeAreaView>
  );
}
