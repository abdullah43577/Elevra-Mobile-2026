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
  const { isDark, surface, foreground, foregroundSubtle, lineStrong } =
    useThemeColors();

  const editor = useEditorBridge({
    autofocus,
    avoidIosKeyboard: true,
    initialContent,
    /*
      Covers the React Native side only — the toolbar and the webview's own
      container. The document inside the webview is a separate world with its
      own stylesheet, which is what injectCSS below is for.
    */
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

  /*
    The editor body is a webview document, so no Tailwind class and no RN style
    reaches it — left alone it stays on the browser default white and a note
    reads as a white slab in an otherwise dark app.

    Injected rather than passed at construction because the user can change
    scheme while a note is open, and the bridge only reads its options once.
    The "theme" tag makes each injection replace the previous style element
    instead of stacking a new one per toggle.
  */
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
