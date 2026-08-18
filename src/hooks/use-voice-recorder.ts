import { showToast } from "@/utils/show-toast";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useRef, useState } from "react";

/*
  Record, stop, discard — the primitive the voice-notes recorder screen never
  extracted. It owns permissions, the audio mode, and an elapsed-seconds ticker,
  and hands back a uri and a duration.

  The voice-notes recorder still has its own inline copy of this because it also
  does file picking, playback and titling around it; it should adopt this hook
  the next time it is touched, rather than being refactored blind now.
*/
export const useVoiceRecorder = function () {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  const [elapsed, setElapsed] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      setHasPermission(status.granted);

      if (status.granted) {
        // playsInSilentMode so playback of a take is audible with the ringer
        // switch off, which is exactly where someone rehearses.
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
      }
    })();

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
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
      showToast("error", "Microphone access is needed to record an answer");
      return false;
    }

    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
      startTicking();
      return true;
    } catch {
      showToast("error", "Could not start recording");
      return false;
    }
  };

  /** Returns the finished take, or undefined if nothing was captured. */
  const stopRecording = async function () {
    stopTicking();

    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) return undefined;

      return { uri, duration: elapsed };
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
