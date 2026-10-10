import { TINT_ALPHA } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useMemo } from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { PEEPS, type PeepName } from "./peeps.generated";

interface Props {
  name: PeepName;
  /** The accent the backdrop is tinted with — the feature's own colour. */
  color: string;
  size?: number;
}

/*
  An Open Peeps figure drawn in the theme's own colours over a tinted circle.

  The peeps are two-colour line art, generated with their black as {{ink}} and
  white as {{paper}}: light mode draws dark lines on the card colour, dark mode
  the reverse, like chalk. That is what lets one file serve both schemes —
  the old onboarding PNGs had a light background baked in and became bright
  slabs in dark mode. To add or swap a figure, see scripts/build-illustrations.js.

  Decorative only, so hidden from screen readers; the copy beside it carries
  the meaning.
*/
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
