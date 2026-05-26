import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

interface ToastState {
  type: ToastType;
  message: string;
  visible: boolean;
  showToast: (type: ToastType, message: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  type: "info",
  message: "",
  visible: false,
  showToast: (type, message) => {
    set({ type, message, visible: true });
    setTimeout(() => set({ visible: false }), 4000); // Hide after 4s
  },
  hideToast: () => set({ visible: false }),
}));
