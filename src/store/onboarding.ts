import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "elevra_has_onboarded";

interface OnboardingState {
  hasOnboarded: boolean;
  isLoading: boolean;
  checkOnboardingStatus: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasOnboarded: false,
  isLoading: true,

  checkOnboardingStatus: async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      set({ hasOnboarded: value === "true", isLoading: false });
    } catch {
      set({ hasOnboarded: false, isLoading: false });
    }
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    set({ hasOnboarded: true });
  },
}));
