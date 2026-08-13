import { AppText } from "@/components/shared/app-text";
import { View } from "react-native";
import { ExecutiveFormalLayoutProps } from "../../../types/resume/layouts/types";

export function ExecutiveFormalLayout({
  theme,
  data,
  isThumbnail = false,
}: ExecutiveFormalLayoutProps) {
  const {
    personalInfo,
    experience,
    education,
    skills,
    certifications,
    references,
  } = data;
  const gold = theme.goldAccent ?? "#C9A84C";

  // theme.useSerifFont only flips a font weight/letter-spacing treatment here since
  // RN doesn't ship serif fonts by default — actual font family still comes from theme.fontFamily
  // via your app-wide font loader, this is just an additional formatting nudge.
  const headingStyle = theme.useSerifFont ? { letterSpacing: 0.5 } : {};

  return (
    <View className={isThumbnail ? "px-3 py-4" : "px-8 py-10"}>
      {/* Header — centered, formal */}
      <View className="items-center">
        <AppText
          className={
            isThumbnail
              ? "font-bricolage-bold text-sm"
              : "font-bricolage-bold text-2xl"
          }
          style={{ color: theme.primaryColor, ...headingStyle }}
        >
          {personalInfo?.firstName?.toUpperCase()}{" "}
          {personalInfo?.lastName?.toUpperCase()}
        </AppText>
        {personalInfo?.title && (
          <AppText
            className={
              isThumbnail
                ? "mt-0.5 text-[9px] text-gray-600"
                : "mt-1 text-base text-gray-600"
            }
          >
            {personalInfo.title}
          </AppText>
        )}
        <View
          className={
            isThumbnail
              ? "mt-1 flex-row flex-wrap justify-center gap-2"
              : "mt-2 flex-row flex-wrap justify-center gap-3"
          }
        >
          {[personalInfo?.email, personalInfo?.phone, personalInfo?.location]
            .filter(Boolean)
            .map((item, i) => (
              <AppText
                key={i}
                className={
                  isThumbnail
                    ? "text-[7px] text-gray-500"
                    : "text-xs text-gray-500"
                }
              >
                {item}
              </AppText>
            ))}
        </View>

        {/* Gold divider — the signature mark of this layout */}
        <View
          style={{
            width: isThumbnail ? 40 : 80,
            height: 2,
            backgroundColor: gold,
            marginTop: isThumbnail ? 6 : 14,
            marginBottom: isThumbnail ? 6 : 14,
          }}
        />
      </View>

      {personalInfo?.summary && (
        <View className={isThumbnail ? "mb-2" : "mb-5"}>
          <SectionLabel
            text="Executive Summary"
            gold={gold}
            isThumbnail={isThumbnail}
          />
          <AppText
            className={
              isThumbnail
                ? "mt-0.5 text-center text-[8px] text-gray-700"
                : "mt-1 text-center text-sm text-gray-700"
            }
          >
            {personalInfo.summary}
          </AppText>
        </View>
      )}

      {experience && experience.length > 0 && (
        <View className={isThumbnail ? "mb-2" : "mb-5"}>
          <SectionLabel
            text="Leadership Experience"
            gold={gold}
            isThumbnail={isThumbnail}
          />
          {(isThumbnail ? experience.slice(0, 1) : experience).map((exp, i) => (
            <View key={i} className={isThumbnail ? "mt-1" : "mt-2"}>
              <View className="flex-row justify-between">
                <AppText
                  className={
                    isThumbnail
                      ? "font-bricolage-semibold text-[9px] text-gray-900"
                      : "font-bricolage-semibold text-gray-900"
                  }
                >
                  {exp.position}
                </AppText>
                <AppText
                  className={
                    isThumbnail
                      ? "text-[7px] text-gray-500"
                      : "text-xs text-gray-500"
                  }
                >
                  {exp.startDate} – {exp.endDate ?? "Present"}
                </AppText>
              </View>
              <AppText
                className={
                  isThumbnail
                    ? "text-[8px] text-gray-600"
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
                    {exp.achievements.map((a, ai) => (
                      <AppText key={ai} className="ml-2 text-sm text-gray-600">
                        • {a}
                      </AppText>
                    ))}
                  </View>
                )}
            </View>
          ))}
        </View>
      )}

      {!isThumbnail && education && education.length > 0 && (
        <View className="mb-5">
          <SectionLabel text="Education" gold={gold} />
          {education.map((edu, i) => (
            <View key={i} className="mt-2 flex-row justify-between">
              <View>
                <AppText className="font-bricolage-semibold text-gray-900">
                  {edu.degree}
                </AppText>
                <AppText className="text-sm text-gray-600">
                  {edu.school}
                </AppText>
              </View>
              <AppText className="text-xs text-gray-500">
                {edu.startDate} – {edu.endDate ?? "Present"}
              </AppText>
            </View>
          ))}
        </View>
      )}

      {skills && skills.length > 0 && (
        <View className={isThumbnail ? "mb-2" : "mb-5"}>
          <SectionLabel
            text="Core Competencies"
            gold={gold}
            isThumbnail={isThumbnail}
          />
          <View
            className={
              isThumbnail
                ? "mt-1 flex-row flex-wrap justify-center gap-1"
                : "mt-2 flex-row flex-wrap justify-center gap-2"
            }
          >
            {(isThumbnail ? skills.slice(0, 4) : skills).map((skill, i) => (
              <View
                key={i}
                style={{ borderWidth: 1, borderColor: gold }}
                className={
                  isThumbnail ? "rounded px-1.5 py-0.5" : "rounded px-3 py-1"
                }
              >
                <AppText
                  className={
                    isThumbnail
                      ? "text-[7px] text-gray-700"
                      : "text-xs text-gray-700"
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
        <View className="mb-5">
          <SectionLabel text="Certifications" gold={gold} />
          {certifications.map((cert, i) => (
            <AppText key={i} className="mt-1 text-center text-sm text-gray-700">
              {cert.name} — {cert.issuer}
            </AppText>
          ))}
        </View>
      )}

      {/* Awards — only rendered when theme.showAwards is true, and only if data has it.
          Note: ResumeData doesn't currently have an `awards` field based on what we've
          defined so far — this reads from certifications as a stand-in unless you add
          a dedicated awards array. Flagging rather than guessing at a shape. */}
      {!isThumbnail && theme.showAwards && (
        <View className="mb-5">
          <SectionLabel text="Honors & Awards" gold={gold} />
          <AppText className="mt-1 text-center text-sm italic text-gray-500">
            {/* placeholder — wire to data.awards once that field exists on ResumeData */}
            No awards listed
          </AppText>
        </View>
      )}

      {!isThumbnail && references && references.length > 0 && (
        <View>
          <SectionLabel text="References" gold={gold} />
          {references.map((ref, i) => (
            <View key={i} className="mt-1.5 items-center">
              <AppText className="font-bricolage-semibold text-sm text-gray-900">
                {ref.name}
              </AppText>
              <AppText className="text-xs text-gray-500">
                {ref.position} at {ref.company}
              </AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function SectionLabel({
  text,
  gold,
  isThumbnail,
}: {
  text: string;
  gold: string;
  isThumbnail?: boolean;
}) {
  return (
    <AppText
      className={
        isThumbnail
          ? "font-bricolage-bold text-center text-[9px] uppercase tracking-widest"
          : "font-bricolage-bold text-center text-sm uppercase tracking-widest"
      }
      style={{ color: gold }}
    >
      {text}
    </AppText>
  );
}
