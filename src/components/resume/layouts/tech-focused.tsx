import { View } from "react-native";
import { ResumeLayoutProps } from "../../../../types/resume/layouts/types";
import {
  buildResumeStyle,
  ContactLine,
  InlineList,
  ResumePage,
  RText,
  Section,
} from "../primitives/resume-primitives";
import { contactItems, fullName, ResumeBody } from "../primitives/resume-sections";

export function TechFocusedLayout({ theme, data, isThumbnail }: ResumeLayoutProps) {
  const style = buildResumeStyle(theme, isThumbnail);
  const skills = (data.skills ?? []).map((s) => s.name).filter(Boolean);

  return (
    <ResumePage style={style}>
      <View style={{ marginBottom: style.px(12) }}>
        <RText size={style.px(25)} color={style.heading} weight="bold">
          {fullName(data)}
        </RText>
        {!!data.personalInfo?.title && (
          <RText size={style.px(12)} color={style.accent} weight="semibold" style={{ marginTop: style.px(2) }}>
            {data.personalInfo.title}
          </RText>
        )}
        <ContactLine items={contactItems(data)} style={style} align="left" />
      </View>

      {skills.length > 0 && (
        <Section label="Core Skills" style={style} variant="boxed">
          <InlineList items={skills} style={style} />
        </Section>
      )}

      <ResumeBody data={data} style={style} variant="boxed" />
    </ResumePage>
  );
}
