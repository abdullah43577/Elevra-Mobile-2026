import { BottomSheetPicker } from "@/components/shared/bottom-sheet-picker";
import { ResumeTailoring } from "@/hooks/job-applications/use-resume-tailoring";
import { TailorReportModal } from "./tailor-report-modal";
import { TailorResumeCard } from "./tailor-resume-card";

interface Props {
  tailoring: ResumeTailoring;
  hasJobDescription: boolean;
  attachedResumeTitle?: string;
  accentColor: string;
  onAddJobDescription: () => void;
}

export const TailorResumeSection = function ({
  tailoring,
  hasJobDescription,
  attachedResumeTitle,
  accentColor,
  onAddJobDescription,
}: Props) {
  return (
    <>
      <TailorResumeCard
        hasJobDescription={hasJobDescription}
        match={tailoring.match}
        {...(attachedResumeTitle && { attachedResumeTitle })}
        isPro={tailoring.isPro}
        isTailoring={tailoring.isTailoring}
        onTailor={tailoring.handleStart}
        onAddJobDescription={onAddJobDescription}
      />

      <BottomSheetPicker
        visible={tailoring.isPickingBase}
        title="Tailor from"
        selectedValue={null}
        showSearch={false}
        accentColor={accentColor}
        options={tailoring.baseOptions}
        onSelect={tailoring.handleSelectBase}
        onClose={tailoring.handleCloseBasePicker}
      />

      <TailorReportModal
        result={tailoring.result}
        accentColor={accentColor}
        onReview={tailoring.handleReview}
        onClose={tailoring.handleDismissReport}
      />
    </>
  );
};
