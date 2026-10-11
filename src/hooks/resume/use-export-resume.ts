import { buildResumeHtml } from "@/components/resume/html/resume-html";
import { API_ENDPOINTS } from "@/provider/endpoints";
import api from "@/provider/api";
import { showToast } from "@/utils/show-toast";
import { File, Paths } from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Platform } from "react-native";
import { ResumeData } from "../../../types/resume/data";
import { AnyTemplate } from "../../../types/resume/template";

const safeFileName = function (value: string) {
  const cleaned = value
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return cleaned || "resume";
};

export const useExportResume = function () {
  const [isExporting, setIsExporting] = useState(false);

  const exportResume = async function ({
    resumeId,
    template,
    data,
    title,
  }: {
    resumeId?: string;
    template: AnyTemplate;
    data: ResumeData;
    title: string;
  }) {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const html = buildResumeHtml(template, data);
      const { uri } = await Print.printToFileAsync({ html, base64: false });

      let finalUri = uri;

      try {
        const target = new File(Paths.cache, `${safeFileName(title)}.pdf`);
        if (target.exists) target.delete();

        new File(uri).move(target);
        finalUri = target.uri;
      } catch {
        // keep the original uri
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(finalUri, {
          mimeType: "application/pdf",
          dialogTitle: "Export resume",
          UTI: "com.adobe.pdf",
        });
      } else if (Platform.OS === "ios") {
        await Print.printAsync({ uri: finalUri });
      } else {
        showToast("error", "Sharing is not available on this device");
        return;
      }

      // Best-effort and after the share, so it can never block the export.
      if (resumeId) api.post(API_ENDPOINTS.resume.export(resumeId)).catch(() => {});
    } catch (error) {
      showToast("error", "Could not export this resume");
      console.error("Resume export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportResume, isExporting };
};
