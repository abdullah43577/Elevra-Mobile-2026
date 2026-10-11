import { create } from "zustand";

interface ProfileNeededState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useProfileNeededStore = create<ProfileNeededState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
