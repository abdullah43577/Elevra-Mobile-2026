import { AppText } from "@/components/shared/app-text";
import { WorkspaceCard } from "@/components/workspaces/workspace-card";
import { WORKSPACE_ITEMS, WorkspaceItem } from "@/constants/workspaces";
import { showToast } from "@/utils/show-toast";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkspacesHub() {
  const router = useRouter();

  const available = WORKSPACE_ITEMS.filter((item) => !item.locked);
  const comingSoon = WORKSPACE_ITEMS.filter((item) => item.locked);

  const handlePress = function (item: WorkspaceItem) {
    if (item.locked) {
      showToast("info", `${item.title} is coming soon`);
      return;
    }

    router.push(`/(dashboard)/(tabs)/workspaces/${item.route}` as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <AppText type="display">Workspaces</AppText>
        <AppText type="subtitle" className="mt-1.5">
          Everything you need, in one place
        </AppText>

        <View className="mt-7 gap-3">
          {available.map((item) => (
            <WorkspaceCard key={item.id} item={item} onPress={handlePress} />
          ))}
        </View>

        {comingSoon.length > 0 && (
          <>
            <AppText type="label" className="mb-3 mt-8 text-[15px]">
              Coming soon
            </AppText>
            <View className="gap-3">
              {comingSoon.map((item) => (
                <WorkspaceCard
                  key={item.id}
                  item={item}
                  onPress={handlePress}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
