import { create } from "zustand";

type Session = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  /// more later on
};

export const useSession = create<Session>((set) => ({
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
}));
