import { showToast } from "@/utils/show-toast";
import * as ImagePicker from "expo-image-picker";

export interface PickedImage {
  uri: string;
  name: string;
  type: string;
}

export const useImagePicker = function () {
  const pickImage = async (): Promise<PickedImage | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      showToast(
        "error",
        "Allow photo library access to update your profile picture.",
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return null;

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      name: asset.fileName ?? `profile-${Date.now()}.jpg`,
      type: asset.mimeType ?? "image/jpeg",
    };
  };

  return { pickImage };
};
