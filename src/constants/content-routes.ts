import { ContentCategory } from "./content-colors";

/*
  Where each content type opens, and — the part that bites — under which param
  name. The detail screens do not agree: the resume builder reads `resumeId`,
  the letter editor `coverLetterId`, question detail `questionId`, everything
  else `id`. Home's recent activity shipped that knowledge inline and opened the
  resume builder with nothing in it, rendering "Template not found".

  One map, two consumers (recent activity and global search), so the next
  content type cannot ship the same bug a third time.
*/
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
    route: "/(dashboard)/(tabs)/workspaces/job-tracker/application-detail",
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
