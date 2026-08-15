import { RecentItem } from "@/constants/dashboard";
import { Fragment } from "react";
import { View } from "react-native";
import { EmptyActivity } from "./empty-activity";
import { RecentActivityRow } from "./recent-activity-row";

interface Props {
  items: RecentItem[];
  onPressItem: (item: RecentItem) => void;
}

export const RecentActivityList = function ({ items, onPressItem }: Props) {
  if (items.length === 0) return <EmptyActivity />;

  return (
    <View className="overflow-hidden rounded-2xl border-hairline border-neutral-200 bg-white">
      {items.map((item, index) => (
        <Fragment key={`${item.type}-${item.id}`}>
          {index > 0 && <View className="ml-16 h-px bg-neutral-100" />}
          <RecentActivityRow item={item} onPress={onPressItem} />
        </Fragment>
      ))}
    </View>
  );
};
