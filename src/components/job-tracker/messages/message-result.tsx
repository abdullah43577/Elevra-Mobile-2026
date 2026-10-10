import { TextArea } from "@/components/primitives/text-area";
import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { showToast } from "@/utils/show-toast";
import { useState } from "react";
import { Linking, Pressable, Share, View } from "react-native";
import { ApplicationMessage } from "../../../../types/job-application";

interface Props {
  message: ApplicationMessage;
  accent: string;
  onStartOver: () => void;
}

/*
  Never sent by the app. Share covers copying it or sending through any app;
  "Open in mail" hands subject and body to the user's own mail app with no
  recipient, since we do not know their address — and the user's own client is
  where a reply will come back to.
*/
export const MessageResult = function ({ message, accent, onStartOver }: Props) {
  const [body, setBody] = useState(message.body);

  const handleShare = function () {
    Share.share({ title: message.subject, message: body });
  };

  const handleOpenMail = async function () {
    const url = `mailto:?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(body)}`;
    try {
      await Linking.openURL(url);
    } catch {
      showToast("warning", "No mail app is set up on this phone. Use Share to copy the message instead.");
    }
  };

  return (
    <View>
      <AppText type="caption">Subject</AppText>
      <AppText type="label" className="mt-0.5">
        {message.subject}
      </AppText>

      <TextArea
        value={body}
        onChangeText={setBody}
        placeholder="Your message"
        className="mt-3 min-h-[200px]"
        style={{ textAlignVertical: "top", maxHeight: 320 }}
      />
      <AppText type="caption" className="mt-1.5">
        {message.removedSentences > 0
          ? "A line was left out because it said something your notes don't. Edit freely before sending."
          : "Edit freely before sending."}
      </AppText>

      <View className="mt-4 flex-row gap-2">
        <View className="flex-1">
          <AppButton type="secondary" label="Share" onPress={handleShare} />
        </View>
        <View className="flex-1">
          <AppButton type="submit" label="Open in mail" onPress={handleOpenMail} style={{ backgroundColor: accent }} />
        </View>
      </View>

      <Pressable onPress={onStartOver} hitSlop={8} className="mt-4 items-center active:opacity-60">
        <AppText type="caption" style={{ color: accent }}>
          Write it again
        </AppText>
      </Pressable>
    </View>
  );
};
