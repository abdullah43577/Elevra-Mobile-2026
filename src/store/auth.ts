import { create } from "zustand";
import { tokenStorage } from "@/provider/token-storage";

interface AuthState {
  hasToken: boolean | null;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
  expoPushToken: string | null;
  setExpoPushToken: (value: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  hasToken: null,
  isLoading: true,
  checkAuthStatus: async () => {
    const token = await tokenStorage.getRefreshToken();
    set({ hasToken: !!token, isLoading: false });
  },
  setAuthenticated: (value) => set({ hasToken: value }),
  expoPushToken: null,
  setExpoPushToken: (value) => set({ expoPushToken: value }),
}));
