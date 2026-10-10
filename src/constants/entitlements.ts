export const PRO_FEATURES = {
  RESUME_EXPORT: "resume_export",
  COVER_LETTER_EXPORT: "cover_letter_export",
  AI_NOTE_SUMMARY: "ai_note_summary",
  AI_REWRITER: "ai_rewriter",
  AI_CHAT: "ai_chat",
  AI_CAREER_TOOLS: "ai_career_tools",
  AI_RESUME_BUILDER: "ai_resume_builder",
  AI_RESUME_TAILOR: "ai_resume_tailor",
  AI_COVER_LETTER: "ai_cover_letter",
  AI_INTERVIEW_QUESTIONS: "ai_interview_questions",
  AI_ANSWER_COACHING: "ai_answer_coaching",
  VOICE_TRANSCRIPTION: "voice_transcription",
} as const;

export type ProFeature = (typeof PRO_FEATURES)[keyof typeof PRO_FEATURES];

/*
  Mirrors src/lib/entitlements.ts on the server. This copy exists only to shape
  the UI — to grey out a button or show a paywall before the user taps. It is
  NOT the security boundary. The server re-checks every gated call and answers
  402, so a tampered client gains nothing.

  Keep the two lists in sync: a feature listed here but not there is a hole; a
  feature there but not here just means the user finds out one tap later.
*/
export const PRO_FEATURE_COPY: Record<ProFeature, { title: string; blurb: string }> = {
  [PRO_FEATURES.RESUME_EXPORT]: {
    title: "Export as PDF with Pro",
    blurb: "Download an ATS-ready PDF of any resume and send it straight to employers.",
  },
  [PRO_FEATURES.COVER_LETTER_EXPORT]: {
    title: "Export as PDF with Pro",
    blurb: "Download your cover letter as a PDF that matches the resume you send with it.",
  },
  [PRO_FEATURES.AI_NOTE_SUMMARY]: {
    title: "AI summaries with Pro",
    blurb: "Turn long notes into a tight summary you can actually skim.",
  },
  [PRO_FEATURES.AI_REWRITER]: {
    title: "AI rewriter with Pro",
    blurb: "Rewrite and polish your writing without leaving the app.",
  },
  [PRO_FEATURES.AI_CHAT]: {
    title: "AI chat with Pro",
    blurb: "Ask questions about your notes, resumes, and applications.",
  },
  [PRO_FEATURES.AI_CAREER_TOOLS]: {
    title: "Career tools with Pro",
    blurb: "Tailored career advice and profile optimisation.",
  },
  [PRO_FEATURES.AI_RESUME_BUILDER]: {
    title: "AI resume builder with Pro",
    blurb: "Build a resume by answering questions instead of filling forms.",
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
  [PRO_FEATURES.VOICE_TRANSCRIPTION]: {
    title: "Transcription with Pro",
    blurb: "Turn any voice note into searchable text.",
  },
};

// Everything not listed above is free, deliberately: notes, voice recordings,
// job applications, resumes, and every template. Building is always free.
