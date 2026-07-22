import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { Modal, Pressable, View } from "react-native";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "delete";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = function ({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-8"
        onPress={onCancel}
      >
        {/* Stop propagation so tapping the card doesn't dismiss it */}
        <Pressable
          className="w-full rounded-2xl bg-white p-5"
          onPress={(e) => e.stopPropagation()}
        >
          <AppText type="title" className="mb-2 text-lg">
            {title}
          </AppText>

          {message && (
            <AppText type="default" className="text-primary-400 mb-5">
              {message}
            </AppText>
          )}

          <View className="flex-row gap-3">
            <AppButton
              type="default"
              className="bg-primary-100 flex-1"
              onPress={onCancel}
              disabled={isLoading}
            >
              <AppText type="default" className="font-semibold text-white">
                {cancelLabel}
              </AppText>
            </AppButton>

            <AppButton
              type={variant}
              className="flex-1"
              onPress={onConfirm}
              isLoading={isLoading}
              disabled={isLoading}
            >
              <AppText type="default" className="font-semibold text-white">
                {isLoading ? "Please wait…" : confirmLabel}
              </AppText>
            </AppButton>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
