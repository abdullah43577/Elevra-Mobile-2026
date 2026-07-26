export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  summary?: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
}

export interface Education {
  id?: string;
  school: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
}

export interface Skill {
  id?: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Language {
  id?: string;
  name: string;
  proficiency?: "basic" | "conversational" | "professional" | "native";
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  date?: string;
  expiry?: string;
}

export interface Project {
  id?: string;
  name: string;
  description?: string;
  url?: string;
  technologies?: string[];
}

export interface Reference {
  id?: string;
  name: string;
  position?: string;
  company?: string;
  email?: string;
  phone?: string;
}

export interface ResumeData {
  personalInfo?: PersonalInfo;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
  languages?: Language[];
  certifications?: Certification[];
  projects?: Project[];
  references?: Reference[];
  sectionOrder?: string[];
}
