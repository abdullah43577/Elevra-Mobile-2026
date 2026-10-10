import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { ImportedProfile } from "../../../types/career-profile";

interface Props {
  report: ImportedProfile["report"];
}

const plural = function (count: number, one: string, many: string) {
  return count === 1 ? one : `${count} ${many}`;
};

// Stays up for the whole review, because nothing is saved until the user taps
// Save — a toast would be gone before they reached the second section.
export const ImportNotice = function ({ report }: Props) {
  const { contentTint } = useThemeColors();
  const tint = contentTint("profile");

  const notes = [
    report.entriesMissingDates > 0 &&
      `${plural(report.entriesMissingDates, "One entry needs", "entries need")} a start date before you can save.`,
    report.omittedValues > 0 &&
      `${plural(report.omittedValues, "One detail was", "details were")} left out because ${report.omittedValues === 1 ? "it isn’t" : "they aren’t"} in your PDF.`,
  ].filter(Boolean);

  return (
    <View
      className="mx-5 mb-2 flex-row gap-2.5 rounded-2xl border-hairline border-line p-3.5"
      style={{ backgroundColor: tint.surface }}
    >
      <Ionicons name="document-text-outline" size={16} color={tint.color} style={{ marginTop: 1 }} />
      <View className="flex-1">
        <AppText type="label">Imported from your PDF</AppText>
        <AppText type="caption" className="mt-0.5">
          Check each section, then tap Save. Nothing is saved until you do.
        </AppText>
        {notes.map((note) => (
          <AppText key={note as string} type="caption" className="mt-1 text-foreground">
            {note}
          </AppText>
        ))}
      </View>
    </View>
  );
};
