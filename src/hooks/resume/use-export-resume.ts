import { buildResumeHtml } from "@/components/resume/html/resume-html";
import { API_ENDPOINTS } from "@/provider/endpoints";
import api from "@/provider/api";
import { showToast } from "@/utils/show-toast";
import { AxiosError } from "axios";
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

/*
  The PDF is produced on-device: buildResumeHtml -> expo-print -> share sheet.

  Deliberately not react-native-view-shot. That captures the rendered layout as
  an image, and an image-based PDF is unreadable to every applicant tracking
  system — which would undo the entire point of the ATS template work. The OS
  HTML renderer emits real, selectable text.

  Deliberately not server-side Puppeteer either: that means shipping Chromium
  alongside the API for something the phone can already do.
*/
export const useExportResume = function () {
  const [isExporting, setIsExporting] = useState(false);

  const exportResume = async function ({
    resumeId,
    template,
    data,
    title,
  }: {
    // Passed per call, not per hook: one screen exports many different resumes
    // from a single hook instance.
    resumeId?: string;
    template: AnyTemplate;
    data: ResumeData;
    title: string;
  }) {
    if (isExporting) return;
    setIsExporting(true);

    try {
      /*
        Ask the server FIRST, before generating anything.

        The PDF is produced on-device, so the server can never physically
        prevent it — but calling first means a free user is turned away by the
        402 rather than getting a file and having the rejection swallowed
        afterwards. The server stays the authority; the client obeys it.

        A network failure is treated as permission granted: export is the one
        thing a user may genuinely need on a bad connection, and the entitlement
        check is not worth blocking that. Only an explicit 402 stops the export.
      */
      if (resumeId) {
        try {
          await api.post(API_ENDPOINTS.resume.export(resumeId));
        } catch (error) {
          const status = (error as AxiosError)?.response?.status;

          if (status === 402) {
            const message =
              ((error as AxiosError)?.response?.data as { message?: string })
                ?.message ?? "Exporting a resume requires Elevra Pro";
            showToast("warning", message);
            return;
          }

          if (status && status !== 402) {
            showToast("error", "Could not export this resume");
            return;
          }
          // No response at all — offline. Fall through and export anyway.
        }
      }

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
    } catch (error) {
      showToast("error", "Could not export this resume");
      console.error("Resume export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportResume, isExporting };
};
