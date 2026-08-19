import { Platform } from "react-native";
import * as Device from "expo-device";

export const getBaseUrl = function () {
  if (__DEV__) {
    if (Platform.OS === "android" && !Device.isDevice) {
      return "http://10.0.2.2:8888/v1"; // Android emulator
    }
    return `${process.env.EXPO_PUBLIC_API_URL}/v1`; // physical device / iOS simulator
  }
  return "https://elevra-mobile-server-2026.onrender.com/v1"; // Production
};
