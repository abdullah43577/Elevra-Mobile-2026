import { ScrollView, useWindowDimensions, View } from "react-native";
import { AppText } from "@/components/shared/app-text";
import { AnyTemplate } from "../../../types/resume/template";
import { LetterPage, LetterPageContent } from "./letter-page";

const A4_RATIO = 1.414;

// Laid out at a fixed width then scaled, so proportions match the exported PDF
// instead of reflowing at whatever the device width happens to be. Same
// approach as TemplatePreview.
const LAYOUT_WIDTH = 420;

interface Props {
  letter: LetterPageContent;
  template: AnyTemplate;
}

/*
  Renders on an explicit white sheet, never the app surface — a letter is a
  printed document and must look identical in either colour scheme.
*/
export const LetterPreview = function ({ letter, template }: Props) {
  const { width } = useWindowDimensions();

  const boxWidth = width - 40;
  const scale = boxWidth / LAYOUT_WIDTH;
  const height = boxWidth * A4_RATIO;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <AppText type="caption" className="mb-3 text-center">
        Live preview · updates as you type
      </AppText>

      <View className="items-center">
        <View className="overflow-hidden rounded-2xl border-hairline border-line bg-white">
          <View style={{ width: boxWidth, height, backgroundColor: "#FFFFFF", overflow: "hidden" }}>
            <View
              style={{
                width: LAYOUT_WIDTH,
                height: height / scale,
                transform: [{ scale }],
                transformOrigin: "top left",
              }}
            >
              <LetterPage letter={letter} template={template} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
