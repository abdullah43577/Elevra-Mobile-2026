import { AppText } from "@/components/shared/app-text";
import { View } from "react-native";
import { MinimalCompactLayoutProps } from "../../../types/resume/layouts/types";

// Small text-based glyphs — avoids pulling in an icon library just for this;
// swap for lucide-react-native icons later if you want something more polished.
const ICONS = {
  email: "✉",
  phone: "☎",
  location: "📍",
};

export function MinimalCompactLayout({
  theme,
  data,
  isThumbnail = false,
}: MinimalCompactLayoutProps) {
  const { personalInfo, experience, education, skills } = data;

  const Divider = () =>
    theme.showDividers ? (
      <View
        style={{
          height: 1,
          backgroundColor: "#E5E7EB",
          marginTop: isThumbnail ? 4 : 8,
          marginBottom: isThumbnail ? 4 : 8,
        }}
      />
    ) : null;

  return (
    <View className={isThumbnail ? "px-3 py-3" : "px-6 py-6"}>
      {/* Header — left-aligned, no ornamentation */}
      <View className={isThumbnail ? "mb-1.5" : "mb-3"}>
        <AppText
          className={
            isThumbnail
              ? "font-bricolage-bold text-sm"
              : "font-bricolage-bold text-xl"
          }
          style={{ color: theme.primaryColor }}
        >
          {personalInfo?.firstName} {personalInfo?.lastName}
        </AppText>
        {personalInfo?.title && (
          <AppText
            className={
              isThumbnail ? "text-[9px] text-gray-500" : "text-sm text-gray-500"
            }
          >
            {personalInfo.title}
          </AppText>
        )}
        <View
          className={
            isThumbnail
              ? "mt-0.5 flex-row flex-wrap gap-2"
              : "mt-1 flex-row flex-wrap gap-3"
          }
        >
          {personalInfo?.email && (
            <ContactLine
              icon={theme.useIcons ? ICONS.email : undefined}
              text={personalInfo.email}
              isThumbnail={isThumbnail}
            />
          )}
          {personalInfo?.phone && (
            <ContactLine
              icon={theme.useIcons ? ICONS.phone : undefined}
              text={personalInfo.phone}
              isThumbnail={isThumbnail}
            />
          )}
          {personalInfo?.location && (
            <ContactLine
              icon={theme.useIcons ? ICONS.location : undefined}
              text={personalInfo.location}
              isThumbnail={isThumbnail}
            />
          )}
        </View>
      </View>

      <Divider />

      {personalInfo?.summary && (
        <>
          <View className={isThumbnail ? "mb-1.5" : "mb-3"}>
            <AppText
              className={
                isThumbnail
                  ? "text-[9px] text-gray-700"
                  : "text-sm text-gray-700"
              }
            >
              {personalInfo.summary}
            </AppText>
          </View>
          <Divider />
        </>
      )}

      {experience && experience.length > 0 && (
        <>
          <View className={isThumbnail ? "mb-1.5" : "mb-3"}>
            <SectionLabel
              text="Experience"
              color={theme.primaryColor}
              isThumbnail={isThumbnail}
            />
            {(isThumbnail ? experience.slice(0, 1) : experience).map(
              (exp, i) => (
                <View key={i} className={isThumbnail ? "mt-0.5" : "mt-1.5"}>
                  <View className="flex-row justify-between">
                    <AppText
                      className={
                        isThumbnail
                          ? "font-bricolage-semibold text-[9px] text-gray-900"
                          : "font-bricolage-semibold text-sm text-gray-900"
                      }
                    >
                      {exp.position} · {exp.company}
                    </AppText>
                    <AppText
                      className={
                        isThumbnail
                          ? "text-[8px] text-gray-400"
                          : "text-xs text-gray-400"
                      }
                    >
                      {exp.startDate}–{exp.endDate ?? "Present"}
                    </AppText>
                  </View>
                  {!isThumbnail && exp.description && (
                    <AppText className="mt-0.5 text-sm text-gray-600">
                      {exp.description}
                    </AppText>
                  )}
                </View>
              ),
            )}
          </View>
          <Divider />
        </>
      )}

      {!isThumbnail && education && education.length > 0 && (
        <>
          <View className="mb-3">
            <SectionLabel text="Education" color={theme.primaryColor} />
            {education.map((edu, i) => (
              <View key={i} className="mt-1.5 flex-row justify-between">
                <AppText className="font-bricolage-semibold text-sm text-gray-900">
                  {edu.degree} · {edu.school}
                </AppText>
                <AppText className="text-xs text-gray-400">
                  {edu.startDate}–{edu.endDate ?? "Present"}
                </AppText>
              </View>
            ))}
          </View>
          <Divider />
        </>
      )}

      {skills && skills.length > 0 && (
        <View>
          <SectionLabel
            text="Skills"
            color={theme.primaryColor}
            isThumbnail={isThumbnail}
          />
          <AppText
            className={
              isThumbnail
                ? "mt-0.5 text-[9px] text-gray-600"
                : "mt-1 text-sm text-gray-600"
            }
          >
            {(isThumbnail ? skills.slice(0, 5) : skills)
              .map((s) => s.name)
              .join(" · ")}
          </AppText>
        </View>
      )}
    </View>
  );
}

function ContactLine({
  icon,
  text,
  isThumbnail,
}: {
  icon?: string;
  text: string;
  isThumbnail?: boolean;
}) {
  return (
    <AppText
      className={
        isThumbnail ? "text-[8px] text-gray-500" : "text-xs text-gray-500"
      }
    >
      {icon ? `${icon} ` : ""}
      {text}
    </AppText>
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
          ? "font-bricolage-bold text-[9px] uppercase tracking-wide"
          : "font-bricolage-bold text-xs uppercase tracking-wide"
      }
      style={{ color }}
    >
      {text}
    </AppText>
  );
}
