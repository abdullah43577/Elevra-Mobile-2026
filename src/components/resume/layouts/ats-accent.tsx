import { View } from "react-native";
import { ResumeLayoutProps } from "../../../../types/resume/layouts/types";
import {
  buildResumeStyle,
  ContactLine,
  ResumePage,
  RText,
} from "../primitives/resume-primitives";
import { contactItems, fullName, ResumeBody } from "../primitives/resume-sections";

// Left-aligned header with an accent rule under each section title.
export function AtsAccentLayout({ theme, data, isThumbnail }: ResumeLayoutProps) {
  const style = buildResumeStyle(theme, isThumbnail);

  return (
    <ResumePage style={style}>
      <View style={{ marginBottom: style.gap }}>
        <RText size={style.px(26)} color={style.heading} weight="bold">
          {fullName(data)}
        </RText>
        {!!data.personalInfo?.title && (
          <RText size={style.px(12)} color={style.accent} weight="semibold" style={{ marginTop: style.px(2) }}>
            {data.personalInfo.title}
          </RText>
        )}
        <ContactLine items={contactItems(data)} style={style} align="left" />
      </View>

      <ResumeBody data={data} style={style} variant="rule" limit={isThumbnail} />
    </ResumePage>
  );
}
