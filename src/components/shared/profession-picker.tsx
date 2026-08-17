import { useThemeColors } from "@/hooks/use-theme-colors";
import { AppModal } from "@/components/shared/app-modal";
import { AppText } from "@/components/shared/app-text";
import { useGetProfessions } from "@/hooks/profile/use-get-professions";
import { useMemo, useState } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";

interface ProfessionPickerProps {
  visible: boolean;
  selectedId: string | null;
  onSelect: (professionId: string, professionName: string) => void;
  onClose: () => void;
}

export const ProfessionPicker = function ({
  visible,
  selectedId,
  onSelect,
  onClose,
}: ProfessionPickerProps) {
  const { foregroundMuted } = useThemeColors();

  const { professions, isFetchingProfessions } = useGetProfessions();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return professions ?? [];
    return (professions ?? []).filter((p) =>
      p.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [professions, query]);

  return (
    <AppModal
      isVisible={visible}
      onClose={onClose}
      variant="bottom-sheet"
      showHandle
      title="Select profession"
      contentClassName="max-h-[75%]"
    >
      {/* Search */}
      <View className="mb-3 flex-row items-center rounded-xl bg-surface-muted px-4 py-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search professions"
          placeholderTextColor={foregroundMuted}
          className="flex-1 text-base text-foreground"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <AppText type="default" className="text-foreground-muted">
              ✕
            </AppText>
          </Pressable>
        )}
      </View>

      {isFetchingProfessions ? (
        <View className="gap-3 py-2">
          {[...Array(6)].map((_, i) => (
            <View key={i} className="h-12 rounded-xl bg-surface-muted" />
          ))}
        </View>
      ) : filtered.length === 0 ? (
        <View className="items-center py-10">
          <AppText type="default" className="text-foreground-muted">
            No professions found
          </AppText>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="h-1" />}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedId;
            return (
              <Pressable
                className={`flex-row items-center justify-between rounded-xl px-4 py-3 ${
                  isSelected ? "bg-surface-muted" : "bg-transparent"
                }`}
                android_ripple={{ color: "#eeeeef" }}
                onPress={() => {
                  onSelect(item.id, item.name);
                  onClose();
                }}
              >
                <AppText
                  type="default"
                  className={
                    isSelected ? "font-bricolage-semibold text-foreground" : ""
                  }
                >
                  {item.name}
                </AppText>

                {isSelected && (
                  <View className="h-5 w-5 items-center justify-center rounded-full bg-foreground">
                    <AppText
                      type="default"
                      className="font-bricolage-bold text-xs text-canvas"
                    >
                      ✓
                    </AppText>
                  </View>
                )}
              </Pressable>
            );
          }}
        />
      )}
    </AppModal>
  );
};
