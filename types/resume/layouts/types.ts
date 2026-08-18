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


/*
  Every layout added from the ATS rebuild onward takes this shape. The older
  per-layout prop interfaces above exist only for the four original templates
  and should not be extended — new layouts differ in chrome, not in the data
  they accept.
*/
export interface ResumeLayoutProps {
  theme: BaseTheme & { accentColor?: string };
  data: ResumeData;
  isThumbnail?: boolean;
}
