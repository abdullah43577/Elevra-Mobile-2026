import { CoverLetter } from "../../types/cover-letter";
import { InterviewQuestion } from "../../types/interview-prep";
import { JobApplication } from "../../types/job-application";
import { Note } from "../../types/notes";
import { Resume } from "../../types/resume/resume";
import { SearchResponse, SearchResult, SearchResultType } from "../../types/search";
import { VoiceRecording } from "../../types/voice-notes";
import { answerOf } from "./interview-prep";

/*
  The offline half of global search. It runs over the lists React Query already
  holds — the same cache the workspace screens read, persisted to AsyncStorage —
  so search keeps working on a train, which is exactly where someone reaches for
  their interview notes.

  It deliberately mirrors the server's search.service.ts: same fields, same
  snippet shape, same two-tier ranking. **Change one and change the other**, or
  the same query returns different results depending on connectivity, which
  reads as data loss rather than as a fallback.

  Two differences are structural rather than accidental, and are the reason this
  is a fallback and not the primary path:

  - it can only see what has been fetched, so a note written on another device
    and never opened here is invisible;
  - archived notes are missing entirely, because /notes excludes them and the
    archive is a separate query the cache may not hold.
*/

const SNIPPET_LEAD = 32;
const SNIPPET_TRAIL = 96;

const stripMarkup = function (value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
};

const matches = function (value: string | null | undefined, term: string) {
  return !!value && value.toLowerCase().includes(term);
};

const buildSnippet = function (body: string | null | undefined, term: string) {
  if (!body) return undefined;

  const text = stripMarkup(body);
  if (!text) return undefined;

  const index = text.toLowerCase().indexOf(term);

  if (index === -1) {
    return text.length > SNIPPET_TRAIL
      ? `${text.slice(0, SNIPPET_TRAIL).trim()}...`
      : text;
  }

  const start = Math.max(0, index - SNIPPET_LEAD);
  const end = Math.min(text.length, index + term.length + SNIPPET_TRAIL);

  return `${start > 0 ? "..." : ""}${text.slice(start, end).trim()}${
    end < text.length ? "..." : ""
  }`;
};

const humanise = function (value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
};

interface LocalSearchInput {
  term: string;
  notes: Note[];
  recordings: VoiceRecording[];
  resumes: Resume[];
  applications: JobApplication[];
  coverLetters: CoverLetter[];
  questions: InterviewQuestion[];
}

interface Ranked {
  result: SearchResult;
  isTitleMatch: boolean;
}

export const searchLocally = function (input: LocalSearchInput): SearchResponse {
  const term = input.term.trim().toLowerCase();
  const ranked: Ranked[] = [];

  input.notes.forEach((note) => {
    const titleMatch = matches(note.title, term);
    if (!titleMatch && !matches(note.content, term)) return;

    const snippet = buildSnippet(note.content, term);

    ranked.push({
      result: {
        id: note.id,
        type: "Note",
        title: note.title,
        ...(note.isArchived
          ? { subtitle: "Archived" }
          : note.folder && { subtitle: note.folder.name }),
        ...(snippet && { snippet }),
        updatedAt: note.updatedAt,
      },
      isTitleMatch: titleMatch,
    });
  });

  input.recordings.forEach((recording) => {
    const titleMatch = matches(recording.title, term);
    if (!titleMatch && !matches(recording.transcription, term)) return;

    const snippet = buildSnippet(recording.transcription, term);

    ranked.push({
      result: {
        id: recording.id,
        type: "Recording",
        title: recording.title,
        ...(snippet && { snippet }),
        updatedAt: recording.updatedAt,
      },
      isTitleMatch: titleMatch,
    });
  });

  input.resumes.forEach((resume) => {
    if (!matches(resume.title, term)) return;

    ranked.push({
      result: {
        id: resume.id,
        type: "Resume",
        title: resume.title,
        ...(resume.template && { subtitle: resume.template.name }),
        updatedAt: resume.updatedAt,
      },
      isTitleMatch: true,
    });
  });

  input.applications.forEach((application) => {
    const titleMatch =
      matches(application.company, term) || matches(application.role, term);

    const bodyMatch =
      matches(application.location, term) ||
      matches(application.source, term) ||
      matches(application.notes, term);

    if (!titleMatch && !bodyMatch) return;

    const snippet = matches(application.notes, term)
      ? buildSnippet(application.notes, term)
      : undefined;

    ranked.push({
      result: {
        id: application.id,
        type: "Application",
        title: application.company,
        subtitle: application.isArchived
          ? `${application.role} · Archived`
          : application.role,
        ...(snippet && { snippet }),
        updatedAt: application.updatedAt,
      },
      isTitleMatch: titleMatch,
    });
  });

  input.coverLetters.forEach((letter) => {
    const titleMatch =
      matches(letter.title, term) ||
      matches(letter.company, term) ||
      matches(letter.role, term);

    if (!titleMatch && !matches(letter.body, term)) return;

    const snippet = buildSnippet(letter.body, term);

    ranked.push({
      result: {
        id: letter.id,
        type: "CoverLetter",
        title: letter.title,
        subtitle: `${letter.company} · ${letter.role}`,
        ...(snippet && { snippet }),
        updatedAt: letter.updatedAt,
      },
      isTitleMatch: titleMatch,
    });
  });

  input.questions.forEach((question) => {
    const answer = answerOf(question);

    // Same scoping as the server: your own questions and the ones you have
    // answered, never the whole seeded bank.
    if (!answer && !question.userId) return;

    const titleMatch = matches(question.text, term);
    if (!titleMatch && !matches(answer?.text, term)) return;

    const snippet = buildSnippet(answer?.text, term);

    ranked.push({
      result: {
        id: question.id,
        type: "InterviewQuestion",
        title: question.text,
        subtitle: humanise(question.category),
        ...(snippet && { snippet }),
        updatedAt: answer?.updatedAt ?? question.updatedAt,
      },
      isTitleMatch: titleMatch,
    });
  });

  ranked.sort((a, b) => {
    if (a.isTitleMatch !== b.isTitleMatch) return a.isTitleMatch ? -1 : 1;
    return (
      new Date(b.result.updatedAt).getTime() -
      new Date(a.result.updatedAt).getTime()
    );
  });

  const results = ranked.map((entry) => entry.result);

  const counts = {
    Note: 0,
    Recording: 0,
    Resume: 0,
    Application: 0,
    CoverLetter: 0,
    InterviewQuestion: 0,
  } satisfies Record<SearchResultType, number>;

  results.forEach((result) => {
    counts[result.type] += 1;
  });

  return { query: input.term.trim(), results, counts, total: results.length };
};
