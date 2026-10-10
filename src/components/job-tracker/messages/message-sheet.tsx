import { AppModal } from "@/components/shared/app-modal";
import { AppText } from "@/components/shared/app-text";
import { MESSAGE_KIND_META } from "@/constants/messages";
import { MessageDrafting } from "@/hooks/job-applications/use-message-drafting";
import { ScrollView } from "react-native";
import { MessageForm } from "./message-form";
import { MessageResult } from "./message-result";

interface Props {
  drafting: MessageDrafting;
  accent: string;
}

export const MessageSheet = function ({ drafting, accent }: Props) {
  const meta = drafting.kind ? MESSAGE_KIND_META[drafting.kind] : null;

  return (
    <AppModal
      isVisible={!!drafting.kind}
      onClose={drafting.handleClose}
      variant="bottom-sheet"
      showHandle
      {...(meta && { title: meta.label })}
      // Swiping the sheet away would also swallow the drag on the long draft.
      modalProps={{ swipeDirection: undefined, avoidKeyboard: true }}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ maxHeight: 560 }}>
        {meta && (
          <AppText type="caption" className="mb-4">
            {meta.hint}. Nothing is sent from Elevra.
          </AppText>
        )}

        {drafting.message ? (
          <MessageResult key={drafting.message.body} message={drafting.message} accent={accent} onStartOver={drafting.handleStartOver} />
        ) : (
          <MessageForm accent={accent} isWriting={drafting.isWriting} onWrite={drafting.handleWrite} />
        )}
      </ScrollView>
    </AppModal>
  );
};
