import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { showToast } from "@/utils/show-toast";

export const useAudioPicker = function () {
  const [isPicking, setIsPicking] = useState(false);

  const pickAudio = async function () {
    try {
      setIsPicking(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: ["audio/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return null;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          name: asset.name,
          size: asset.size || 0,
          mimeType: asset.mimeType ?? "audio/mpeg",
        };
      }

      return null;
    } catch (error) {
      showToast("error", "Failed to pick audio file");
      return null;
    } finally {
      setIsPicking(false);
    }
  };

  return {
    pickAudio,
    isPicking,
  };
};
