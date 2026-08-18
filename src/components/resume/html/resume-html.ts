import { ResumeData } from "../../../../types/resume/data";
import { AnyTemplate } from "../../../../types/resume/template";

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

const escape = function (value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

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

const SPACING = { COMPACT: 12, NORMAL: 17, SPACIOUS: 23 } as const;

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

const buildHeader = function (template: AnyTemplate, data: ResumeData) {
  const name = [data.personalInfo?.firstName, data.personalInfo?.lastName]
    .filter(Boolean)
    .join(" ");
  const title = data.personalInfo?.title;
  const contact = [
    data.personalInfo?.email,
    data.personalInfo?.phone,
    data.personalInfo?.location,
  ].filter(Boolean);

  const contactLine = contact.length
    ? `<div class="contact">${contact.map(escape).join("&nbsp;&nbsp;|&nbsp;&nbsp;")}</div>`
    : "";

  const inner = `
    <h1>${escape(name)}</h1>
    ${title ? `<div class="role">${escape(title)}</div>` : ""}
    ${contactLine}`;

  switch (template.layoutKey) {
    case "MODERN_BANNER":
      return `<header class="banner">${inner}</header>`;
    case "ATS_CLEAN":
    case "PROFESSIONAL_CLASSIC":
    case "EXECUTIVE_FORMAL":
      return `<header class="centered">${inner}</header><hr class="head-rule" />`;
    default:
      return `<header>${inner}</header>`;
  }
};

const buildCss = function (template: AnyTemplate) {
  const theme = template.theme;
  // Not every legacy theme variant declares accentColor.
  const accent =
    ("accentColor" in theme ? theme.accentColor : undefined) ?? theme.primaryColor;
  const gap = SPACING[theme.spacing] ?? SPACING.NORMAL;
  const layout = template.layoutKey;

  const boxedTitles = layout === "TECH_FOCUSED";
  const ruledTitles = ["ATS_ACCENT", "MODERN_BANNER", "PROFESSIONAL_SLEEK"].includes(layout);
  const timeline = layout === "TIMELINE_ACCENT" || layout === "CREATIVE_SPLIT";
  const dense = layout === "COMPACT_DENSE" || layout === "MINIMAL_COMPACT";

  return `
    @page { size: A4; margin: ${dense ? "13mm" : "16mm"}; }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: Helvetica, Arial, "Helvetica Neue", sans-serif;
      font-size: ${dense ? 10.5 : 11}pt;
      line-height: 1.42;
      color: ${theme.textColor ?? "#1F2328"};
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    h1 {
      margin: 0;
      font-size: ${dense ? 20 : 23}pt;
      letter-spacing: 0.2px;
      color: ${theme.primaryColor};
    }

    .role {
      margin-top: 2px;
      font-size: 11.5pt;
      font-weight: 600;
      color: ${layout === "ATS_CLEAN" ? "#5B6169" : accent};
    }

    .contact {
      margin-top: 5px;
      font-size: 9.5pt;
      color: #5B6169;
    }

    header { margin-bottom: ${gap}px; }
    header.centered { text-align: center; margin-bottom: 8px; }

    .head-rule {
      border: 0;
      border-top: 1px solid #D8DCE1;
      margin: 0 0 ${gap}px 0;
    }

    header.banner {
      background: ${theme.primaryColor};
      color: #FFFFFF;
      padding: 20px 22px;
      margin: -${dense ? 13 : 16}mm -${dense ? 13 : 16}mm ${gap}px -${dense ? 13 : 16}mm;
    }
    header.banner h1, header.banner .role, header.banner .contact { color: #FFFFFF; }
    header.banner .contact { opacity: 0.85; }

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
${buildHeader(template, data)}
${buildBody(data)}
</body>
</html>`;
};
