import { AppButton } from "@/components/shared/app-button";
import { AppModal } from "@/components/shared/app-modal";
import { AppText } from "@/components/shared/app-text";
import { ScrollView, View } from "react-native";
import { TailorResult } from "../../../../types/job-application";
import { KeywordMatchMeter } from "./keyword-match-meter";
import { MissingKeywords } from "./missing-keywords";

interface Props {
  result: TailorResult | null;
  accentColor: string;
  onReview: () => void;
  onClose: () => void;
}

export const TailorReportModal = function ({ result, accentColor, onReview, onClose }: Props) {
  const report = result?.report;

  return (
    <AppModal isVisible={!!result} onClose={onClose} variant="popup" title="Resume tailored">
      {report && (
        <ScrollView style={{ maxHeight: 460 }} showsVerticalScrollIndicator={false}>
          <AppText type="caption" className="mb-3">
            Saved as “{result.resume.title}” and attached to this application.
            Your original is unchanged.
          </AppText>

          <KeywordMatchMeter
            coverage={report.after}
            previousScore={report.before.score}
            accentColor={accentColor}
          />

          {report.addedTerms.length > 0 && (
            <View className="mt-5">
              <AppText type="label">Now uses the posting’s wording</AppText>
              {report.addedTerms.map((entry) => (
                <AppText key={entry.term} type="caption" className="mt-1.5">
                  <AppText type="caption" className="text-foreground">
                    {entry.term}
                  </AppText>
                  {`  from “${entry.evidence}”`}
                </AppText>
              ))}
            </View>
          )}

          {report.changes.length > 0 && (
            <View className="mt-5">
              <AppText type="label">What changed</AppText>
              {report.changes.map((change) => (
                <AppText key={change} type="caption" className="mt-1.5">
                  {`·  ${change}`}
                </AppText>
              ))}
            </View>
          )}

          {report.keptOriginal > 0 && (
            <AppText type="caption" className="mt-5">
              {report.keptOriginal === 1 ? "One section was" : `${report.keptOriginal} sections were`} kept
              exactly as you wrote it, because the rewrite said something your resume doesn’t.
            </AppText>
          )}

          <MissingKeywords keywords={report.after.missing} limit={6} />
        </ScrollView>
      )}

      <View className="mt-5 gap-2">
        <AppButton label="Review in the builder" onPress={onReview} />
        <AppButton label="Done" type="secondary" onPress={onClose} />
      </View>
    </AppModal>
  );
};
