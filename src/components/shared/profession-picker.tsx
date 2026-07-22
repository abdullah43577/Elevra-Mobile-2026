import { AppText } from "@/components/shared/app-text";
import { useGetProfessions } from "@/hooks/profile/use-get-professions";
import { FlatList, Modal, Pressable, View } from "react-native";

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
  const { professions, isFetchingProfessions } = useGetProfessions();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          className="max-h-[70%] rounded-t-2xl bg-white p-5"
          onPress={(e) => e.stopPropagation()}
        >
          <AppText type="title" className="mb-4 text-lg">
            Select profession
          </AppText>

          {isFetchingProfessions ? (
            <AppText type="default" className="text-primary-400">
              Loading…
            </AppText>
          ) : (
            <FlatList
              data={professions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  className="border-primary-100 flex-row items-center justify-between border-b py-3"
                  onPress={() => {
                    onSelect(item.id, item.name);
                    onClose();
                  }}
                >
                  <AppText type="default">{item.name}</AppText>
                  {item.id === selectedId && (
                    <AppText type="link">Selected</AppText>
                  )}
                </Pressable>
              )}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};
