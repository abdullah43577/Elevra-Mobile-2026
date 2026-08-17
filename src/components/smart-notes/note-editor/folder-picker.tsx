import { useThemeColors } from "@/hooks/use-theme-colors";
import { AppText } from "@/components/shared/app-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { Fragment, useState } from "react";
import { Pressable, View } from "react-native";

interface Folder {
  id: string;
  name: string;
  color?: string | null;
}

interface FolderPickerProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  disabled?: boolean;
}

export function FolderPicker({
  folders,
  selectedFolderId,
  onSelectFolder,
  disabled = false,
}: FolderPickerProps) {
  const { foregroundSubtle } = useThemeColors();

  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = function (folderId: string | null) {
    onSelectFolder(folderId);
    setShowPicker(false);
  };

  const selected = folders.find((folder) => folder.id === selectedFolderId);

  return (
    <View className="mb-5">
      <AppText type="label" className="mb-2">
        Folder
      </AppText>

      <Pressable
        onPress={() => setShowPicker((prev) => !prev)}
        disabled={disabled}
        className="flex-row items-center gap-2 rounded-2xl border-hairline border-line bg-canvas px-4 py-3.5 active:opacity-70"
      >
        {selected && (
          <View
            className="rounded-full"
            style={{
              width: 8,
              height: 8,
              backgroundColor: selected.color || "#7D7D8A",
            }}
          />
        )}
        <AppText
          type="default"
          className={selected ? "flex-1" : "flex-1 text-foreground-subtle"}
        >
          {selected?.name ?? "Select folder"}
        </AppText>
        <Ionicons
          name={showPicker ? "chevron-up" : "chevron-down"}
          size={16}
          color={foregroundSubtle}
        />
      </Pressable>

      {showPicker && (
        <View className="mt-2 overflow-hidden rounded-2xl border-hairline border-line bg-surface">
          <Pressable
            onPress={() => handleSelect(null)}
            className="flex-row items-center justify-between px-4 py-3 active:bg-surface-muted"
          >
            <AppText type="default" className="text-foreground-muted">
              No folder
            </AppText>
            {!selectedFolderId && (
              <Ionicons
                name="checkmark"
                size={17}
                color={CONTENT_COLORS.note}
              />
            )}
          </Pressable>

          {folders.map((folder) => (
            <Fragment key={folder.id}>
              <View className="h-px bg-line" />
              <Pressable
                onPress={() => handleSelect(folder.id)}
                className="flex-row items-center justify-between px-4 py-3 active:bg-surface-muted"
              >
                <View className="flex-row items-center gap-2">
                  <View
                    className="rounded-full"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: folder.color || "#7D7D8A",
                    }}
                  />
                  <AppText type="default">{folder.name}</AppText>
                </View>
                {selectedFolderId === folder.id && (
                  <Ionicons
                    name="checkmark"
                    size={17}
                    color={CONTENT_COLORS.note}
                  />
                )}
              </Pressable>
            </Fragment>
          ))}
        </View>
      )}
    </View>
  );
}
