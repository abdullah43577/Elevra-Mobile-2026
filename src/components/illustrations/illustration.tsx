import { TINT_ALPHA } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useMemo } from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { PEEPS, type PeepName } from "./peeps.generated";

interface Props {
  name: PeepName;
  color: string;
  size?: number;
}

export const Illustration = function ({ name, color, size = 180 }: Props) {
  const { foreground, surface, scheme } = useThemeColors();

  const xml = useMemo(
    () => PEEPS[name].replaceAll("{{ink}}", foreground).replaceAll("{{paper}}", surface),
    [name, foreground, surface],
  );

  const backdrop = size * 0.72;

  return (
    <View
      style={{ width: size, height: size }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View
        style={{
          position: "absolute",
          width: backdrop,
          height: backdrop,
          borderRadius: backdrop / 2,
          left: (size - backdrop) / 2,
          top: size * 0.58 - backdrop / 2,
          backgroundColor: `${color}${TINT_ALPHA[scheme].holder}`,
        }}
      />
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
};
