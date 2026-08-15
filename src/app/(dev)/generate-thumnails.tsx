import { TemplateRenderer } from "@/components/resume/template-renderer";
import { AppText } from "@/components/shared/app-text";
import { useGetTemplates } from "@/hooks/resume/use-get-templates";
import { useUploadTemplateThumbnail } from "@/hooks/resume/use-upload-template-thumbnail";
import { showToast } from "@/utils/show-toast";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";

export default function GenerateThumbnails() {
  const [generating, setGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<
    { id: string; name: string; status: string }[]
  >([]);
  const previewRef = useRef<View>(null);

  const { templates, isFetchingTemplates } = useGetTemplates();
  // Hook called once, at top level — not inside the loop
  const { uploadThumbnailAsync } = useUploadTemplateThumbnail();

  const waitForNextFrame = () =>
    new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );

  const generateAllThumbnails = async function () {
    if (!templates || templates.length === 0) return;

    setGenerating(true);
    setResults([]);

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      setCurrentIndex(i + 1);

      try {
        // Render only this template off-screen, then wait a couple frames
        // so layout actually completes before we try to capture it.
        await waitForNextFrame();

        const uri = await captureRef(previewRef, {
          format: "png",
          quality: 0.9,
          width: 400,
          height: 500,
        });

        const formData = new FormData();
        formData.append("thumbnail", {
          uri,
          name: `${template.id}.png`,
          type: "image/png",
        } as any);

        // Await the actual upload — don't assume success
        await uploadThumbnailAsync({ templateId: template.id, formData });

        setResults((prev) => [
          ...prev,
          { id: template.id, name: template.name, status: "✅ Success" },
        ]);
      } catch (error) {
        setResults((prev) => [
          ...prev,
          { id: template.id, name: template.name, status: "❌ Failed" },
        ]);
        showToast("error", `Failed to generate thumbnail for ${template.name}`);
      }
    }

    setGenerating(false);
    showToast("success", "All thumbnails generated!");
  };

  if (isFetchingTemplates) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const activeTemplate = templates[currentIndex - 1];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <AppText className="font-bricolage-bold text-2xl">
          Generate Thumbnails
        </AppText>
        <AppText className="text-gray-500">
          This will generate thumbnails for all templates
        </AppText>

        <TouchableOpacity
          onPress={generateAllThumbnails}
          disabled={generating}
          className="mt-4 rounded-lg bg-blue-500 py-3"
        >
          {generating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <AppText className="text-center font-bricolage-semibold text-white">
              Generate All Thumbnails ({templates.length})
            </AppText>
          )}
        </TouchableOpacity>

        {/* Renders ONE template at a time — whichever is currently being captured */}
        <View className="absolute -z-10 opacity-0" pointerEvents="none">
          {generating && activeTemplate && (
            <View
              ref={previewRef}
              collapsable={false}
              style={{ width: 400, height: 500 }}
            >
              <TemplateRenderer
                template={activeTemplate}
                data={activeTemplate.defaultData}
                isThumbnail
              />
            </View>
          )}
        </View>

        {generating && (
          <View className="mt-4">
            <AppText className="text-gray-600">
              Progress: {currentIndex} / {templates.length}
            </AppText>
            <View className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <View
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${(currentIndex / templates.length) * 100}%` }}
              />
            </View>
          </View>
        )}

        {results.length > 0 && (
          <ScrollView className="mt-4 max-h-96">
            {results.map((result, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between border-b border-gray-100 py-2"
              >
                <AppText className="text-sm text-gray-700">
                  {result.name}
                </AppText>
                <AppText
                  className={
                    result.status === "✅ Success"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {result.status}
                </AppText>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
