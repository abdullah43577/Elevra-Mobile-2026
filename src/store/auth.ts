import { create } from "zustand";
import { tokenStorage } from "@/provider/token-storage";

interface AuthState {
  hasToken: boolean | null; // null = not checked yet (splash/loading state)
  checkAuthStatus: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  hasToken: null,
  checkAuthStatus: async () => {
    const token = await tokenStorage.getRefreshToken();
    set({ hasToken: !!token });
  },
  setAuthenticated: (value) => set({ hasToken: value }),
}));
