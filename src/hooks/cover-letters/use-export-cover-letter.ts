import { buildCoverLetterHtml } from "@/components/cover-letters/html/cover-letter-html";
import api from "@/provider/api";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { showToast } from "@/utils/show-toast";
import { File, Paths } from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Platform } from "react-native";
import { CoverLetter } from "../../../types/cover-letter";

const safeFileName = function (value: string) {
  const cleaned = value
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return cleaned || "cover-letter";
};

/*
  Mirrors useExportResume exactly, including why: the PDF is built on-device by
  the OS HTML renderer so the text stays real and selectable.
*/
export const useExportCoverLetter = function () {
  const [isExporting, setIsExporting] = useState(false);

  const exportCoverLetter = async function (coverLetter: CoverLetter) {
    if (isExporting) return;

    if (!coverLetter.template?.theme) {
      showToast("error", "This cover letter is missing its template");
      return;
    }

    setIsExporting(true);

    try {
      const html = buildCoverLetterHtml({
        ...coverLetter,
        template: coverLetter.template,
      });
      const { uri } = await Print.printToFileAsync({ html, base64: false });

      let finalUri = uri;

      try {
        const target = new File(
          Paths.cache,
          `${safeFileName(`${coverLetter.title} cover letter`)}.pdf`,
        );
        if (target.exists) target.delete();

        new File(uri).move(target);
        finalUri = target.uri;
      } catch {
        // keep the original uri — a cosmetic filename is not worth the document
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(finalUri, {
          mimeType: "application/pdf",
          dialogTitle: "Export cover letter",
          UTI: "com.adobe.pdf",
        });
      } else if (Platform.OS === "ios") {
        await Print.printAsync({ uri: finalUri });
      } else {
        showToast("error", "Sharing is not available on this device");
        return;
      }

      api.post(API_ENDPOINTS.coverLetters.export(coverLetter.id)).catch(() => {});
    } catch (error) {
      showToast("error", "Could not export this cover letter");
      console.error("Cover letter export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportCoverLetter, isExporting };
};
