export const PRO_FEATURES = {
  AI_NOTE_SUMMARY: "ai_note_summary",
  AI_RESUME_TAILOR: "ai_resume_tailor",
  AI_COVER_LETTER: "ai_cover_letter",
  AI_INTERVIEW_QUESTIONS: "ai_interview_questions",
  AI_ANSWER_COACHING: "ai_answer_coaching",
  AI_MESSAGE_DRAFTS: "ai_message_drafts",
  VOICE_TRANSCRIPTION: "voice_transcription",
} as const;

export type ProFeature = (typeof PRO_FEATURES)[keyof typeof PRO_FEATURES];

// Mirrors src/lib/entitlements.ts on the server, which is the real boundary.
// Keep both in sync: a feature listed here but not there is a hole.
export const PRO_FEATURE_COPY: Record<ProFeature, { title: string; blurb: string }> = {
  [PRO_FEATURES.AI_NOTE_SUMMARY]: {
    title: "AI summaries with Pro",
    blurb: "Turn long notes into a tight summary you can actually skim.",
  },
  [PRO_FEATURES.AI_RESUME_TAILOR]: {
    title: "Tailor resumes with Pro",
    blurb: "Rewrite a copy of your resume around any job posting, using only what's already true about you.",
  },
  [PRO_FEATURES.AI_COVER_LETTER]: {
    title: "Draft letters with Pro",
    blurb: "Get a first draft written from your own experience and the job, with nothing made up.",
  },
  [PRO_FEATURES.AI_INTERVIEW_QUESTIONS]: {
    title: "Job-specific questions with Pro",
    blurb: "Get the questions this interviewer is likely to ask, written from the posting and your own experience.",
  },
  [PRO_FEATURES.AI_ANSWER_COACHING]: {
    title: "Answer feedback with Pro",
    blurb: "Hear how your answer actually lands: pace, filler words, structure, and a tighter version in your own words.",
  },
  [PRO_FEATURES.AI_MESSAGE_DRAFTS]: {
    title: "Follow-ups and thank-yous with Pro",
    blurb: "Get the follow-up, thank-you or offer reply written for you, from your own notes, ready to send.",
  },
  [PRO_FEATURES.VOICE_TRANSCRIPTION]: {
    title: "Transcription with Pro",
    blurb: "Turn any voice note into searchable text.",
  },
};
