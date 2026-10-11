import {
  darkEditorTheme,
  defaultEditorTheme,
  RichText,
  Toolbar,
  useBridgeState,
  useEditorBridge,
} from "@10play/tentap-editor";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useEffect, useRef } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

interface Props {
  onChange: (value: string) => void;
  // Read once, at bridge construction: mount only after the content is resolved.
  initialContent?: string;
  autofocus?: boolean;
}

export const RichTextEditor = function ({
  onChange,
  initialContent = "",
  autofocus = false,
}: Props) {
  const isHydrated = useRef(false);
  const { isDark, surface, foreground, foregroundSubtle, lineStrong } =
    useThemeColors();

  const editor = useEditorBridge({
    autofocus,
    avoidIosKeyboard: true,
    initialContent,
    theme: {
      ...(isDark ? darkEditorTheme : defaultEditorTheme),
      webview: { backgroundColor: surface },
      webviewContainer: { backgroundColor: surface },
    },
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

  // The webview document ignores RN styles, so theme it by injection (the bridge reads
  // options once); the "theme" tag replaces the previous style instead of stacking.
  useEffect(() => {
    if (!isReady) return;

    editor.injectCSS(
      `
      body, .ProseMirror {
        background-color: ${surface};
        color: ${foreground};
        caret-color: ${foreground};
      }
      .ProseMirror p.is-editor-empty:first-child::before {
        color: ${foregroundSubtle};
      }
      blockquote {
        border-left: 3px solid ${lineStrong};
        padding-left: 1rem;
      }
      `,
      "theme",
    );
  }, [isReady, editor, surface, foreground, foregroundSubtle, lineStrong]);

  return (
    <View className="flex-1 bg-surface">
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
