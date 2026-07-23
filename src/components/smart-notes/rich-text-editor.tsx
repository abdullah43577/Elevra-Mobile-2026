import { useEffect, useRef } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";

interface Props {
  onChange: (value: string) => void;
  content: string;
}

export const RichTextEditor = function ({ onChange, content }: Props) {
  const hasInitialized = useRef(false);

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: !hasInitialized.current ? (content ?? "") : undefined,
    onChange: async () => {
      const html = await editor.getHTML();
      onChange(html);
    },
  });

  hasInitialized.current = true;

  //* IF ANY ERRORS REMOVE THIS PART OF THE CODE AND RESTRATEGIZE TO FIGURE SOMETHING OUT TO RESET STATE WHEN CONTENT IS AN EMPTY STRING
  useEffect(() => {
    if (content === "") editor.setContent("");
  }, [content]);

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
