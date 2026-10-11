import { ResumeData } from "../data";
import { BaseTheme } from "../theme";
import {
  CreativeSplitTheme,
  ExecutiveFormalTheme,
  MinimalCompactTheme,
  ProfessionalClassicTheme,
} from "../theme";

export interface ProfessionalClassicLayoutProps {
  theme: ProfessionalClassicTheme;
  data: ResumeData;
  isThumbnail?: boolean;
}

export interface CreativeSplitLayoutProps {
  theme: CreativeSplitTheme;
  data: ResumeData;
  isThumbnail?: boolean;
}

export interface MinimalCompactLayoutProps {
  theme: MinimalCompactTheme;
  data: ResumeData;
  isThumbnail?: boolean;
}

export interface ExecutiveFormalLayoutProps {
  theme: ExecutiveFormalTheme;
  data: ResumeData;
  isThumbnail?: boolean;
}


export interface ResumeLayoutProps {
  theme: BaseTheme & { accentColor?: string };
  data: ResumeData;
  isThumbnail?: boolean;
}
