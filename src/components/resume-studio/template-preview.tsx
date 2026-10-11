import { View } from "react-native";
import { AnyTemplate } from "../../../types/resume/template";
import { ResumeData } from "../../../types/resume/data";
import { TemplateRenderer } from "../resume/template-renderer";

const A4_RATIO = 1.414;

// Laid out at a fixed width, then scaled to fit, so proportions match the full page.
const LAYOUT_WIDTH = 420;

interface Props {
  template: AnyTemplate;
  width: number;
  data?: ResumeData;
}

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
