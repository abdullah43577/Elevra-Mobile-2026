import { View } from "react-native";
import { ResumeLayoutProps } from "../../../../types/resume/layouts/types";
import {
  buildResumeStyle,
  ContactLine,
  ResumePage,
  RText,
} from "../primitives/resume-primitives";
import { contactItems, fullName, ResumeBody } from "../primitives/resume-sections";

/*
  A vertical accent rule runs down the content column. It is decoration on the
  page margin only — the content itself stays a single uninterrupted column, so
  reading order is unaffected.
*/
export function TimelineAccentLayout({ theme, data, isThumbnail }: ResumeLayoutProps) {
  const style = buildResumeStyle(theme, isThumbnail);

  return (
    <ResumePage style={style}>
      <View style={{ marginBottom: style.gap }}>
        <RText size={style.px(25)} color={style.heading} weight="bold">
          {fullName(data)}
        </RText>
        {!!data.personalInfo?.title && (
          <RText size={style.px(12)} color={style.muted} weight="medium" style={{ marginTop: style.px(2) }}>
            {data.personalInfo.title}
          </RText>
        )}
        <ContactLine items={contactItems(data)} style={style} align="left" />
      </View>

      <View style={{ flexDirection: "row" }}>
        <View style={{ width: style.px(3), backgroundColor: style.accent, marginRight: style.px(16) }} />
        <View style={{ flex: 1 }}>
          <ResumeBody data={data} style={style} variant="plain" limit={isThumbnail} />
        </View>
      </View>
    </ResumePage>
  );
}
