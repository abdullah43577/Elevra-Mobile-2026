// ============================================
// Layout Keys
// ============================================

export type LayoutKey =
  // ATS-first set. All single-column; they differ in header and section-title
  // treatment only.
  | "ATS_CLEAN"
  | "ATS_ACCENT"
  | "MODERN_BANNER"
  | "COMPACT_DENSE"
  | "TIMELINE_ACCENT"
  | "TECH_FOCUSED"
  // Original four, kept so existing Resume rows still resolve. Deactivated in
  // the catalogue; do not build on them.
  | "PROFESSIONAL_CLASSIC"
  | "PROFESSIONAL_SLEEK"
  | "CREATIVE_SPLIT"
  | "MINIMAL_COMPACT"
  | "EXECUTIVE_FORMAL";

// ============================================
// Font Families
// ============================================

export type FontFamily =
  "INTER" | "ROBOTO" | "MERRIWEATHER" | "LORA" | "PLAYFAIR";

// ============================================
// Spacing Options
// ============================================

export type Spacing = "COMPACT" | "NORMAL" | "SPACIOUS";

// ============================================
// Base Theme
// ============================================

export interface BaseTheme {
  primaryColor: string;
  secondaryColor?: string;
  textColor: string;
  fontFamily: FontFamily;
  spacing: Spacing;
}

// ============================================
// Layout-Specific Themes
// ============================================

// Professional Classic Theme
export interface ProfessionalClassicTheme extends BaseTheme {
  accentColor?: string;
  showBorders: boolean;
}

// Professional Sleek Theme (same as Classic for now)
export interface ProfessionalSleekTheme extends BaseTheme {
  accentColor?: string;
  showBorders: boolean;
}

// Creative Split Theme
export interface CreativeSplitTheme extends BaseTheme {
  sidebarColor: string;
  sidebarTextColor: string;
  accentColor: string;
}

// Minimal Compact Theme
export interface MinimalCompactTheme extends BaseTheme {
  showDividers: boolean;
  useIcons: boolean;
}

// Executive Formal Theme
export interface ExecutiveFormalTheme extends BaseTheme {
  goldAccent?: string;
  showAwards: boolean;
  useSerifFont: boolean;
}

// ============================================
// Theme Mapping by Layout
// ============================================

// The ATS layouts all take the same theme shape — they vary in chrome, not in
// the knobs they expose. Only the original four need bespoke theme types.
export interface AtsTheme extends BaseTheme {
  accentColor?: string;
}

export interface ThemeByLayout {
  ATS_CLEAN: AtsTheme;
  ATS_ACCENT: AtsTheme;
  MODERN_BANNER: AtsTheme;
  COMPACT_DENSE: AtsTheme;
  TIMELINE_ACCENT: AtsTheme;
  TECH_FOCUSED: AtsTheme;
  PROFESSIONAL_CLASSIC: ProfessionalClassicTheme;
  PROFESSIONAL_SLEEK: ProfessionalSleekTheme;
  CREATIVE_SPLIT: CreativeSplitTheme;
  MINIMAL_COMPACT: MinimalCompactTheme;
  EXECUTIVE_FORMAL: ExecutiveFormalTheme;
}

// ============================================
// Helper Types
// ============================================

export type ThemeFor<T extends LayoutKey> = ThemeByLayout[T];

// ============================================
// Layout Configuration
// ============================================

export interface SectionConfig {
  id: string;
  type:
    | "header"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "languages"
    | "certifications"
    | "projects"
    | "references";
  label: string;
  enabled: boolean;
  order: number;
}

export interface LayoutConfig {
  id: LayoutKey;
  name: string;
  sections: SectionConfig[];
  sidebarSections?: string[];
  supportsTwoColumn: boolean;
}

// ============================================
// Layout Configs
// ============================================

/*
  Currently unused — nothing imports LAYOUT_CONFIGS. It looks like scaffolding
  for user-reorderable sections (ResumeData.sectionOrder is also unused). Typed
  Partial so the ATS layouts do not have to add dead entries; delete both if the
  reordering idea is dropped.
*/
export const LAYOUT_CONFIGS: Partial<Record<LayoutKey, LayoutConfig>> = {
  PROFESSIONAL_CLASSIC: {
    id: "PROFESSIONAL_CLASSIC",
    name: "Professional Classic",
    sections: [
      {
        id: "header",
        type: "header",
        label: "Header",
        enabled: true,
        order: 0,
      },
      {
        id: "summary",
        type: "summary",
        label: "Professional Summary",
        enabled: true,
        order: 1,
      },
      {
        id: "experience",
        type: "experience",
        label: "Work Experience",
        enabled: true,
        order: 2,
      },
      {
        id: "education",
        type: "education",
        label: "Education",
        enabled: true,
        order: 3,
      },
      {
        id: "skills",
        type: "skills",
        label: "Skills",
        enabled: true,
        order: 4,
      },
      {
        id: "certifications",
        type: "certifications",
        label: "Certifications",
        enabled: true,
        order: 5,
      },
    ],
    sidebarSections: [],
    supportsTwoColumn: false,
  },
  PROFESSIONAL_SLEEK: {
    id: "PROFESSIONAL_SLEEK",
    name: "Professional Sleek",
    sections: [
      {
        id: "header",
        type: "header",
        label: "Header",
        enabled: true,
        order: 0,
      },
      {
        id: "summary",
        type: "summary",
        label: "Professional Summary",
        enabled: true,
        order: 1,
      },
      {
        id: "experience",
        type: "experience",
        label: "Work Experience",
        enabled: true,
        order: 2,
      },
      {
        id: "education",
        type: "education",
        label: "Education",
        enabled: true,
        order: 3,
      },
      {
        id: "skills",
        type: "skills",
        label: "Skills",
        enabled: true,
        order: 4,
      },
    ],
    sidebarSections: [],
    supportsTwoColumn: false,
  },
  CREATIVE_SPLIT: {
    id: "CREATIVE_SPLIT",
    name: "Creative Split",
    sections: [
      {
        id: "header",
        type: "header",
        label: "Header",
        enabled: true,
        order: 0,
      },
      {
        id: "summary",
        type: "summary",
        label: "About Me",
        enabled: true,
        order: 1,
      },
      {
        id: "experience",
        type: "experience",
        label: "Experience",
        enabled: true,
        order: 2,
      },
      {
        id: "projects",
        type: "projects",
        label: "Projects",
        enabled: true,
        order: 3,
      },
      {
        id: "education",
        type: "education",
        label: "Education",
        enabled: true,
        order: 4,
      },
    ],
    sidebarSections: ["skills", "languages"],
    supportsTwoColumn: true,
  },
  MINIMAL_COMPACT: {
    id: "MINIMAL_COMPACT",
    name: "Minimal Compact",
    sections: [
      {
        id: "header",
        type: "header",
        label: "Header",
        enabled: true,
        order: 0,
      },
      {
        id: "summary",
        type: "summary",
        label: "Summary",
        enabled: true,
        order: 1,
      },
      {
        id: "experience",
        type: "experience",
        label: "Experience",
        enabled: true,
        order: 2,
      },
      {
        id: "education",
        type: "education",
        label: "Education",
        enabled: true,
        order: 3,
      },
      {
        id: "skills",
        type: "skills",
        label: "Skills",
        enabled: true,
        order: 4,
      },
    ],
    sidebarSections: [],
    supportsTwoColumn: false,
  },
  EXECUTIVE_FORMAL: {
    id: "EXECUTIVE_FORMAL",
    name: "Executive Formal",
    sections: [
      {
        id: "header",
        type: "header",
        label: "Header",
        enabled: true,
        order: 0,
      },
      {
        id: "summary",
        type: "summary",
        label: "Executive Summary",
        enabled: true,
        order: 1,
      },
      {
        id: "experience",
        type: "experience",
        label: "Leadership Experience",
        enabled: true,
        order: 2,
      },
      {
        id: "education",
        type: "education",
        label: "Education",
        enabled: true,
        order: 3,
      },
      {
        id: "skills",
        type: "skills",
        label: "Core Competencies",
        enabled: true,
        order: 4,
      },
      {
        id: "certifications",
        type: "certifications",
        label: "Certifications",
        enabled: true,
        order: 5,
      },
      {
        id: "references",
        type: "references",
        label: "References",
        enabled: true,
        order: 6,
      },
    ],
    sidebarSections: [],
    supportsTwoColumn: false,
  },
};
