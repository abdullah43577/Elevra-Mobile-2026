import { AppText } from "@/components/shared/app-text";
import { View } from "react-native";
import { ProfessionalClassicLayoutProps } from "../../../types/resume/layouts/types";

export function ProfessionalClassicLayout({
  theme,
  data,
  isThumbnail = false,
}: ProfessionalClassicLayoutProps) {
  const { personalInfo, experience, education, skills, certifications } = data;
  const accent = theme.accentColor ?? theme.primaryColor;

  const sectionSpacing = isThumbnail
    ? "mb-2"
    : theme.spacing === "SPACIOUS"
      ? "mb-6"
      : theme.spacing === "COMPACT"
        ? "mb-3"
        : "mb-5";
  const borderStyle = theme.showBorders
    ? {
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingBottom: isThumbnail ? 6 : 12,
      }
    : {};

  return (
    <View className={isThumbnail ? "px-3 py-4" : "px-8 py-8"}>
      {/* Header — centered, classic style */}
      <View className={`items-center ${sectionSpacing}`} style={borderStyle}>
        <AppText
          className={
            isThumbnail
              ? "font-bricolage-bold text-base"
              : "font-bricolage-bold text-2xl"
          }
          style={{ color: theme.primaryColor }}
        >
          {personalInfo?.firstName} {personalInfo?.lastName}
        </AppText>
        {personalInfo?.title && (
          <AppText
            className={
              isThumbnail
                ? "text-[10px] text-gray-600"
                : "mt-0.5 text-base text-gray-600"
            }
          >
            {personalInfo.title}
          </AppText>
        )}
        <View className="mt-1 flex-row flex-wrap justify-center gap-2">
          {[personalInfo?.email, personalInfo?.phone, personalInfo?.location]
            .filter(Boolean)
            .map((item, i) => (
              <AppText
                key={i}
                className={
                  isThumbnail
                    ? "text-[8px] text-gray-500"
                    : "text-xs text-gray-500"
                }
              >
                {item}
              </AppText>
            ))}
        </View>
      </View>

      {personalInfo?.summary && (
        <View className={sectionSpacing} style={borderStyle}>
          <SectionLabel
            text="Professional Summary"
            color={accent}
            isThumbnail={isThumbnail}
          />
          <AppText
            className={
              isThumbnail
                ? "mt-0.5 text-[9px] text-gray-700"
                : "mt-1 text-sm text-gray-700"
            }
          >
            {personalInfo.summary}
          </AppText>
        </View>
      )}

      {experience && experience.length > 0 && (
        <View className={sectionSpacing} style={borderStyle}>
          <SectionLabel
            text="Work Experience"
            color={accent}
            isThumbnail={isThumbnail}
          />
          {(isThumbnail ? experience.slice(0, 1) : experience).map((exp, i) => (
            <View key={i} className={isThumbnail ? "mt-1" : "mt-2"}>
              <View className="flex-row justify-between">
                <AppText
                  className={
                    isThumbnail
                      ? "font-bricolage-semibold text-[10px] text-gray-900"
                      : "font-bricolage-semibold text-gray-900"
                  }
                >
                  {exp.position}
                </AppText>
                <AppText
                  className={
                    isThumbnail
                      ? "text-[8px] text-gray-500"
                      : "text-xs text-gray-500"
                  }
                >
                  {exp.startDate} – {exp.endDate ?? "Present"}
                </AppText>
              </View>
              <AppText
                className={
                  isThumbnail
                    ? "text-[9px] text-gray-600"
                    : "text-sm text-gray-600"
                }
              >
                {exp.company}
              </AppText>
              {!isThumbnail && exp.description && (
                <AppText className="mt-1 text-sm text-gray-700">
                  {exp.description}
                </AppText>
              )}
              {!isThumbnail &&
                exp.achievements &&
                exp.achievements.length > 0 && (
                  <View className="mt-1">
                    {exp.achievements.map((achievement, ai) => (
                      <AppText key={ai} className="ml-2 text-sm text-gray-600">
                        • {achievement}
                      </AppText>
                    ))}
                  </View>
                )}
            </View>
          ))}
        </View>
      )}

      {!isThumbnail && education && education.length > 0 && (
        <View className={sectionSpacing} style={borderStyle}>
          <SectionLabel text="Education" color={accent} />
          {education.map((edu, i) => (
            <View key={i} className="mt-2">
              <View className="flex-row justify-between">
                <AppText className="font-bricolage-semibold text-gray-900">
                  {edu.degree}
                </AppText>
                <AppText className="text-xs text-gray-500">
                  {edu.startDate} – {edu.endDate ?? "Present"}
                </AppText>
              </View>
              <AppText className="text-sm text-gray-600">{edu.school}</AppText>
              {edu.field && (
                <AppText className="text-xs text-gray-500">{edu.field}</AppText>
              )}
            </View>
          ))}
        </View>
      )}

      {skills && skills.length > 0 && (
        <View className={sectionSpacing} style={borderStyle}>
          <SectionLabel
            text="Skills"
            color={accent}
            isThumbnail={isThumbnail}
          />
          <View
            className={
              isThumbnail
                ? "mt-1 flex-row flex-wrap gap-1"
                : "mt-1.5 flex-row flex-wrap gap-2"
            }
          >
            {(isThumbnail ? skills.slice(0, 4) : skills).map((skill, i) => (
              <View
                key={i}
                className={
                  isThumbnail
                    ? "rounded-full bg-gray-100 px-2 py-0.5"
                    : "rounded-full bg-gray-100 px-3 py-1"
                }
              >
                <AppText
                  className={
                    isThumbnail
                      ? "text-[8px] text-gray-700"
                      : "text-sm text-gray-700"
                  }
                >
                  {skill.name}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      )}

      {!isThumbnail && certifications && certifications.length > 0 && (
        <View className={sectionSpacing}>
          <SectionLabel text="Certifications" color={accent} />
          {certifications.map((cert, i) => (
            <AppText key={i} className="mt-1 text-sm text-gray-700">
              {cert.name} — {cert.issuer}
            </AppText>
          ))}
        </View>
      )}
    </View>
  );
}

function SectionLabel({
  text,
  color,
  isThumbnail,
}: {
  text: string;
  color: string;
  isThumbnail?: boolean;
}) {
  return (
    <AppText
      className={
        isThumbnail
          ? "font-bricolage-bold text-[10px] uppercase tracking-wide"
          : "font-bricolage-bold text-base uppercase tracking-wide"
      }
      style={{ color }}
    >
      {text}
    </AppText>
  );
}
