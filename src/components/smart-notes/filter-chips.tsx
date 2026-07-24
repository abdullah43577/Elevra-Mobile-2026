import { ScrollView, TouchableOpacity, Text, View } from "react-native";

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
      className="max-h-10 flex-shrink-0 px-4 py-1"
    >
      <TouchableOpacity
        onPress={onClearFilter}
        className={`mr-2 self-center rounded-full px-4 py-1.5 ${
          !selectedFolder ? "bg-blue-500" : "bg-gray-200"
        }`}
      >
        <Text className={!selectedFolder ? "text-white" : "text-gray-700"}>
          All
        </Text>
      </TouchableOpacity>

      {folders.map((folder) => (
        <TouchableOpacity
          key={folder.id}
          onPress={() => onSelectFolder(folder.id)}
          className={`mr-2 flex-row items-center self-center rounded-full px-4 py-1.5 ${
            selectedFolder === folder.id ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <View
            className="mr-2 h-2 w-2 rounded-full"
            style={{ backgroundColor: folder.color || "#6B7280" }}
          />
          <Text
            className={
              selectedFolder === folder.id ? "text-white" : "text-gray-700"
            }
          >
            {folder.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
