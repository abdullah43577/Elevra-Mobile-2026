import { Certifications } from "@/components/resume-studio/resume-builder/certification";
import { Education } from "@/components/resume-studio/resume-builder/education";
import { Experience } from "@/components/resume-studio/resume-builder/experience";
import { Languages } from "@/components/resume-studio/resume-builder/languages";
import { PersonalInfo } from "@/components/resume-studio/resume-builder/personal-info";
import { Projects } from "@/components/resume-studio/resume-builder/projects";
import { References } from "@/components/resume-studio/resume-builder/references";
import { Skills } from "@/components/resume-studio/resume-builder/skills";
import { ResumeBuilderFormValues } from "@/schemas/resume-builder/resume-builder";
import { ReactNode } from "react";
import {
  Control,
  FieldErrors,
  UseFieldArrayReturn,
  UseFormSetValue,
} from "react-hook-form";
import { BuilderStep } from "./builder-steps";

type Arr<K extends "experience" | "education" | "skills" | "projects" | "certifications" | "languages" | "references"> =
  UseFieldArrayReturn<ResumeBuilderFormValues, K>;

interface Props {
  stepId: BuilderStep["id"];
  control: Control<ResumeBuilderFormValues>;
  errors: FieldErrors<ResumeBuilderFormValues>;
  setValue: UseFormSetValue<ResumeBuilderFormValues>;
  experience: Arr<"experience">;
  education: Arr<"education">;
  skills: Arr<"skills">;
  projects: Arr<"projects">;
  certifications: Arr<"certifications">;
  languages: Arr<"languages">;
  references: Arr<"references">;
  prefill?: ReactNode;
}

// Each field array is passed with its own key: a generic Record would erase the
// per-field typing and force `any`.
export const BuilderStepContent = function ({
  stepId,
  control,
  errors,
  setValue,
  experience,
  education,
  skills,
  projects,
  certifications,
  languages,
  references,
  prefill,
}: Props) {
  switch (stepId) {
    case "personalInfo":
      return (
        <>
          {prefill}
          <PersonalInfo control={control} errors={errors} />
        </>
      );

    case "experience":
      return (
        <Experience
          control={control}
          errors={errors}
          fields={experience.fields}
          append={experience.append}
          remove={experience.remove}
        />
      );

    case "education":
      return (
        <Education
          control={control}
          errors={errors}
          setValue={setValue}
          fields={education.fields}
          append={education.append}
          remove={education.remove}
        />
      );

    case "skills":
      return (
        <Skills
          control={control}
          errors={errors}
          fields={skills.fields}
          append={skills.append}
          remove={skills.remove}
        />
      );

    case "projects":
      return (
        <Projects
          control={control}
          errors={errors}
          fields={projects.fields}
          append={projects.append}
          remove={projects.remove}
        />
      );

    case "certifications":
      return (
        <Certifications
          control={control}
          errors={errors}
          fields={certifications.fields}
          append={certifications.append}
          remove={certifications.remove}
        />
      );

    case "languages":
      return (
        <Languages
          control={control}
          errors={errors}
          setValue={setValue}
          fields={languages.fields}
          append={languages.append}
          remove={languages.remove}
        />
      );

    case "references":
      return (
        <References
          control={control}
          errors={errors}
          fields={references.fields}
          append={references.append}
          remove={references.remove}
        />
      );

    default:
      return null;
  }
};
