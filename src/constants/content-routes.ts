import { ContentCategory } from "./content-colors";

// Detail screens disagree on the param name (resumeId, coverLetterId, questionId,
// id), so every navigation to content goes through this map.
export const CONTENT_ROUTES = {
  Note: {
    route: "/(dashboard)/(tabs)/workspaces/smart-notes/note-editor",
    param: "id",
  },
  Recording: {
    route: "/(dashboard)/(tabs)/workspaces/voice-notes/playback",
    param: "id",
  },
  Resume: {
    route: "/(dashboard)/(tabs)/workspaces/resume-studio/resume-builder",
    param: "resumeId",
  },
  Application: {
    route: "/(dashboard)/(tabs)/applications/application-detail",
    param: "id",
  },
  CoverLetter: {
    route: "/(dashboard)/(tabs)/workspaces/cover-letters/letter-editor",
    param: "coverLetterId",
  },
  InterviewQuestion: {
    route: "/(dashboard)/(tabs)/workspaces/interview-prep/question-detail",
    param: "questionId",
  },
} as const satisfies Record<ContentCategory, { route: string; param: string }>;

export const contentTarget = function (type: ContentCategory, id: string) {
  const target = CONTENT_ROUTES[type];

  return { route: target.route, params: { [target.param]: id } };
};
