import { z } from "zod";

// Personal Info
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
});

// Experience
export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
});

// Education
export const educationSchema = z.object({
  school: z.string().min(1, "School is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  gpa: z.string().optional(),
});

// Skills
export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
});

// Languages
export const languageSchema = z.object({
  name: z.string().min(1, "Language name is required"),
  proficiency: z
    .enum(["basic", "conversational", "professional", "native"])
    .optional(),
});

// Certifications
export const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().optional(),
  expiry: z.string().optional(),
});

// Projects
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  url: z.string().url().optional(),
  technologies: z.array(z.string()).optional(),
});

// References
export const referenceSchema = z.object({
  name: z.string().min(1, "Reference name is required"),
  position: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

// Complete Resume Schema
export const resumeBuilderSchema = z.object({
  personalInfo: personalInfoSchema.optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  languages: z.array(languageSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  projects: z.array(projectSchema).optional(),
  references: z.array(referenceSchema).optional(),
});

export type ResumeBuilderFormValues = z.infer<typeof resumeBuilderSchema>;

// Default values
export const DEFAULT_EXPERIENCE = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  achievements: [],
};

export const DEFAULT_EDUCATION = {
  school: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  current: false,
  gpa: "",
};

export const DEFAULT_SKILL = {
  name: "",
  level: undefined,
};

export const DEFAULT_LANGUAGE = {
  name: "",
  proficiency: undefined,
};

export const DEFAULT_CERTIFICATION = {
  name: "",
  issuer: "",
  date: "",
  expiry: "",
};

export const DEFAULT_PROJECT = {
  name: "",
  description: "",
  url: "",
  technologies: [],
};

export const DEFAULT_REFERENCE = {
  name: "",
  position: "",
  company: "",
  email: "",
  phone: "",
};
