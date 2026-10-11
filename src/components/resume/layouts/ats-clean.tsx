import { View } from "react-native";
import { ResumeLayoutProps } from "../../../../types/resume/layouts/types";
import {
  buildResumeStyle,
  ContactLine,
  ResumePage,
  RText,
  Rule,
} from "../primitives/resume-primitives";
import { contactItems, fullName, ResumeBody } from "../primitives/resume-sections";

export function AtsCleanLayout({ theme, data, isThumbnail }: ResumeLayoutProps) {
  const style = buildResumeStyle(theme, isThumbnail);

  return (
    <ResumePage style={style}>
      <View style={{ alignItems: "center", marginBottom: style.px(10) }}>
        <RText size={style.px(24)} color={style.heading} weight="bold" spacingPx={style.px(0.5)}>
          {fullName(data)}
        </RText>
        {!!data.personalInfo?.title && (
          <RText size={style.px(12)} color={style.muted} weight="medium" style={{ marginTop: style.px(2) }}>
            {data.personalInfo.title}
          </RText>
        )}
        <ContactLine items={contactItems(data)} style={style} />
      </View>

      <Rule style={style} />

      <ResumeBody data={data} style={style} variant="plain" />
    </ResumePage>
  );
}
