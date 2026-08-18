import { TemplatePreview } from "@/components/resume-studio/template-preview";
import { AppText } from "@/components/shared/app-text";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { ResumeData } from "../../../../types/resume/data";
import { AnyTemplate } from "../../../../types/resume/template";

interface Props {
  template: AnyTemplate;
  data: ResumeData;
}

/*
  The page renders on an explicit white sheet, never on the app surface — a
  resume is a printed document and must look identical in either colour scheme.
*/
export const BuilderPreview = function ({ template, data }: Props) {
  const { width } = useWindowDimensions();

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
          <TemplatePreview template={template} width={width - 40} data={data} />
        </View>
      </View>
    </ScrollView>
  );
};
