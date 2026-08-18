import { AppButton } from "@/components/shared/app-button";
import { AppModal } from "@/components/shared/app-modal";
import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

interface Props {
  visible: boolean;
  isDeleting: boolean;
  onConfirm: (password: string) => void;
  onCancel: () => void;
}

const LOSSES = [
  "Resumes, cover letters and your career profile",
  "Every application, note and voice recording",
  "Your interview answers and practice history",
];

/*
  Not a ConfirmDialog: this needs a password field, and it needs to spell out
  what is being destroyed. Deleting an account is the one action in the app with
  no undo and no export to fall back on, so the confirmation earns more weight
  than a two-line "are you sure".
*/
export const DeleteAccountDialog = function ({
  visible,
  isDeleting,
  onConfirm,
  onCancel,
}: Props) {
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { foregroundSubtle, danger } = useThemeColors();

  const handleClose = function () {
    setPassword("");
    setIsPasswordVisible(false);
    onCancel();
  };

  return (
    <AppModal isVisible={visible} onClose={handleClose} variant="popup">
      <View className="w-full">
        <AppText type="title" className="text-[19px]">
          Delete your account
        </AppText>

        <AppText type="subtitle" className="mt-2">
          This is permanent. Everything below is deleted from our servers and
          cannot be recovered.
        </AppText>

        <View className="mt-4 gap-2">
          {LOSSES.map((loss) => (
            <View key={loss} className="flex-row items-start gap-2">
              <Ionicons
                name="close-circle-outline"
                size={15}
                color={danger}
                style={{ marginTop: 2 }}
              />
              <AppText type="caption" className="flex-1">
                {loss}
              </AppText>
            </View>
          ))}
        </View>

        <View className="mt-5 flex-row items-center gap-2 rounded-2xl border-hairline border-line bg-surface-muted px-4 py-3">
          <TextInput
            className="flex-1 font-bricolage text-[15px] text-foreground"
            placeholder="Confirm your password"
            placeholderTextColor={foregroundSubtle}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isDeleting}
          />

          <Pressable
            onPress={() => setIsPasswordVisible((value) => !value)}
            hitSlop={8}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={foregroundSubtle}
            />
          </Pressable>
        </View>

        <View className="mt-5 gap-2">
          <AppButton
            type="delete"
            label="Delete my account"
            onPress={() => onConfirm(password)}
            isLoading={isDeleting}
            disabled={!password.trim()}
          />

          <AppButton
            type="secondary"
            label="Cancel"
            onPress={handleClose}
            disabled={isDeleting}
          />
        </View>
      </View>
    </AppModal>
  );
};
