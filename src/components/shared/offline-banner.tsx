import { AppText } from "@/components/shared/app-text";
import { useIsOnline } from "@/hooks/use-online-status";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/*
  Without this, offline reads look identical to fresh ones — the user has no way
  to tell that what they are looking at is cached and that their edits are
  queued rather than saved.
*/
export const OfflineBanner = function () {
  const isOnline = useIsOnline();
  const insets = useSafeAreaInsets();

  if (isOnline) return null;

  return (
    <View
      className="absolute left-0 right-0 z-50 flex-row items-center justify-center gap-2 bg-foreground px-4 py-2"
      style={{ top: 0, paddingTop: insets.top + 8 }}
    >
      <Ionicons name="cloud-offline-outline" size={14} color="#FAFAFB" />
      <AppText type="caption" className="text-canvas">
        Offline — showing saved data
      </AppText>
    </View>
  );
};
