import { ResumeData } from "../data";
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
