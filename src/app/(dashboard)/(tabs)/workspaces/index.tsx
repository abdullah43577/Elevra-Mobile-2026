import { AppText } from "@/components/shared/app-text";
import { WorkspaceCard } from "@/components/workspaces/workspace-card";
import { WORKSPACE_ITEMS, WorkspaceItem } from "@/constants/workspaces";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkspacesHub() {
  const router = useRouter();

  const handlePress = (item: WorkspaceItem) => {
    if (item.locked) {
      // show coming soon modal
      return;
    }

    router.push(`/(dashboard)/(tabs)/workspaces/${item.route}` as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-12 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <AppText type="title" className="mb-1">
          Workspaces
        </AppText>
        <AppText type="default" className="mb-6 text-neutral-500">
          Everything you need, in one place
        </AppText>

        <View className="gap-3">
          {WORKSPACE_ITEMS.map((item) => (
            <WorkspaceCard key={item.id} item={item} onPress={handlePress} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
