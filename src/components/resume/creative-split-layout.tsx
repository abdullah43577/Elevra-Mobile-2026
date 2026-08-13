import { AppText } from "@/components/shared/app-text";
import { View } from "react-native";
import { CreativeSplitLayoutProps } from "../../../types/resume/layouts/types";

export function CreativeSplitLayout({
  theme,
  data,
  isThumbnail = false,
}: CreativeSplitLayoutProps) {
  const { personalInfo, experience, education, skills, projects, languages } =
    data;

  const sidebarBg = theme.sidebarColor ?? theme.primaryColor;
  const sidebarText = theme.sidebarTextColor ?? "#FFFFFF";

  return (
    <View
      className="flex-row overflow-hidden rounded-lg bg-white"
      style={{ minHeight: isThumbnail ? undefined : "100%" }}
    >
      {/* Sidebar */}
      <View
        className={isThumbnail ? "w-[32%] px-3 py-4" : "w-[34%] px-5 py-8"}
        style={{ backgroundColor: sidebarBg }}
      >
        {/* Name block */}
        <AppText
          className={
            isThumbnail
              ? "font-bricolage-bold text-base"
              : "font-bricolage-bold text-xl"
          }
          style={{ color: sidebarText }}
        >
          {personalInfo?.firstName} {personalInfo?.lastName}
        </AppText>
        {personalInfo?.title && (
          <AppText
            className={isThumbnail ? "mt-0.5 text-[10px]" : "mt-1 text-sm"}
            style={{ color: sidebarText, opacity: 0.85 }}
          >
            {personalInfo.title}
          </AppText>
        )}

        {/* Contact */}
        {!isThumbnail &&
          (personalInfo?.email ||
            personalInfo?.phone ||
            personalInfo?.location) && (
            <View className="mt-6">
              <SidebarLabel text="Contact" color={sidebarText} />
              {personalInfo?.email && (
                <SidebarLine text={personalInfo.email} color={sidebarText} />
              )}
              {personalInfo?.phone && (
                <SidebarLine text={personalInfo.phone} color={sidebarText} />
              )}
              {personalInfo?.location && (
                <SidebarLine text={personalInfo.location} color={sidebarText} />
              )}
            </View>
          )}

        {/* Skills — pinned to sidebar, not main content, unlike the other layouts */}
        {skills && skills.length > 0 && (
          <View className={isThumbnail ? "mt-3" : "mt-6"}>
            <SidebarLabel
              text="Skills"
              color={sidebarText}
              isThumbnail={isThumbnail}
            />
            <View className="mt-1.5 gap-1">
              {(isThumbnail ? skills.slice(0, 4) : skills).map((skill, i) => (
                <SidebarLine
                  key={i}
                  text={skill.name}
                  color={sidebarText}
                  isThumbnail={isThumbnail}
                />
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {!isThumbnail && languages && languages.length > 0 && (
          <View className="mt-6">
            <SidebarLabel text="Languages" color={sidebarText} />
            <View className="mt-1.5 gap-1">
              {languages.map((lang, i) => (
                <SidebarLine
                  key={i}
                  text={`${lang.name} — ${lang.proficiency}`}
                  color={sidebarText}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Main content */}
      <View className={isThumbnail ? "flex-1 px-3 py-4" : "flex-1 px-6 py-8"}>
        {personalInfo?.summary && (
          <View className={isThumbnail ? "mb-2" : "mb-5"}>
            <MainLabel
              text="Profile"
              color={theme.accentColor ?? theme.primaryColor}
              isThumbnail={isThumbnail}
            />
            <AppText
              className={
                isThumbnail
                  ? "mt-0.5 text-[9px] text-gray-600"
                  : "mt-1 text-sm text-gray-700"
              }
            >
              {personalInfo.summary}
            </AppText>
          </View>
        )}

        {experience && experience.length > 0 && (
          <View className={isThumbnail ? "mb-2" : "mb-5"}>
            <MainLabel
              text="Experience"
              color={theme.accentColor ?? theme.primaryColor}
              isThumbnail={isThumbnail}
            />
            {(isThumbnail ? experience.slice(0, 1) : experience).map(
              (exp, i) => (
                <View key={i} className={isThumbnail ? "mt-1" : "mt-2"}>
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
                        ? "text-[9px] text-gray-500"
                        : "text-sm text-gray-500"
                    }
                  >
                    {exp.company} · {exp.startDate} – {exp.endDate ?? "Present"}
                  </AppText>
                  {!isThumbnail && exp.description && (
                    <AppText className="mt-1 text-sm text-gray-700">
                      {exp.description}
                    </AppText>
                  )}
                </View>
              ),
            )}
          </View>
        )}

        {!isThumbnail && education && education.length > 0 && (
          <View className="mb-5">
            <MainLabel
              text="Education"
              color={theme.accentColor ?? theme.primaryColor}
            />
            {education.map((edu, i) => (
              <View key={i} className="mt-2">
                <AppText className="font-bricolage-semibold text-gray-900">
                  {edu.degree}
                </AppText>
                <AppText className="text-sm text-gray-500">
                  {edu.school} · {edu.startDate} – {edu.endDate ?? "Present"}
                </AppText>
              </View>
            ))}
          </View>
        )}

        {!isThumbnail && projects && projects.length > 0 && (
          <View className="mb-5">
            <MainLabel
              text="Projects"
              color={theme.accentColor ?? theme.primaryColor}
            />
            {projects.map((proj, i) => (
              <View key={i} className="mt-2">
                <AppText className="font-bricolage-semibold text-gray-900">
                  {proj.name}
                </AppText>
                {proj.description && (
                  <AppText className="mt-0.5 text-sm text-gray-700">
                    {proj.description}
                  </AppText>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// ── small local helpers, kept in-file since they're only ever used here ──

function SidebarLabel({
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
          ? "font-bricolage-semibold text-[9px] uppercase tracking-wide"
          : "font-bricolage-semibold text-xs uppercase tracking-wide"
      }
      style={{ color, opacity: 0.7 }}
    >
      {text}
    </AppText>
  );
}

function SidebarLine({
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
      className={isThumbnail ? "text-[9px]" : "text-sm"}
      style={{ color, opacity: 0.9 }}
    >
      {text}
    </AppText>
  );
}

function MainLabel({
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
          : "font-bricolage-bold text-sm uppercase tracking-wide"
      }
      style={{ color }}
    >
      {text}
    </AppText>
  );
}
