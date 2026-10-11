export type LayoutKey =
  | "ATS_CLEAN"
  | "ATS_ACCENT"
  | "MODERN_BANNER"
  | "COMPACT_DENSE"
  | "TIMELINE_ACCENT"
  | "TECH_FOCUSED"
  // Legacy layouts, kept so existing Resume rows still resolve. Do not build on them.
  | "PROFESSIONAL_CLASSIC"
  | "PROFESSIONAL_SLEEK"
  | "CREATIVE_SPLIT"
  | "MINIMAL_COMPACT"
  | "EXECUTIVE_FORMAL";

export type FontFamily =
  "INTER" | "ROBOTO" | "MERRIWEATHER" | "LORA" | "PLAYFAIR";

export type Spacing = "COMPACT" | "NORMAL" | "SPACIOUS";

export interface BaseTheme {
  primaryColor: string;
  secondaryColor?: string;
  textColor: string;
  fontFamily: FontFamily;
  spacing: Spacing;
}

export interface ProfessionalClassicTheme extends BaseTheme {
  accentColor?: string;
  showBorders: boolean;
}

export interface ProfessionalSleekTheme extends BaseTheme {
  accentColor?: string;
  showBorders: boolean;
}

export interface CreativeSplitTheme extends BaseTheme {
  sidebarColor: string;
  sidebarTextColor: string;
  accentColor: string;
}

export interface MinimalCompactTheme extends BaseTheme {
  showDividers: boolean;
  useIcons: boolean;
}

export interface ExecutiveFormalTheme extends BaseTheme {
  goldAccent?: string;
  useSerifFont: boolean;
}

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

export type ThemeFor<T extends LayoutKey> = ThemeByLayout[T];
