import {
  buildResumeStyle,
  ContactLine,
  ResumePage,
  RText,
  Rule,
} from "@/components/resume/primitives/resume-primitives";
import { contactItems, fullName } from "@/components/resume/primitives/resume-sections";
import {
  formatLetterDate,
  letterClosing,
  letterGreeting,
  letterRecipientLines,
  letterSenderName,
  toParagraphs,
} from "@/utils/cover-letter";
import { View } from "react-native";
import { CoverLetter } from "../../../types/cover-letter";
import { AnyTemplate } from "../../../types/resume/template";

/*
  Only the fields that appear on the page. Typed as a slice of CoverLetter so
  the editor can render an unsaved draft straight from its form values.
*/
export type LetterPageContent = Pick<
  CoverLetter,
  | "personalInfo"
  | "company"
  | "role"
  | "recipientName"
  | "recipientTitle"
  | "companyAddress"
  | "body"
  | "closing"
  | "letterDate"
>;

interface Props {
  letter: LetterPageContent;
  template: AnyTemplate;
  isThumbnail?: boolean;
}

/*
  The letter as a printed page. Never AppText — that resolves to the
  theme-adaptive text-foreground and would turn the body copy white the moment
  the app switched to dark mode. RText takes an explicit colour, and the page
  paints its own white background.

  Header treatments mirror buildDocumentHeader in the HTML builder, which is
  what makes a letter and its resume look like a pair.
*/
export const LetterPage = function ({ letter, template, isThumbnail }: Props) {
  const style = buildResumeStyle(template.theme, isThumbnail);
  const resumeShapedData = { personalInfo: letter.personalInfo ?? undefined };

  const layout = template.layoutKey;
  const isBanner = layout === "MODERN_BANNER";
  const isCentred =
    layout === "ATS_CLEAN" ||
    layout === "PROFESSIONAL_CLASSIC" ||
    layout === "EXECUTIVE_FORMAL";

  const name = fullName(resumeShapedData);
  const title = letter.personalInfo?.title;
  const recipientLines = letterRecipientLines(letter);
  const letterDate = formatLetterDate(letter.letterDate);

  const header = (
    <View
      style={{
        alignItems: isCentred ? "center" : "flex-start",
        marginBottom: style.px(10),
        ...(isBanner && {
          backgroundColor: template.theme.primaryColor,
          margin: -style.px(38),
          marginBottom: style.gap,
          padding: style.px(20),
        }),
      }}
    >
      <RText
        size={style.px(24)}
        color={isBanner ? "#FFFFFF" : style.heading}
        weight="bold"
        spacingPx={style.px(0.5)}
      >
        {name}
      </RText>

      {!!title && (
        <RText
          size={style.px(12)}
          color={isBanner ? "#FFFFFF" : layout === "ATS_CLEAN" ? style.muted : style.accent}
          weight="medium"
          style={{ marginTop: style.px(2) }}
        >
          {title}
        </RText>
      )}

      <ContactLine items={contactItems(resumeShapedData)} style={style} />
    </View>
  );

  return (
    <ResumePage style={style}>
      {header}
      {isCentred && <Rule style={style} />}

      <View style={{ marginTop: style.px(14), marginBottom: style.gap }}>
        {!!letterDate && (
          <RText size={style.px(10)} color={style.muted}>
            {letterDate}
          </RText>
        )}

        {recipientLines.length > 0 && (
          <View style={{ marginTop: style.px(12) }}>
            {recipientLines.map((line, index) => (
              <RText
                key={`${line}-${index}`}
                size={style.px(11)}
                color={style.text}
                style={{ lineHeight: style.px(16) }}
              >
                {line}
              </RText>
            ))}
          </View>
        )}
      </View>

      <RText
        size={style.px(11.5)}
        color={style.accent}
        weight="semibold"
        style={{ marginBottom: style.px(12) }}
      >
        {letterGreeting(letter)}
      </RText>

      {toParagraphs(letter.body).map((paragraph, index) => (
        <RText
          key={index}
          size={style.px(11)}
          color={style.text}
          style={{ marginBottom: style.px(11), lineHeight: style.px(16) }}
        >
          {paragraph}
        </RText>
      ))}

      <View style={{ marginTop: style.gap }}>
        <RText size={style.px(11)} color={style.text}>
          {letterClosing(letter)}
        </RText>
        <RText
          size={style.px(11)}
          color={style.text}
          weight="bold"
          style={{ marginTop: style.px(26) }}
        >
          {letterSenderName(letter)}
        </RText>
      </View>
    </ResumePage>
  );
};
