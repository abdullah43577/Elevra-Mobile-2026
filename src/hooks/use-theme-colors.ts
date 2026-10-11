import { CONTENT_COLORS_BY_SCHEME, TINT_ALPHA } from "@/constants/theme";
import { ContentType } from "@/constants/content-colors";
import { useTheme } from "@/hooks/use-theme";

export const useThemeColors = function () {
  const { scheme, colors } = useTheme();

  const contentColor = function (type: ContentType) {
    return CONTENT_COLORS_BY_SCHEME[scheme][type];
  };

  const contentTint = function (type: ContentType) {
    const color = contentColor(type);
    return {
      color,
      surface: `${color}${TINT_ALPHA[scheme].surface}`,
      holder: `${color}${TINT_ALPHA[scheme].holder}`,
    };
  };

  return { ...colors, scheme, isDark: scheme === "dark", contentColor, contentTint };
};
