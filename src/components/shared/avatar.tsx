import { AppText } from "@/components/shared/app-text";
import { useState } from "react";
import { Image, View } from "react-native";

type TextType = "label" | "title" | "subtitle";

interface Props {
  uri?: string | null;
  initials: string;
  size: number;
  /** Container classes — border, background, press state. */
  className?: string;
  textType?: TextType;
}

/*
  A remote avatar has two ways of not showing up, and only one of them is the
  absent url. A Cloudinary blip, an expired link, or a cold start with no
  connection all leave <Image> rendering an empty circle with nothing to say
  what happened, which is why the picture "sometimes" appeared.

  The failed url is remembered rather than a boolean, so a new url is always
  given a fresh attempt without an effect to reset the flag.
*/
export const Avatar = function ({
  uri,
  initials,
  size,
  className = "",
  textType = "label",
}: Props) {
  const [failedUri, setFailedUri] = useState<string | null>(null);

  const showImage = !!uri && uri !== failedUri;

  return (
    <View
      className={`items-center justify-center overflow-hidden rounded-full ${className}`}
      // Fixed sizes go in style, not w-*/h-*: a child of a column parent
      // stretches and the circle becomes a full-width bar. See CLAUDE.md §5.
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          onError={() => setFailedUri(uri)}
          style={{ width: size, height: size }}
        />
      ) : (
        <AppText type={textType} className="text-foreground-muted">
          {initials}
        </AppText>
      )}
    </View>
  );
};
