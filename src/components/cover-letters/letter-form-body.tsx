import { AppText } from "@/components/shared/app-text";
import { FormTextArea } from "@/components/shared/form-text-area";
import { SectionHeader } from "@/components/shared/section-header";
import {
  CLOSING_OPTIONS,
  CoverLetterFormValues,
  DEFAULT_CLOSING,
} from "@/schemas/cover-letter/cover-letter";
import { clsx } from "clsx";
import { Control, FieldErrors } from "react-hook-form";
import { Pressable, ScrollView, View } from "react-native";

interface Props {
  control: Control<CoverLetterFormValues>;
  errors?: FieldErrors<CoverLetterFormValues>;
  closing: string;
  accent: string;
  onSelectClosing: (value: string) => void;
}

const BODY_PLACEHOLDER =
  "I am writing to apply for the Senior Engineer role at Acme.\n\nIn my four years at Elevra I led…\n\nI would welcome the chance to talk.";

export const LetterFormBody = function ({
  control,
  errors,
  closing,
  accent,
  onSelectClosing,
}: Props) {
  return (
    <View>
      <SectionHeader title="Your letter" />

      <FormTextArea<CoverLetterFormValues>
        control={control}
        name="body"
        label="Body"
        placeholder={BODY_PLACEHOLDER}
        errors={errors}
        style={{ minHeight: 220, textAlignVertical: "top" }}
      />

      <AppText type="caption" className="mt-1.5">
        Start a new line for each paragraph. Your name, contact details, the
        date and the greeting are added for you.
      </AppText>

      <AppText type="subtitle" className="mb-2 mt-5">
        Sign off
      </AppText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 pr-5"
      >
        {CLOSING_OPTIONS.map((option) => {
          const isSelected = (closing || DEFAULT_CLOSING) === option;

          return (
            <Pressable
              key={option}
              onPress={() => onSelectClosing(option)}
              className={clsx(
                "rounded-full border-hairline px-3.5 py-1.5 active:opacity-70",
                isSelected ? "border-transparent" : "border-line bg-surface",
              )}
              style={isSelected ? { backgroundColor: accent } : undefined}
            >
              <AppText
                type="caption"
                className={
                  isSelected
                    ? "font-bricolage-semibold text-foreground-inverse"
                    : "text-foreground-muted"
                }
              >
                {option}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
