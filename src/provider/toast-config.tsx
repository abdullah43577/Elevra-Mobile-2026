import { View, Text, StyleSheet } from "react-native";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react-native";
import { BaseToastProps } from "react-native-toast-message";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    borderWidth: 1,
  },
  icon: { marginRight: 8 },
  text: { fontSize: 14, fontWeight: "500", flexShrink: 1 },
});

const variants = {
  success: {
    bg: "#ECFDF5",
    border: "#A7F3D0",
    color: "#065F46",
    Icon: CheckCircle2,
    iconColor: "#059669",
  },
  error: {
    bg: "#FEF2F2",
    border: "#FECACA",
    color: "#991B1B",
    Icon: XCircle,
    iconColor: "#DC2626",
  },
  warning: {
    bg: "#FFFBEB",
    border: "#FDE68A",
    color: "#92400E",
    Icon: AlertTriangle,
    iconColor: "#D97706",
  },
  info: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    color: "#1E40AF",
    Icon: Info,
    iconColor: "#2563EB",
  },
  loading: {
    bg: "#F9FAFB",
    border: "#E5E7EB",
    color: "#374151",
    Icon: Loader2,
    iconColor: "#6B7280",
  },
} as const;

const makeToast = function (type: keyof typeof variants) {
  const { bg, border, color, Icon, iconColor } = variants[type];

  const Toast = function ({ text1 }: BaseToastProps) {
    return (
      <View
        style={[styles.container, { backgroundColor: bg, borderColor: border }]}
      >
        <Icon size={18} color={iconColor} style={styles.icon} />
        <Text style={[styles.text, { color }]}>{text1}</Text>
      </View>
    );
  };

  Toast.displayName = `Toast(${type})`;
  return Toast;
};

export const toastConfig = {
  success: makeToast("success"),
  error: makeToast("error"),
  warning: makeToast("warning"),
  info: makeToast("info"),
  loading: makeToast("loading"),
};
