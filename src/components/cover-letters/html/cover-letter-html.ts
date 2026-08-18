import { CoverLetter } from "../../../../types/cover-letter";
import { AnyTemplate } from "../../../../types/resume/template";
import {
  buildDocumentHeader,
  buildShellCss,
  escape,
  layoutFlags,
} from "../../resume/html/document-shell";
import {
  formatLetterDate,
  letterClosing,
  letterGreeting,
  letterRecipientLines,
  letterSenderName,
  toParagraphs,
} from "@/utils/cover-letter";

/*
  The printable HTML for a cover letter. Same pipeline as the resume — handed to
  expo-print, rendered by the OS to real selectable text — and deliberately
  built on the same document shell, so a letter and the resume sent with it
  share their header, margins, type scale and colour exactly.

  Nothing here is decorative. A cover letter is read by the same parsers and
  printed by the same strangers as the resume.
*/

// The template is required, not optional: every renderer reads template.theme,
// so a letter without one cannot be drawn at all. Callers guard before calling.
type PrintableLetter = CoverLetter & { template: AnyTemplate };

const buildLetterCss = function (letter: PrintableLetter) {
  const { accent, gap } = layoutFlags(letter.template);

  return `${buildShellCss(letter.template)}
    .letter-meta { margin-bottom: ${gap}px; }

    .date { font-size: 10pt; color: #5B6169; }

    .recipient {
      margin-top: 12px;
      font-size: 10.5pt;
      line-height: 1.5;
    }

    .greeting {
      margin: 0 0 12px 0;
      font-weight: 600;
      color: ${accent};
    }

    p.para {
      margin: 0 0 11px 0;
      /* Never justified: without hyphenation it opens rivers of whitespace and
         reads worse in print than a ragged right edge. */
      text-align: left;
      orphans: 2;
      widows: 2;
    }

    .signoff { margin-top: ${gap}px; page-break-inside: avoid; }
    .signoff .closing { margin: 0; }
    .signoff .signature { margin-top: 26px; font-weight: 700; }
  `;
};

export const buildCoverLetterHtml = function (letter: PrintableLetter) {
  const letterDate = formatLetterDate(letter.letterDate);
  const recipientLines = letterRecipientLines(letter);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escape(letter.title || "Cover letter")}</title>
<style>${buildLetterCss(letter)}</style>
</head>
<body>
${buildDocumentHeader(letter.template, letter.personalInfo ?? undefined)}
<div class="letter-meta">
  ${letterDate ? `<div class="date">${escape(letterDate)}</div>` : ""}
  ${recipientLines.length ? `<div class="recipient">${recipientLines.map(escape).join("<br />")}</div>` : ""}
</div>
<p class="greeting">${escape(letterGreeting(letter))}</p>
${toParagraphs(letter.body).map((p) => `<p class="para">${escape(p)}</p>`).join("\n")}
<div class="signoff">
  <div class="closing">${escape(letterClosing(letter))}</div>
  <div class="signature">${escape(letterSenderName(letter))}</div>
</div>
</body>
</html>`;
};
