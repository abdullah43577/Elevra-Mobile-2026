import { ResumeData } from "../../../../types/resume/data";
import { AnyTemplate } from "../../../../types/resume/template";
import {
  buildDocumentHeader,
  buildShellCss,
  escape,
  layoutFlags,
} from "./document-shell";

/*
  Builds the printable HTML for a resume. expo-print hands this to the OS
  renderer (WKWebView on iOS, PdfDocument on Android), which produces a PDF with
  real, selectable text.

  This deliberately mirrors ResumeBody in primitives/resume-sections.tsx: same
  sections, same wording, same order. If you add a section to one, add it to the
  other — a template that previews differently from what it exports is worse
  than one that looks plain.

  Fonts are a standard system stack rather than Bricolage Grotesque. A resume
  PDF is read by parsers and printed by strangers; a common font embeds cleanly
  everywhere and never falls back to something unexpected.
*/

const dateRange = function (start?: string, end?: string, current?: boolean) {
  if (!start) return current ? "Present" : "";
  return `${start} – ${current ? "Present" : (end ?? "Present")}`;
};

const toBullets = function (description?: string, achievements?: string[]) {
  const fromAchievements = (achievements ?? []).map((a) => a.trim()).filter(Boolean);
  if (fromAchievements.length > 0) return fromAchievements;

  return (description ?? "")
    .split(/\n+/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
};

const section = function (label: string, body: string) {
  if (!body.trim()) return "";
  return `<section class="section"><h2>${escape(label)}</h2>${body}</section>`;
};

const entry = function (opts: {
  title: string;
  organisation?: string;
  dates?: string;
  meta?: string;
  body?: string;
}) {
  const org = [opts.organisation, opts.meta].filter(Boolean).join(" · ");

  return `
    <article class="entry">
      <div class="entry-head">
        <span class="entry-title">${escape(opts.title)}</span>
        ${opts.dates ? `<span class="entry-dates">${escape(opts.dates)}</span>` : ""}
      </div>
      ${org ? `<div class="entry-org">${escape(org)}</div>` : ""}
      ${opts.body ?? ""}
    </article>`;
};

const bulletList = function (items: string[]) {
  if (items.length === 0) return "";
  return `<ul>${items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`;
};

const buildBody = function (data: ResumeData) {
  const experience = (data.experience ?? []).filter((e) => e.position || e.company);
  const education = (data.education ?? []).filter((e) => e.school || e.degree);
  const skills = (data.skills ?? []).map((s) => s.name).filter(Boolean);
  const projects = (data.projects ?? []).filter((p) => p.name);
  const certifications = (data.certifications ?? []).filter((c) => c.name);
  const languages = (data.languages ?? []).filter((l) => l.name);
  const references = (data.references ?? []).filter((r) => r.name);

  return [
    data.personalInfo?.summary
      ? section("Summary", `<p>${escape(data.personalInfo.summary)}</p>`)
      : "",

    section(
      "Experience",
      experience
        .map((item) =>
          entry({
            title: item.position,
            organisation: item.company,
            dates: dateRange(item.startDate, item.endDate, item.current),
            body: bulletList(toBullets(item.description, item.achievements)),
          }),
        )
        .join(""),
    ),

    section(
      "Education",
      education
        .map((item) =>
          entry({
            title: [item.degree, item.field].filter(Boolean).join(", "),
            organisation: item.school,
            dates: dateRange(item.startDate, item.endDate, item.current),
            ...(item.gpa && { meta: `GPA ${item.gpa}` }),
          }),
        )
        .join(""),
    ),

    // A comma-run, not chips. Separate visual pills read as disconnected
    // fragments to a parser; one run of text reads as a single clean field.
    skills.length > 0
      ? section("Skills", `<p class="run">${escape(skills.join("  ·  "))}</p>`)
      : "",

    section(
      "Projects",
      projects
        .map((item) =>
          entry({
            title: item.name,
            ...(item.technologies?.length && { organisation: item.technologies.join(", ") }),
            ...(item.description && { body: `<p>${escape(item.description)}</p>` }),
          }),
        )
        .join(""),
    ),

    section(
      "Certifications",
      certifications
        .map((item) =>
          entry({
            title: item.name,
            ...(item.issuer && { organisation: item.issuer }),
            ...(item.date && { dates: item.date }),
          }),
        )
        .join(""),
    ),

    languages.length > 0
      ? section(
          "Languages",
          `<p class="run">${escape(
            languages
              .map((l) => (l.proficiency ? `${l.name} (${l.proficiency})` : l.name))
              .join("  ·  "),
          )}</p>`,
        )
      : "",

    section(
      "References",
      references
        .map((item) =>
          entry({
            title: item.name,
            ...(item.company && {
              organisation: [item.position, item.company].filter(Boolean).join(", "),
            }),
            ...(item.email && { dates: item.email }),
          }),
        )
        .join(""),
    ),
  ].join("");
};

const buildCss = function (template: AnyTemplate) {
  const { theme, accent, layout, gap, dense } = layoutFlags(template);

  const boxedTitles = layout === "TECH_FOCUSED";
  const ruledTitles = ["ATS_ACCENT", "MODERN_BANNER", "PROFESSIONAL_SLEEK"].includes(layout);
  const timeline = layout === "TIMELINE_ACCENT" || layout === "CREATIVE_SPLIT";

  return `${buildShellCss(template)}
    .section { margin-bottom: ${gap}px; ${timeline ? `padding-left: 14px; border-left: 3px solid ${accent};` : ""} }

    h2 {
      margin: 0 0 6px 0;
      font-size: 10pt;
      letter-spacing: 1.1px;
      text-transform: uppercase;
      color: ${boxedTitles ? "#FFFFFF" : theme.primaryColor};
      ${boxedTitles ? `background: ${accent}; display: inline-block; padding: 3px 8px;` : ""}
      ${ruledTitles ? `border-bottom: 2px solid ${accent}; padding-bottom: 3px;` : ""}
    }

    .entry { margin-bottom: 10px; }
    .entry:last-child { margin-bottom: 0; }

    .entry-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;
    }

    .entry-title { font-weight: 700; font-size: ${dense ? 11 : 11.5}pt; }
    .entry-dates { font-size: 9.5pt; color: #5B6169; white-space: nowrap; }
    .entry-org { font-size: 10pt; font-weight: 600; color: ${accent}; margin-top: 1px; }

    p { margin: 4px 0 0 0; }
    .run { margin-top: 0; }

    ul { margin: 5px 0 0 0; padding-left: 16px; }
    li { margin-bottom: 2px; }

    /* Never split an entry across a page break — a role's dates ending up on a
       different page than its title confuses both humans and parsers. */
    .entry, .section { page-break-inside: avoid; }
    h2 { page-break-after: avoid; }
  `;
};

export const buildResumeHtml = function (template: AnyTemplate, data: ResumeData) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escape([data.personalInfo?.firstName, data.personalInfo?.lastName].filter(Boolean).join(" ") || "Resume")}</title>
<style>${buildCss(template)}</style>
</head>
<body>
${buildDocumentHeader(template, data.personalInfo)}
${buildBody(data)}
</body>
</html>`;
};
