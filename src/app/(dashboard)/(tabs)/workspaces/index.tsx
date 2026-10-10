import { AppText } from "@/components/shared/app-text";
import { WorkspaceCard } from "@/components/workspaces/workspace-card";
import { WORKSPACE_ITEMS, WorkspaceItem } from "@/constants/workspaces";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkspacesHub() {
  const router = useRouter();

  const handlePress = function (item: WorkspaceItem) {
    router.push(`/(dashboard)/(tabs)/workspaces/${item.route}` as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <AppText type="display">Workspaces</AppText>
        <AppText type="subtitle" className="mt-1.5">
          The tools every application draws on
        </AppText>

        <View className="mt-7 gap-3">
          {WORKSPACE_ITEMS.map((item) => (
            <WorkspaceCard key={item.id} item={item} onPress={handlePress} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
