import { Image } from "expo-image";

interface Props {
  size?: number;
}

/*
  The app icon itself rather than a redrawn mark, so the in-app logo can never
  drift from what is on the home screen and in the stores. It replaced a
  placeholder "E" tile whose letter rendered invisibly: AppText merges classes
  with plain clsx, and its own text-foreground beat the tile's text-canvas.
*/
export const AppLogo = function ({ size = 44 }: Props) {
  return (
    <Image
      source={require("@/assets/images/icon.png")}
      style={{ width: size, height: size, borderRadius: size * 0.24 }}
      contentFit="cover"
      accessibilityLabel="Elevra"
    />
  );
};
