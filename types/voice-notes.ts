export interface VoiceRecording {
  id: string;
  title: string;
  duration: number; // in seconds
  fileUrl: string;
  fileSize?: number | null;
  transcription?: string | null;
  isTranscribed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoiceRecordingRequest {
  title: string;
  duration: number;
  fileUrl: string;
  fileSize?: number;
}

export interface UpdateVoiceRecordingRequest {
  title?: string;
  transcription?: string;
  isTranscribed?: boolean;
}
