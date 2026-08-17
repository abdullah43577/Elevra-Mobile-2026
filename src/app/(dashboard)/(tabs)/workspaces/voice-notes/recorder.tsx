import { useThemeColors } from "@/hooks/use-theme-colors";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FileSelectionStatus } from "@/components/voice-notes/recorder/file-selection-status";
import { RecorderActions } from "@/components/voice-notes/recorder/recorder-actions";
import { RecorderHeader } from "@/components/voice-notes/recorder/recorder-header";
import { RecorderPlayback } from "@/components/voice-notes/recorder/recorder-playback";
import { RecorderTimer } from "@/components/voice-notes/recorder/recorder-timer";
import { useAudioPicker } from "@/hooks/use-audio-picker";
import { useSaveRecording } from "@/hooks/voice-notes/use-save-recording";
import { showToast } from "@/utils/show-toast";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { File } from "expo-file-system";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Recorder() {
  const { foregroundSubtle } = useThemeColors();

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    name: string;
    size: number;
    mimeType?: string;
  } | null>(null);

  const [playableUri, setPlayableUri] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const { saveRecording, isSaving } = useSaveRecording();
  const { pickAudio, isPicking } = useAudioPicker();

  const player = useAudioPlayer(playableUri);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        showToast(
          "error",
          "Microphone access is required to record voice notes.",
        );
        router.back();
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();

    // Cleanup timer and audio state on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      try {
        player.pause();
      } catch {
        // Player may already be released by the hook itself; safe to ignore.
      }
      try {
        if (recorderState.isRecording) {
          audioRecorder.stop();
        }
      } catch (error) {
        console.error("Failed to stop audio recorder:", error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track recording state changes
  useEffect(() => {
    setIsRecording(recorderState.isRecording);

    if (recorderState.isRecording) {
      // Only start a new interval if one isn't already running
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setElapsedTime((prev) => prev + 1);
        }, 1000);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (recorderState.durationMillis) {
        const durationInSeconds = Math.floor(
          recorderState.durationMillis / 1000,
        );
        setTotalDuration(durationInSeconds);
        setElapsedTime(durationInSeconds);
      }
    }
  }, [recorderState.isRecording, recorderState.durationMillis]);

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
          const duration = Math.floor(status.duration);
          setTotalDuration(duration);
          if (!selectedFile) {
            setElapsedTime(duration);
          }
        }
      },
    );

    return () => subscription?.remove?.();
  }, [player, selectedFile, totalDuration]);

  const handleRecord = async function () {
    if (!recorderState.isRecording) {
      try {
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
        // Clear out any previous playable source before starting a new take.
        setPlayableUri(null);
        setIsPlaying(false);
        setPlaybackTime(0);
        setTotalDuration(0);
        setElapsedTime(0);
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
      } catch (error) {
        console.error("Failed to start recording:", error);
        showToast("error", "Could not start recording. Please try again.");
      }
    }
  };

  const handleStopRecording = async function () {
    try {
      await audioRecorder.stop();
      // Route playback to the main speaker instead of the earpiece.
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });
      // Wait a moment for the file to be ready
      setTimeout(() => {
        // Only now bind the player to the finished file. The query-string
        // suffix forces a fresh load even if the underlying path is reused.
        setPlayableUri(
          audioRecorder.uri ? `${audioRecorder.uri}?t=${Date.now()}` : null,
        );
      }, 100);
    } catch (error) {
      console.error("Failed to stop recording:", error);
      showToast("error", "Something went wrong stopping the recording.");
    }
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
      // Use the duration from the player if available
      durationInSeconds =
        totalDuration > 0 ? totalDuration : Math.floor(player.duration || 0);
    } else if (audioRecorder.uri) {
      fileUri = audioRecorder.uri;
      // Get file size
      try {
        const file = new File(fileUri);
        if (file.exists) {
          fileSize = file.size;
        }
      } catch (error) {
        console.error("Failed to get file info:", error);
      }
      fileName = `${title.trim()}.m4a`;
      // Use the duration from recorderState
      durationInSeconds = Math.floor(
        (recorderState.durationMillis || 0) / 1000,
      );

      // If duration is 0, try to get it from the player
      if (durationInSeconds === 0 && player.duration) {
        durationInSeconds = Math.floor(player.duration);
      }
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
    if (recorderState.isRecording) {
      setShowDiscardModal(true);
    } else {
      router.back();
    }
  };

  const handleConfirmDiscard = function () {
    audioRecorder.stop();
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

  const hasFile = !!selectedFile || !!audioRecorder.uri;
  const isUploadedFile = !!selectedFile;
  const hasRecording = !!audioRecorder.uri && !isRecording;

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <RecorderHeader
        onBack={handleBack}
        onSave={handleSaveRecording}
        isSaving={isSaving}
        hasFile={hasFile}
      />

      <View className="flex-1 items-center justify-center px-6">
        {/* Title Input */}
        <TextInput
          className="mb-8 w-full rounded-2xl border-hairline border-line bg-surface px-4 py-3.5 text-center font-bricolage-medium text-[17px] text-foreground"
          placeholder="Recording title..."
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={foregroundSubtle}
          editable={!isSaving}
        />

        {/* File Selection Status */}
        {isUploadedFile && selectedFile && (
          <FileSelectionStatus
            fileName={selectedFile.name}
            onClearFile={handleClearFile}
          />
        )}

        {/* Timer */}
        <RecorderTimer
          elapsedTime={isPlaying ? playbackTime : elapsedTime}
          isRecording={isRecording}
          isUploadedFile={isUploadedFile}
        />

        {/* Playback Controls (shown after recording stops) */}
        {hasRecording && !isUploadedFile && !isSaving && (
          <RecorderPlayback
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            duration={totalDuration}
            currentTime={playbackTime}
            totalDuration={totalDuration}
          />
        )}

        {/* Action Buttons */}
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
