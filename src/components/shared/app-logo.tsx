import { Image } from "expo-image";

interface Props {
  size?: number;
}

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
