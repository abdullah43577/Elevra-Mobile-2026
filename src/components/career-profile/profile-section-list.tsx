import { PROFILE_SECTIONS, ProfileSectionId } from "@/constants/career-profile";
import { View } from "react-native";
import { ProfileSectionRow } from "./profile-section-row";

interface Props {
  counts: Record<ProfileSectionId, number>;
  accent: string;
  tint: string;
  onSelectSection: (sectionId: ProfileSectionId) => void;
}

export const ProfileSectionList = function ({
  counts,
  accent,
  tint,
  onSelectSection,
}: Props) {
  return (
    <View className="overflow-hidden rounded-2xl border-hairline border-line bg-surface">
      {PROFILE_SECTIONS.map((section, index) => (
        <View key={section.id}>
          {index > 0 && <View className="ml-16 h-px bg-line" />}
          <ProfileSectionRow
            section={section}
            count={counts[section.id]}
            accent={accent}
            tint={tint}
            onPress={() => onSelectSection(section.id)}
          />
        </View>
      ))}
    </View>
  );
};
