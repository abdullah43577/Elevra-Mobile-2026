import { showToast } from "@/utils/show-toast";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useRef, useState } from "react";

export const useVoiceRecorder = function () {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  const [elapsed, setElapsed] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // The unmount cleanup runs once, so it reads live values through a ref.
  const recorderRef = useRef(recorder);
  recorderRef.current = recorder;
  const isRecordingRef = useRef(recorderState.isRecording);
  isRecordingRef.current = recorderState.isRecording;

  // Read through a ref: the value closed over at call time is a poll interval behind.
  const durationMillisRef = useRef(recorderState.durationMillis);
  durationMillisRef.current = recorderState.durationMillis;

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      setHasPermission(status.granted);
    })();

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);

      try {
        if (isRecordingRef.current) recorderRef.current.stop();
      } catch {
        // Already released by the module.
      }
    };
  }, []);

  const startTicking = function () {
    if (tickRef.current) clearInterval(tickRef.current);
    setElapsed(0);
    tickRef.current = setInterval(() => setElapsed((value) => value + 1), 1000);
  };

  const stopTicking = function () {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  };

  const startRecording = async function () {
    if (hasPermission === false) {
      showToast("error", "Microphone access is needed to record");
      return false;
    }

    try {
      // Set per action, not on mount: stopping turns allowsRecording back off.
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      startTicking();
      return true;
    } catch {
      showToast("error", "Could not start recording");
      return false;
    }
  };

  const stopRecording = async function () {
    stopTicking();

    try {
      await recorder.stop();

      // iOS routes playback to the earpiece while recording is allowed.
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });

      const uri = recorder.uri;
      if (!uri) return undefined;

      // The native duration is authoritative; the ticker drifts.
      const nativeSeconds = durationMillisRef.current
        ? Math.round(durationMillisRef.current / 1000)
        : 0;

      return { uri, duration: nativeSeconds || elapsed };
    } catch {
      showToast("error", "Could not save that recording");
      return undefined;
    }
  };

  const reset = function () {
    stopTicking();
    setElapsed(0);
  };

  return {
    isRecording: recorderState.isRecording,
    elapsed,
    hasPermission,
    startRecording,
    stopRecording,
    reset,
  };
};
