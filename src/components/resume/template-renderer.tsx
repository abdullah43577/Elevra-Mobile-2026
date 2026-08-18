import { ResumeData } from "../../../types/resume/data";
import { AnyTemplate } from "../../../types/resume/template";
import { AtsAccentLayout } from "./layouts/ats-accent";
import { AtsCleanLayout } from "./layouts/ats-clean";
import { CompactDenseLayout } from "./layouts/compact-dense";
import { ModernBannerLayout } from "./layouts/modern-banner";
import { TechFocusedLayout } from "./layouts/tech-focused";
import { TimelineAccentLayout } from "./layouts/timeline-accent";

interface TemplateRendererProps {
  template: AnyTemplate;
  data: ResumeData;
  isThumbnail?: boolean;
}

const LAYOUTS = {
  ATS_CLEAN: AtsCleanLayout,
  ATS_ACCENT: AtsAccentLayout,
  MODERN_BANNER: ModernBannerLayout,
  COMPACT_DENSE: CompactDenseLayout,
  TIMELINE_ACCENT: TimelineAccentLayout,
  TECH_FOCUSED: TechFocusedLayout,

  /*
    The four originals were retired for being hard to maintain and, in the case
    of CREATIVE_SPLIT, actively ATS-hostile (a sidebar breaks reading order for
    most parsers). Existing Resume rows may still point at them, so they resolve
    to the closest surviving equivalent rather than rendering nothing.
  */
  PROFESSIONAL_CLASSIC: AtsCleanLayout,
  PROFESSIONAL_SLEEK: AtsAccentLayout,
  CREATIVE_SPLIT: TimelineAccentLayout,
  MINIMAL_COMPACT: CompactDenseLayout,
  EXECUTIVE_FORMAL: AtsCleanLayout,
} as const;

export function TemplateRenderer({
  template,
  data,
  isThumbnail = false,
}: TemplateRendererProps) {
  const Layout = LAYOUTS[template.layoutKey];
  if (!Layout) return null;

  return <Layout theme={template.theme} data={data} isThumbnail={isThumbnail} />;
}
