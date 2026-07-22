import { Platform } from "react-native";
import * as Device from "expo-device";

export const getBaseUrl = function () {
  if (__DEV__) {
    return Platform.OS === "android" && !Device.isDevice
      ? "http://10.0.2.2:8888/v1" // Android emulator
      : "http://192.168.0.183:8888/v1"; // physical device / iOS simulator
  }
  return "https://api.elevra.com/v1"; // production
};
