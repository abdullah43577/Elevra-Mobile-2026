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
   * Seeds the document ONCE. tentap reads this at bridge-construction time and
   * the webview owns the document from then on, so later changes to this prop
   * are deliberately ignored. Callers must therefore not mount this component
   * until the content they want to show is resolved — see note-editor.tsx,
   * which waits for the fetched note before rendering.
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
      // tentap emits a change while it loads `initialContent`. Letting that
      // through would push an empty "<p></p>" up into parent state and wipe
      // the note before the user has typed a single character.
      if (!isHydrated.current) return;
      onChange(await editor.getHTML());
    },
  });

  const { isReady } = useBridgeState(editor);

  useEffect(() => {
    if (!isReady || isHydrated.current) return;
    // `initialContent` is applied at construction, but on a cold webview the
    // document can still be empty by the time the bridge reports ready — which
    // is what left the editor blank when opening an existing note. Re-apply it
    // once here, then hand ownership of the document to the webview.
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
