import { useState, useEffect, useRef } from "react";
import { View, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { File } from "expo-file-system";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";
import { useAudioPlayer } from "expo-audio";
import { useSaveRecording } from "@/hooks/voice-notes/use-save-recording";
import { useAudioPicker } from "@/hooks/use-audio-picker";
import { showToast } from "@/utils/show-toast";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { RecorderHeader } from "@/components/voice-notes/recorder/recorder-header";
import { FileSelectionStatus } from "@/components/voice-notes/recorder/file-selection-status";
import { RecorderTimer } from "@/components/voice-notes/recorder/recorder-timer";
import { RecorderActions } from "@/components/voice-notes/recorder/recorder-actions";
import { RecorderPlayback } from "@/components/voice-notes/recorder/recorder-playback";

export default function Recorder() {
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
  // The URI actually bound to the player. Kept separate from
  // audioRecorder.uri because that value can be set as soon as
  // prepareToRecordAsync() runs (pointing at an empty/in-progress file),
  // long before the finished recording exists.
  const [playableUri, setPlayableUri] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const { saveRecording, isSaving } = useSaveRecording();
  const { pickAudio, isPicking } = useAudioPicker();

  // Hooks must be called unconditionally at the top level of the component,
  // never inside useEffect/callbacks. `playableUri` only changes when we
  // explicitly know there's a finished, playable file.
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
        // Don't call player.remove() — useAudioPlayer releases the native
        // object automatically. Calling remove() ourselves races with that
        // and throws "shared object already released".
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
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [recorderState.isRecording]);

  // Keep isPlaying in sync with the player's actual status, including
  // when playback finishes on its own. This is the single source of
  // truth for isPlaying — handlePlayPause no longer sets it optimistically.
  useEffect(() => {
    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status: any) => {
        if (status?.didJustFinish) {
          setIsPlaying(false);
        } else if (typeof status?.playing === "boolean") {
          setIsPlaying(status.playing);
        }
      },
    );

    return () => {
      subscription?.remove?.();
    };
  }, [player]);

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
      // Only now bind the player to the finished file. The query-string
      // suffix forces a fresh load even if the underlying path is reused.
      setPlayableUri(
        audioRecorder.uri ? `${audioRecorder.uri}?t=${Date.now()}` : null,
      );
    } catch (error) {
      console.error("Failed to stop recording:", error);
      showToast("error", "Something went wrong stopping the recording.");
    }
  };

  const handlePlayPause = function () {
    if (!player) return;

    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    // isPlaying is intentionally not set here — the playbackStatusUpdate
    // listener above is the single source of truth for playback state.
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

    if (selectedFile) {
      fileUri = selectedFile.uri;
      fileSize = selectedFile.size;
      fileName = selectedFile.name;
      mimeType = selectedFile.mimeType || "audio/mpeg";
    } else if (audioRecorder.uri) {
      fileUri = audioRecorder.uri;
      try {
        const file = new File(fileUri);
        if (file.exists) {
          fileSize = file.size;
        }
      } catch (error) {
        console.error("Failed to get file info:", error);
      }
      fileName = `${title.trim()}.m4a`;
    } else {
      showToast("error", "No recording or file to save");
      return;
    }

    if (!fileUri) {
      showToast("error", "No file to save");
      return;
    }

    const durationInSeconds = selectedFile
      ? Math.floor(player.duration || 0)
      : Math.floor((recorderState.durationMillis || 0) / 1000);

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
  };

  const hasFile = !!selectedFile || !!audioRecorder.uri;
  const isUploadedFile = !!selectedFile;
  const hasRecording = !!audioRecorder.uri && !isRecording;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <RecorderHeader
        onBack={handleBack}
        onSave={handleSaveRecording}
        isSaving={isSaving}
        hasFile={hasFile}
      />

      <View className="flex-1 items-center justify-center px-6">
        {/* Title Input */}
        <TextInput
          className="mb-4 w-full rounded-xl bg-gray-50 px-4 py-3 text-center text-lg font-medium text-gray-900"
          placeholder="Recording title..."
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#9CA3AF"
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
          elapsedTime={elapsedTime}
          isRecording={isRecording}
          isUploadedFile={isUploadedFile}
        />

        {/* Playback Controls (shown after recording stops) */}
        {hasRecording && !isUploadedFile && !isSaving && (
          <RecorderPlayback
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            duration={elapsedTime}
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
