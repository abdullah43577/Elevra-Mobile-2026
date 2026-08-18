import { View } from "react-native";
import { AnyTemplate } from "../../../types/resume/template";
import { ResumeData } from "../../../types/resume/data";
import { TemplateRenderer } from "../resume/template-renderer";

const A4_RATIO = 1.414;

// The page is laid out at this width, then scaled down to fit the box. Scaling
// a fixed layout keeps proportions identical to the full-size preview instead
// of reflowing text at card width.
const LAYOUT_WIDTH = 420;

interface Props {
  template: AnyTemplate;
  width: number;
  data?: ResumeData;
}

/*
  Renders the real template rather than a stored image. Previews were once
  Cloudinary images produced by a (dev) generator screen: a template that had
  never been through it showed "No preview", and any design change left every
  stored image stale. Rendering live is always accurate and costs little at this
  size. The generator, the upload endpoint and the column are all gone.
*/
export const TemplatePreview = function ({ template, width, data }: Props) {
  const scale = width / LAYOUT_WIDTH;
  const height = width * A4_RATIO;

  return (
    <View
      style={{
        width,
        height,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: LAYOUT_WIDTH,
          height: height / scale,
          transform: [{ scale }],
          transformOrigin: "top left",
        }}
      >
        <TemplateRenderer
          template={template}
          data={data ?? template.defaultData}
          isThumbnail
        />
      </View>
    </View>
  );
};
