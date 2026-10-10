import { AppText } from "@/components/shared/app-text";
import { Badge } from "@/components/shared/badge";
import { SectionHeader } from "@/components/shared/section-header";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";
import { ApplicationMatch } from "../../../../types/job-application";
import { KeywordMatchMeter } from "./keyword-match-meter";
import { MissingKeywords } from "./missing-keywords";

interface Props {
  hasJobDescription: boolean;
  match: ApplicationMatch | null;
  attachedResumeTitle?: string;
  isPro: boolean;
  isTailoring: boolean;
  onTailor: () => void;
  onAddJobDescription: () => void;
}

export const TailorResumeCard = function ({
  hasJobDescription,
  match,
  attachedResumeTitle,
  isPro,
  isTailoring,
  onTailor,
  onAddJobDescription,
}: Props) {
  const { contentTint, foregroundInverse } = useThemeColors();
  const tint = contentTint("application");

  const buttonLabel = !hasJobDescription
    ? "Add the job description"
    : isTailoring
      ? "Tailoring your resume…"
      : match
        ? "Tailor again"
        : "Tailor resume";

  return (
    <View className="mt-8">
      <SectionHeader title="Tailor for this job" />

      <View className="rounded-2xl border-hairline border-line bg-surface p-4">
        {match ? (
          <>
            <AppText type="caption" className="mb-2">
              Keyword match{attachedResumeTitle ? ` · ${attachedResumeTitle}` : ""}
            </AppText>
            <KeywordMatchMeter coverage={match.coverage} accentColor={tint.color} />
            <MissingKeywords keywords={match.coverage.missing} limit={6} />
          </>
        ) : (
          <View className="flex-row gap-3">
            <View
              className="items-center justify-center rounded-squircle"
              style={{ width: 36, height: 36, backgroundColor: tint.holder }}
            >
              <Ionicons name="sparkles-outline" size={18} color={tint.color} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <AppText type="label">Tailor your resume to this posting</AppText>
                {!isPro && <Badge label="Pro" />}
              </View>
              <AppText type="caption" className="mt-0.5">
                {hasJobDescription
                  ? "AI rewrites a copy of your resume around this job, using only what's already in it."
                  : "Paste the job description first. Tailoring works from the posting."}
              </AppText>
            </View>
          </View>
        )}

        <Pressable
          onPress={hasJobDescription ? onTailor : onAddJobDescription}
          disabled={isTailoring}
          className="mt-4 flex-row items-center justify-center gap-2 rounded-xl px-4 py-3 active:opacity-80"
          style={{ backgroundColor: tint.color }}
        >
          {isTailoring && <ActivityIndicator size="small" color={foregroundInverse} />}
          <AppText type="label" style={{ color: foregroundInverse }}>
            {buttonLabel}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};
