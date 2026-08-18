import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FileSelectionStatus } from "@/components/voice-notes/recorder/file-selection-status";
import { RecorderActions } from "@/components/voice-notes/recorder/recorder-actions";
import { RecorderHeader } from "@/components/voice-notes/recorder/recorder-header";
import { RecorderPlayback } from "@/components/voice-notes/recorder/recorder-playback";
import { RecorderTimer } from "@/components/voice-notes/recorder/recorder-timer";
import { useAudioPicker } from "@/hooks/use-audio-picker";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { useSaveRecording } from "@/hooks/voice-notes/use-save-recording";
import { showToast } from "@/utils/show-toast";
import { useAudioPlayer } from "expo-audio";
import { File } from "expo-file-system";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Recorder() {
  const { foregroundSubtle } = useThemeColors();

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    name: string;
    size: number;
    mimeType?: string;
  } | null>(null);

  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [playableUri, setPlayableUri] = useState<string | null>(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const { isRecording, elapsed, hasPermission, startRecording, stopRecording } =
    useVoiceRecorder();

  const { saveRecording, isSaving } = useSaveRecording();
  const { pickAudio, isPicking } = useAudioPicker();

  const player = useAudioPlayer(playableUri);

  // Recording is the whole point of this screen, so a refusal sends the user
  // back rather than leaving them on a screen whose main control cannot work.
  useEffect(() => {
    if (hasPermission === false) {
      showToast("error", "Microphone access is required to record voice notes.");
      router.back();
    }
  }, [hasPermission, router]);

  useEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {
        // Player may already be released by the hook itself; safe to ignore.
      }
    };
  }, [player]);

  // Keep isPlaying in sync with the player's actual status
  useEffect(() => {
    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status: any) => {
        if (status?.didJustFinish) {
          setIsPlaying(false);
          setPlaybackTime(totalDuration);
          return;
        }

        if (typeof status?.playing === "boolean") {
          setIsPlaying(status.playing);
        }

        if (typeof status?.currentTime === "number") {
          setPlaybackTime(Math.floor(status.currentTime));
        }

        if (status?.duration && status.duration > 0) {
          setTotalDuration(Math.floor(status.duration));
        }
      },
    );

    return () => subscription?.remove?.();
  }, [player, totalDuration]);

  const handleRecord = async function () {
    if (isRecording) return;

    // Clear out any previous playable source before starting a new take.
    setPlayableUri(null);
    setRecordedUri(null);
    setIsPlaying(false);
    setPlaybackTime(0);
    setTotalDuration(0);

    await startRecording();
  };

  const handleStopRecording = async function () {
    const take = await stopRecording();
    if (!take) return;

    setRecordedUri(take.uri);
    setTotalDuration(take.duration);

    // Wait a moment for the file to be ready before binding the player. The
    // query-string suffix forces a fresh load even if the path is reused.
    setTimeout(() => setPlayableUri(`${take.uri}?t=${Date.now()}`), 100);
  };

  const handlePlayPause = async function () {
    if (!player) return;

    if (isPlaying) {
      player.pause();
    } else {
      if (playbackTime >= totalDuration && totalDuration > 0) {
        await player.seekTo(0);
        setPlaybackTime(0);
      }
      player.play();
    }
  };

  const handlePickAudio = async function () {
    const audio = await pickAudio();
    if (audio) {
      setSelectedFile({
        uri: audio.uri,
        name: audio.name,
        size: audio.size,
        mimeType: audio.mimeType,
      });
      setRecordedUri(null);
      setPlayableUri(audio.uri);
      setPlaybackTime(0);
      setTotalDuration(0);
      if (!title.trim()) {
        const fileName = audio.name.replace(/\.[^/.]+$/, "");
        setTitle(fileName);
      }
      showToast("success", `Selected: ${audio.name}`);
    }
  };

  const handleSaveRecording = async function () {
    if (!title.trim()) {
      showToast("error", "Please enter a title for the recording");
      return;
    }

    let fileUri: string | undefined;
    let fileSize: number | undefined;
    let fileName: string | undefined;
    let mimeType: string = "audio/m4a";
    let durationInSeconds = 0;

    if (selectedFile) {
      fileUri = selectedFile.uri;
      fileSize = selectedFile.size;
      fileName = selectedFile.name;
      mimeType = selectedFile.mimeType || "audio/mpeg";
      durationInSeconds =
        totalDuration > 0 ? totalDuration : Math.floor(player.duration || 0);
    } else if (recordedUri) {
      fileUri = recordedUri;
      try {
        const file = new File(fileUri);
        if (file.exists) {
          fileSize = file.size;
        }
      } catch (error) {
        console.error("Failed to get file info:", error);
      }
      fileName = `${title.trim()}.m4a`;
      durationInSeconds =
        totalDuration > 0 ? totalDuration : Math.floor(player.duration || 0);
    } else {
      showToast("error", "No recording or file to save");
      return;
    }

    if (!fileUri) {
      showToast("error", "No file to save");
      return;
    }

    // Ensure duration is at least 1 second
    if (durationInSeconds === 0) {
      durationInSeconds = 1;
      showToast("warning", "Recording duration was 0, set to 1 second");
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("duration", String(durationInSeconds));
    if (fileSize) {
      formData.append("fileSize", String(fileSize));
    }
    formData.append("audio", {
      uri: fileUri,
      name: fileName || `${title.trim()}.m4a`,
      type: mimeType,
    } as any);

    saveRecording(formData);
  };

  const handleBack = function () {
    if (isRecording) {
      setShowDiscardModal(true);
    } else {
      router.back();
    }
  };

  const handleConfirmDiscard = async function () {
    await stopRecording();
    setRecordedUri(null);
    setPlayableUri(null);
    setIsPlaying(false);
    setShowDiscardModal(false);
    router.back();
  };

  const handleCancelDiscard = function () {
    setShowDiscardModal(false);
  };

  const handleClearFile = function () {
    setSelectedFile(null);
    setPlayableUri(null);
    setIsPlaying(false);
    setPlaybackTime(0);
    setTotalDuration(0);
  };

  const hasFile = !!selectedFile || !!recordedUri;
  const isUploadedFile = !!selectedFile;
  const hasRecording = !!recordedUri && !isRecording;

  // Live tick while recording, playhead while playing, otherwise the take's
  // finished length.
  const displayTime = isRecording
    ? elapsed
    : isPlaying
      ? playbackTime
      : totalDuration;

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <RecorderHeader
        onBack={handleBack}
        onSave={handleSaveRecording}
        isSaving={isSaving}
        hasFile={hasFile}
      />

      <View className="flex-1 items-center justify-center px-6">
        <TextInput
          className="mb-8 w-full rounded-2xl border-hairline border-line bg-surface px-4 py-3.5 text-center font-bricolage-medium text-[17px] text-foreground"
          placeholder="Recording title..."
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={foregroundSubtle}
          editable={!isSaving}
        />

        {isUploadedFile && selectedFile && (
          <FileSelectionStatus
            fileName={selectedFile.name}
            onClearFile={handleClearFile}
          />
        )}

        <RecorderTimer
          elapsedTime={displayTime}
          isRecording={isRecording}
          isUploadedFile={isUploadedFile}
        />

        {hasRecording && !isUploadedFile && !isSaving && (
          <RecorderPlayback
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            duration={totalDuration}
            currentTime={playbackTime}
            totalDuration={totalDuration}
          />
        )}

        <RecorderActions
          isRecording={isRecording}
          isUploadedFile={isUploadedFile}
          isPicking={isPicking}
          isSaving={isSaving}
          onRecord={handleRecord}
          onStopRecording={handleStopRecording}
          onPickAudio={handlePickAudio}
        />
      </View>

      <ConfirmDialog
        visible={showDiscardModal}
        title="Stop Recording?"
        message="You are currently recording. Do you want to stop and discard this recording?"
        confirmLabel="Stop & Discard"
        cancelLabel="Continue Recording"
        variant="delete"
        onConfirm={handleConfirmDiscard}
        onCancel={handleCancelDiscard}
      />
    </SafeAreaView>
  );
}
