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
  Full-width tinted header. The band is a background fill behind real text, not
  an image, so the name and contact details still extract cleanly.
*/
export function ModernBannerLayout({ theme, data, isThumbnail }: ResumeLayoutProps) {
  const style = buildResumeStyle(theme, isThumbnail);

  return (
    <View style={{ backgroundColor: "#FFFFFF" }}>
      <View
        style={{
          backgroundColor: style.heading,
          paddingHorizontal: style.px(38),
          paddingVertical: style.px(26),
        }}
      >
        <RText size={style.px(25)} color="#FFFFFF" weight="bold">
          {fullName(data)}
        </RText>
        {!!data.personalInfo?.title && (
          <RText size={style.px(12)} color="#FFFFFFCC" weight="medium" style={{ marginTop: style.px(2) }}>
            {data.personalInfo.title}
          </RText>
        )}
        <ContactLine items={contactItems(data)} style={style} color="#FFFFFFCC" align="left" />
      </View>

      <ResumePage style={style} padding={style.px(38)}>
        <ResumeBody data={data} style={style} variant="rule" />
      </ResumePage>
    </View>
  );
}
