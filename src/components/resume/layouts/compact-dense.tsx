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

// Tight spacing for people with enough history to fill two pages otherwise.
export function CompactDenseLayout({ theme, data, isThumbnail }: ResumeLayoutProps) {
  const style = buildResumeStyle(theme, isThumbnail);

  return (
    <ResumePage style={style} padding={style.px(30)}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: style.px(8) }}>
        <View style={{ flex: 1, paddingRight: style.px(10) }}>
          <RText size={style.px(22)} color={style.heading} weight="bold">
            {fullName(data)}
          </RText>
          {!!data.personalInfo?.title && (
            <RText size={style.px(11)} color={style.accent} weight="semibold">
              {data.personalInfo.title}
            </RText>
          )}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          {contactItems(data).filter(Boolean).map((item, index) => (
            <RText key={index} size={style.px(9)} color={style.muted}>
              {item as string}
            </RText>
          ))}
        </View>
      </View>

      <Rule style={style} color={style.accent} />

      <ResumeBody data={data} style={style} variant="plain" limit={isThumbnail} />
    </ResumePage>
  );
}
