import { buildCoverLetterHtml } from "@/components/cover-letters/html/cover-letter-html";
import api from "@/provider/api";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { showToast } from "@/utils/show-toast";
import { AxiosError } from "axios";
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
  the OS HTML renderer so the text stays real and selectable, and the server is
  asked first so a free user is turned away by the 402 rather than handed a file
  and a swallowed rejection. A network failure counts as permission granted.
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
      try {
        await api.post(API_ENDPOINTS.coverLetters.export(coverLetter.id));
      } catch (error) {
        const status = (error as AxiosError)?.response?.status;

        if (status === 402) {
          const message =
            ((error as AxiosError)?.response?.data as { message?: string })
              ?.message ?? "Exporting a cover letter requires Elevra Pro";
          showToast("warning", message);
          return;
        }

        if (status && status !== 402) {
          showToast("error", "Could not export this cover letter");
          return;
        }
        // No response at all — offline. Fall through and export anyway.
      }

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
    } catch (error) {
      showToast("error", "Could not export this cover letter");
      console.error("Cover letter export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportCoverLetter, isExporting };
};
