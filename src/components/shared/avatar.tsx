import { AppText } from "@/components/shared/app-text";
import { useState } from "react";
import { Image, View } from "react-native";

type TextType = "label" | "title" | "subtitle";

interface Props {
  uri?: string | null;
  initials: string;
  size: number;
  className?: string;
  textType?: TextType;
}

// The failed url is remembered, not a boolean, so a new url always gets a fresh
// attempt without an effect to reset it.
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
      // Fixed sizes in style, not w-*/h-*: a column parent would stretch the circle
      // into a full-width bar.
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
