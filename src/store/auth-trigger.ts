import { create } from "zustand";

interface AuthTriggerState {
  authVersion: number;
  triggerAuthCheck: () => void;
}

export const useAuthTrigger = create<AuthTriggerState>((set) => ({
  authVersion: 0,
  triggerAuthCheck: () =>
    set((state) => ({ authVersion: state.authVersion + 1 })),
}));
