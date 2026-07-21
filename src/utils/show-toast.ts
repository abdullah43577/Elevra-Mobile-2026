import Toast from "react-native-toast-message";

type ToastType = "error" | "success" | "warning" | "info" | "loading";

export const showToast = (type: ToastType, message: string) => {
  Toast.hide();
  Toast.show({
    type,
    text1: message,
    position: "top",
    visibilityTime: type === "loading" ? 0 : 3000, // loading stays until you dismiss it
  });
};
