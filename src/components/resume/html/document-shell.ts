import { ResumeData } from "../../../../types/resume/data";
import { AnyTemplate } from "../../../../types/resume/template";

/*
  The parts of a printable document that a resume and a cover letter must share.

  A letter and the resume sent with it are read side by side, so their header,
  page margins, type scale and colour have to be identical — not merely similar.
  Keeping one copy here is what guarantees that; two copies would drift the
  first time either was touched.

  Everything below the header differs per document and lives in resume-html.ts
  and cover-letter-html.ts respectively.
*/

export const escape = function (value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

export const SPACING = { COMPACT: 12, NORMAL: 17, SPACIOUS: 23 } as const;

export const layoutFlags = function (template: AnyTemplate) {
  const theme = template.theme;
  // Not every legacy theme variant declares accentColor.
  const accent =
    ("accentColor" in theme ? theme.accentColor : undefined) ?? theme.primaryColor;

  const layout = template.layoutKey;

  return {
    theme,
    accent,
    layout,
    gap: SPACING[theme.spacing] ?? SPACING.NORMAL,
    dense: layout === "COMPACT_DENSE" || layout === "MINIMAL_COMPACT",
  };
};

export const buildDocumentHeader = function (
  template: AnyTemplate,
  personalInfo: ResumeData["personalInfo"],
) {
  const name = [personalInfo?.firstName, personalInfo?.lastName]
    .filter(Boolean)
    .join(" ");
  const title = personalInfo?.title;
  const contact = [
    personalInfo?.email,
    personalInfo?.phone,
    personalInfo?.location,
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

export const buildShellCss = function (template: AnyTemplate) {
  const { theme, accent, layout, gap, dense } = layoutFlags(template);

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
`;
};
