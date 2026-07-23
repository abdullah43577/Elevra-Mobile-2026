import { AppButton } from "@/components/shared/app-button";
import { AppModal } from "@/components/shared/app-modal";
import { AppText } from "@/components/shared/app-text";
import { View } from "react-native";

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
    <AppModal
      isVisible={visible}
      onClose={onCancel}
      variant="popup"
      title={title}
      modalProps={{ onBackdropPress: isLoading ? undefined : onCancel }}
    >
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
    </AppModal>
  );
};
