import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { ThemePreference } from "@/constants/theme";

const THEME_KEY = "elevra_theme_preference";

interface ThemeState {
  preference: ThemePreference;
  isLoading: boolean;
  checkThemePreference: () => Promise<void>;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
}

const isThemePreference = function (value: string | null): value is ThemePreference {
  return value === "SYSTEM" || value === "LIGHT" || value === "DARK";
};

export const useThemeStore = create<ThemeState>((set) => ({
  preference: "SYSTEM",
  isLoading: true,

  checkThemePreference: async () => {
    try {
      const value = await AsyncStorage.getItem(THEME_KEY);
      set({
        preference: isThemePreference(value) ? value : "SYSTEM",
        isLoading: false,
      });
    } catch {
      set({ preference: "SYSTEM", isLoading: false });
    }
  },

  setThemePreference: async (preference) => {
    set({ preference });
    await AsyncStorage.setItem(THEME_KEY, preference);
  },
}));
