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
