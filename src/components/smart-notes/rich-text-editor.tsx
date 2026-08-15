import {
  RichText,
  Toolbar,
  useBridgeState,
  useEditorBridge,
} from "@10play/tentap-editor";
import { useEffect, useRef } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

interface Props {
  onChange: (value: string) => void;
  /**
   * Seeds the document ONCE — tentap reads it at bridge-construction time and
   * the webview owns the document afterwards. Do not mount this component
   * until the content you want to show is resolved.
   */
  initialContent?: string;
  autofocus?: boolean;
}

export const RichTextEditor = function ({
  onChange,
  initialContent = "",
  autofocus = false,
}: Props) {
  const isHydrated = useRef(false);

  const editor = useEditorBridge({
    autofocus,
    avoidIosKeyboard: true,
    initialContent,
    onChange: async () => {
      // tentap emits a change while loading; letting it through would push an
      // empty "<p></p>" into parent state and wipe the note.
      if (!isHydrated.current) return;
      onChange(await editor.getHTML());
    },
  });

  const { isReady } = useBridgeState(editor);

  useEffect(() => {
    if (!isReady || isHydrated.current) return;
    // On a cold webview the document can still be empty once the bridge reports
    // ready, so re-apply the seed content exactly once.
    editor.setContent(initialContent);
    isHydrated.current = true;
  }, [isReady, initialContent, editor]);

  return (
    <View className="flex-1">
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          position: "absolute",
          width: "100%",
          bottom: 0,
        }}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </View>
  );
};
