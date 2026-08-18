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

interface ExportOptions {
  resumeId?: string;
}

const safeFileName = function (value: string) {
  const cleaned = value
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return cleaned || "resume";
};

/*
  The PDF is produced on-device: buildResumeHtml -> expo-print -> share sheet.

  Deliberately not react-native-view-shot. That captures the rendered layout as
  an image, and an image-based PDF is unreadable to every applicant tracking
  system — which would undo the entire point of the ATS template work. The OS
  HTML renderer emits real, selectable text.

  Deliberately not server-side Puppeteer either: that means shipping Chromium
  alongside the API for something the phone can already do.
*/
export const useExportResume = function (options?: ExportOptions) {
  const [isExporting, setIsExporting] = useState(false);

  const exportResume = async function ({
    template,
    data,
    title,
  }: {
    template: AnyTemplate;
    data: ResumeData;
    title: string;
  }) {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const html = buildResumeHtml(template, data);
      const { uri } = await Print.printToFileAsync({ html, base64: false });

      /*
        printToFileAsync names the file with a random uuid. Rename it so what
        lands in a recruiter's inbox is "amara-okonkwo-resume.pdf" rather than
        "a3f2b1c4-....pdf". If the rename fails the export is still perfectly
        valid, so fall back to the original path rather than losing the file.
      */
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

      // Best-effort: records lastExportedAt server-side and is where the
      // subscription gate will live. A failure here must not make a successful
      // export look like it failed.
      if (options?.resumeId) {
        try {
          await api.post(API_ENDPOINTS.resume.export(options.resumeId));
        } catch {
          // ignored on purpose
        }
      }
    } catch (error) {
      showToast("error", "Could not export this resume");
      console.error("Resume export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportResume, isExporting };
};
