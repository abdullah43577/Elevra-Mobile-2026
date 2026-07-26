import { AnyTemplate } from "../../../types/resume/template";
import { ResumeData } from "../../../types/resume/data";
import { ProfessionalClassicLayout } from "./profession-classic-layout";
import { CreativeSplitLayout } from "./creative-split-layout";
import { MinimalCompactLayout } from "./minimal-compact-layout";
import { ExecutiveFormalLayout } from "./executive-formal-layout";

interface TemplateRendererProps {
  template: AnyTemplate;
  data: ResumeData;
  isThumbnail?: boolean;
}

export function TemplateRenderer({
  template,
  data,
  isThumbnail = false,
}: TemplateRendererProps) {
  switch (template.layoutKey) {
    case "PROFESSIONAL_CLASSIC":
    case "PROFESSIONAL_SLEEK":
      return (
        <ProfessionalClassicLayout
          theme={template.theme}
          data={data}
          isThumbnail={isThumbnail}
        />
      );

    case "CREATIVE_SPLIT":
      return (
        <CreativeSplitLayout
          theme={template.theme}
          data={data}
          isThumbnail={isThumbnail}
        />
      );

    case "MINIMAL_COMPACT":
      return (
        <MinimalCompactLayout
          theme={template.theme}
          data={data}
          isThumbnail={isThumbnail}
        />
      );

    case "EXECUTIVE_FORMAL":
      return (
        <ExecutiveFormalLayout
          theme={template.theme}
          data={data}
          isThumbnail={isThumbnail}
        />
      );

    default: {
      // Exhaustiveness check — if a new LayoutKey is ever added without a
      // matching case above, this line fails to compile, catching the gap
      // at build time instead of silently rendering nothing at runtime.
      const _exhaustive: never = template;
      return null;
    }
  }
}
