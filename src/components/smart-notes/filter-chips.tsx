import { AppText } from "@/components/shared/app-text";
import { clsx } from "clsx";
import { Pressable, ScrollView, View } from "react-native";

interface Folder {
  id: string;
  name: string;
  color?: string | null;
}

interface FilterChipsProps {
  folders: Folder[];
  selectedFolder: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onClearFilter: () => void;
}

const chipClass = function (isSelected: boolean) {
  return clsx(
    "flex-row items-center gap-1.5 rounded-full border-hairline px-3.5 py-1.5 active:opacity-70",
    isSelected
      ? "border-primary-500 bg-primary-500"
      : "border-neutral-200 bg-white",
  );
};

export function FilterChips({
  folders,
  selectedFolder,
  onSelectFolder,
  onClearFilter,
}: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-5"
    >
      <Pressable onPress={onClearFilter} className={chipClass(!selectedFolder)}>
        <AppText
          type="caption"
          className={
            !selectedFolder
              ? "font-bricolage-semibold text-white"
              : "text-neutral-600"
          }
        >
          All
        </AppText>
      </Pressable>

      {folders.map((folder) => {
        const isSelected = selectedFolder === folder.id;

        return (
          <Pressable
            key={folder.id}
            onPress={() => onSelectFolder(folder.id)}
            className={chipClass(isSelected)}
          >
            <View
              className="rounded-full"
              style={{
                width: 6,
                height: 6,
                backgroundColor: folder.color || "#7D7D8A",
              }}
            />
            <AppText
              type="caption"
              className={
                isSelected
                  ? "font-bricolage-semibold text-white"
                  : "text-neutral-600"
              }
            >
              {folder.name}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
