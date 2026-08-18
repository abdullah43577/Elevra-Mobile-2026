import { AppText } from "@/components/shared/app-text";
import {
  CONTENT_META,
  CONTENT_TYPE_BY_CATEGORY,
  type ContentCategory,
} from "@/constants/content-colors";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

/*
  Named after what each thing is *for*, not what it is called in the nav. Someone
  who has just signed up does not yet know what "Workspaces" contains, and a
  tour that lists feature names teaches nothing.
*/
const HIGHLIGHTS: { type: ContentCategory; title: string; body: string }[] = [
  {
    type: "Resume",
    title: "Tailor a resume per role",
    body: "Six ATS-safe templates, and your profile fills the first draft.",
  },
  {
    type: "Application",
    title: "Track where you applied",
    body: "Every role in one pipeline, with the resume and letter you sent attached.",
  },
  {
    type: "InterviewQuestion",
    title: "Rehearse out loud",
    body: "A question bank with a practice runner that puts the ones you avoid first.",
  },
];

export const TourStep = function () {
  const { contentTint } = useThemeColors();

  return (
    <View>
      <AppText type="display">You are set up</AppText>
      <AppText type="subtitle" className="mt-2">
        Here is what is waiting for you. Nothing else needs configuring.
      </AppText>

      <View className="mt-7 gap-3">
        {HIGHLIGHTS.map((item) => {
          const meta = CONTENT_META[item.type];
          const { color, holder } = contentTint(
            CONTENT_TYPE_BY_CATEGORY[item.type],
          );

          return (
            <View
              key={item.title}
              className="flex-row items-start gap-3 rounded-2xl border-hairline border-line bg-surface p-4"
            >
              <View
                className="items-center justify-center rounded-squircle"
                style={{ width: 36, height: 36, backgroundColor: holder }}
              >
                <Ionicons name={meta.icon} size={17} color={color} />
              </View>

              <View className="flex-1">
                <AppText type="label" className="text-[15px]">
                  {item.title}
                </AppText>
                <AppText type="subtitle" className="mt-0.5">
                  {item.body}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
