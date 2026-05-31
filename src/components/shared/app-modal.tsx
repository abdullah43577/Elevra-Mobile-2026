import { clsx } from "clsx";
import { type ReactNode } from "react";
import { Pressable, View } from "react-native";
import Modal from "react-native-modal";
import { AppText } from "./app-text";

type ModalVariant = "popup" | "bottom-sheet" | "top-sheet";

interface AppModalProps {
  isVisible: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  title?: string;
  children: ReactNode;
  contentClassName?: string;
  /** Show a drag handle — only relevant for bottom-sheet and top-sheet */
  showHandle?: boolean;
  /** Override any react-native-modal prop directly */
  modalProps?: Record<string, unknown>;
}

const variantConfig = {
  popup: {
    animationIn: "zoomIn",
    animationOut: "zoomOut",
    style: { justifyContent: "center", alignItems: "center", margin: 24 },
  },
  "bottom-sheet": {
    animationIn: "slideInUp",
    animationOut: "slideOutDown",
    swipeDirection: "down",
    style: { justifyContent: "flex-end", margin: 0 },
  },
  "top-sheet": {
    animationIn: "slideInDown",
    animationOut: "slideOutUp",
    swipeDirection: "up",
    style: { justifyContent: "flex-start", margin: 0 },
  },
};

export const AppModal = function ({
  isVisible,
  onClose,
  variant = "popup",
  title,
  children,
  contentClassName,
  showHandle = false,
  modalProps: modalOverrides = {},
}: AppModalProps) {
  const config = variantConfig[variant];
  const isSheet = variant === "bottom-sheet" || variant === "top-sheet";

  const resolvedProps = Object.assign(
    {} as any,
    {
      isVisible,
      onBackdropPress: onClose,
      onBackButtonPress: onClose,
      onSwipeComplete: onClose,
      backdropOpacity: 0.4,
      animationInTiming: 300,
      animationOutTiming: 250,
      useNativeDriverForBackdrop: true,
    },
    config,
    modalOverrides,
  );

  return (
    <Modal {...resolvedProps}>
      <View
        className={clsx(
          "bg-white",
          isSheet
            ? "w-full px-5 pb-8 pt-4"
            : "w-full rounded-2xl px-5 pb-6 pt-5",
          variant === "bottom-sheet" && "rounded-t-2xl",
          variant === "top-sheet" && "rounded-b-2xl",
          contentClassName,
        )}
      >
        {/* Handle */}
        {showHandle && isSheet && (
          <View className="mb-4 items-center">
            <View className="h-1 w-10 rounded-full bg-neutral-300" />
          </View>
        )}

        {/* Header row */}
        {title != null && (
          <View className="mb-4 flex-row items-center justify-between">
            <AppText type="heading">{title}</AppText>
            <Pressable
              onPress={onClose}
              className="rounded-full p-1 active:opacity-60"
              hitSlop={8}
            >
              <AppText type="subtitle" className="text-neutral-500">
                ✕
              </AppText>
            </Pressable>
          </View>
        )}

        {children}
      </View>
    </Modal>
  );
};
