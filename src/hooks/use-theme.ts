import { ColorScheme, THEME, ThemePreference } from "@/constants/theme";
import { useGetProfile } from "@/hooks/use-get-profile";
import { useThemeStore } from "@/store/theme";
import { useColorScheme } from "nativewind";
import { useEffect, useRef } from "react";

const NATIVEWIND_SCHEME = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark",
} as const;

export const useTheme = function () {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { preference, setThemePreference } = useThemeStore();

  const scheme: ColorScheme = colorScheme === "dark" ? "dark" : "light";

  const setPreference = function (next: ThemePreference) {
    setColorScheme(NATIVEWIND_SCHEME[next]);
    return setThemePreference(next);
  };

  return { preference, scheme, colors: THEME[scheme], setPreference };
};

/*
  Called once from AppNavigator. The locally persisted preference is what
  applies at launch — reading it from the profile query instead would flash the
  light theme until that request resolves. The server value is still the
  cross-device truth, so it is adopted once, after the first profile load.
*/
export const useSyncTheme = function () {
  const { setColorScheme } = useColorScheme();
  const { preference, isLoading, checkThemePreference, setThemePreference } = useThemeStore();
  const { profile } = useGetProfile();

  const hasAdoptedServerValue = useRef(false);

  useEffect(() => {
    checkThemePreference();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    setColorScheme(NATIVEWIND_SCHEME[preference]);
  }, [preference, isLoading]);

  useEffect(() => {
    const serverPreference = profile?.settings?.theme;
    if (isLoading || !serverPreference || hasAdoptedServerValue.current) return;

    hasAdoptedServerValue.current = true;
    if (serverPreference !== preference) setThemePreference(serverPreference);
  }, [profile, isLoading]);
};
