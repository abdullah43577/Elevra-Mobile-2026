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
  Record, stop, discard — the shared primitive behind both the interview-prep
  answer recorder and the voice-notes recorder screen. It owns permissions, the
  audio mode, an elapsed-seconds ticker, and hands back a uri and a duration.
*/
export const useVoiceRecorder = function () {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  const [elapsed, setElapsed] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /*
    The cleanup closes over the recorder, and it must not re-run on every render
    or it would stop a take mid-recording. A ref keeps the unmount path reading
    live values from an effect that only runs once.
  */
  const recorderRef = useRef(recorder);
  recorderRef.current = recorder;
  const isRecordingRef = useRef(recorderState.isRecording);
  isRecordingRef.current = recorderState.isRecording;

  // Read through a ref in stopRecording: the value closed over at call time is
  // whatever the last render saw, which is a poll interval behind the take.
  const durationMillisRef = useRef(recorderState.durationMillis);
  durationMillisRef.current = recorderState.durationMillis;

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      setHasPermission(status.granted);
    })();

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);

      // Leaving the screen mid-take must release the microphone. Without this
      // the recorder keeps running after the component is gone.
      try {
        if (isRecordingRef.current) recorderRef.current.stop();
      } catch {
        // Already released by the module; nothing to recover.
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
      /*
        The mode is set per action rather than once on mount, because stopping
        flips `allowsRecording` back off — see stopRecording. Setting it only at
        mount leaves a second take recording in playback mode.

        playsInSilentMode so a take is audible with the ringer switch off, which
        is exactly where someone rehearses.
      */
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

  /** Returns the finished take, or undefined if nothing was captured. */
  const stopRecording = async function () {
    stopTicking();

    try {
      await recorder.stop();

      /*
        iOS routes playback to the *earpiece* while the session still allows
        recording, so a take played back immediately sounds faint and far away.
        Turning recording off routes it to the main speaker.
      */
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });

      const uri = recorder.uri;
      if (!uri) return undefined;

      /*
        The native duration is authoritative; the ticker is a display counter
        that drifts and cannot see the sub-second tail. Fall back to it only if
        the module reports nothing.
      */
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
