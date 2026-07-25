import { useState, useEffect, useRef } from "react";
import { View, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";
import { useSaveRecording } from "@/hooks/voice-notes/use-save-recording";
import { useAudioPicker } from "@/hooks/use-audio-picker";
import { showToast } from "@/utils/show-toast";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { RecorderHeader } from "@/components/voice-notes/recorder/recorder-header";
import { FileSelectionStatus } from "@/components/voice-notes/recorder/file-selection-status";
import { RecorderTimer } from "@/components/voice-notes/recorder/recorder-timer";
import { RecorderActions } from "@/components/voice-notes/recorder/recorder-actions";

export default function Recorder() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    name: string;
    size: number;
    mimeType?: string;
  } | null>(null);
  const timerRef = useRef<number | null>(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const { saveRecording, isSaving } = useSaveRecording();
  const { pickAudio, isPicking } = useAudioPicker();

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

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
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

  const handleRecord = async function () {
    if (!recorderState.isRecording) {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    }
  };

  const handleStopRecording = async function () {
    await audioRecorder.stop();
    setElapsedTime(0);
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
      // Auto-fill title from filename
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
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          fileSize = fileInfo.size;
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
      ? 0
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
    setShowDiscardModal(false);
    router.back();
  };

  const handleCancelDiscard = function () {
    setShowDiscardModal(false);
  };

  const handleClearFile = function () {
    setSelectedFile(null);
  };

  const hasFile = !!selectedFile || !!audioRecorder.uri;
  const isUploadedFile = !!selectedFile;

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
