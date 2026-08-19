import { View } from "react-native";
import { ResumeData } from "../../../../types/resume/data";
import {
  Bullets,
  Entry,
  InlineList,
  Paragraph,
  ResumeStyle,
  RText,
  Section,
} from "./resume-primitives";

export type SectionVariant = "rule" | "plain" | "boxed";

const dateRange = function (start?: string, end?: string, current?: boolean) {
  if (!start) return current ? "Present" : "";
  return `${start} – ${current ? "Present" : (end ?? "Present")}`;
};

const toBullets = function (description?: string, achievements?: string[]) {
  const fromAchievements = (achievements ?? []).map((a) => a.trim()).filter(Boolean);
  if (fromAchievements.length > 0) return fromAchievements;

  // A multi-line description is already a bullet list in spirit.
  return (description ?? "")
    .split(/\n+/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
};

/*
  Every layout renders its body through this. Section wording and ordering are
  the conventional ones parsers expect, and no layout is allowed to reorder or
  rename them — the visual difference between templates lives in the header and
  the section-title treatment, never in the content structure.

  Empty sections are dropped entirely rather than rendered as a bare heading.

  Every entry renders, always. This used to slice five sections to the first two
  whenever `limit` was set, which every layout wired to `isThumbnail` — and
  `TemplatePreview` sets that unconditionally, including for the builder's live
  preview of real data. So a third job silently vanished from the preview while
  exporting correctly, because `resume-html.ts` never had the cap. The number
  two was not a template's capacity; it is how many experience entries the one
  shared sample dataset happens to carry.
*/
export const ResumeBody = function ({
  data,
  style,
  variant = "rule",
}: {
  data: ResumeData;
  style: ResumeStyle;
  variant?: SectionVariant;
}) {
  const experience = (data.experience ?? []).filter((e) => e.position || e.company);
  const education = (data.education ?? []).filter((e) => e.school || e.degree);
  const skills = (data.skills ?? []).map((s) => s.name).filter(Boolean);
  const certifications = (data.certifications ?? []).filter((c) => c.name);
  const projects = (data.projects ?? []).filter((p) => p.name);
  const languages = (data.languages ?? []).filter((l) => l.name);
  const references = (data.references ?? []).filter((r) => r.name);

  return (
    <View>
      {!!data.personalInfo?.summary && (
        <Section label="Summary" style={style} variant={variant}>
          <RText size={style.px(11)} color={style.text}>
            {data.personalInfo.summary}
          </RText>
        </Section>
      )}

      {experience.length > 0 && (
        <Section label="Experience" style={style} variant={variant}>
          {experience.map((item, index) => (
            <Entry
              key={index}
              title={item.position}
              organisation={item.company}
              dates={dateRange(item.startDate, item.endDate, item.current)}
              style={style}
            >
              <Bullets items={toBullets(item.description, item.achievements)} style={style} />
            </Entry>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section label="Education" style={style} variant={variant}>
          {education.map((item, index) => (
            <Entry
              key={index}
              title={[item.degree, item.field].filter(Boolean).join(", ")}
              organisation={item.school}
              dates={dateRange(item.startDate, item.endDate, item.current)}
              {...(item.gpa && { meta: `GPA ${item.gpa}` })}
              style={style}
            />
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section label="Skills" style={style} variant={variant}>
          <InlineList items={skills} style={style} />
        </Section>
      )}

      {projects.length > 0 && (
        <Section label="Projects" style={style} variant={variant}>
          {projects.map((item, index) => (
            <Entry
              key={index}
              title={item.name}
              {...(item.technologies?.length && { organisation: item.technologies.join(", ") })}
              style={style}
            >
              {!!item.description && <Paragraph text={item.description} style={style} />}
            </Entry>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section label="Certifications" style={style} variant={variant}>
          {certifications.map((item, index) => (
            <Entry
              key={index}
              title={item.name}
              {...(item.issuer && { organisation: item.issuer })}
              {...(item.date && { dates: item.date })}
              style={style}
            />
          ))}
        </Section>
      )}

      {languages.length > 0 && (
        <Section label="Languages" style={style} variant={variant}>
          <InlineList
            items={languages.map((l) =>
              l.proficiency ? `${l.name} (${l.proficiency})` : l.name,
            )}
            style={style}
          />
        </Section>
      )}

      {references.length > 0 && (
        <Section label="References" style={style} variant={variant}>
          {references.map((item, index) => (
            <Entry
              key={index}
              title={item.name}
              {...(item.company && { organisation: [item.position, item.company].filter(Boolean).join(", ") })}
              {...(item.email && { dates: item.email })}
              style={style}
            />
          ))}
        </Section>
      )}
    </View>
  );
};

export const fullName = function (data: ResumeData) {
  return [data.personalInfo?.firstName, data.personalInfo?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
};

export const contactItems = function (data: ResumeData) {
  return [
    data.personalInfo?.email,
    data.personalInfo?.phone,
    data.personalInfo?.location,
  ];
};
