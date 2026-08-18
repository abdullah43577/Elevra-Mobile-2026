import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export const SETUP_STATE_KEY = "elevra_setup_state";

interface PersistedSetup {
  hasCompletedSetup: boolean;
  isChecklistDismissed: boolean;
}

interface SetupState extends PersistedSetup {
  isLoading: boolean;
  checkSetupStatus: () => Promise<void>;
  completeSetup: () => Promise<void>;
  dismissChecklist: () => Promise<void>;
}

/*
  First-run setup, tracked per device rather than on the server.

  "Has this person been offered setup yet" is a UI fact, not account data — and
  the things it leads to (a career profile, a notification permission) are each
  already knowable from the server or the OS. Storing a flag beside them would
  give two sources of truth for the same question.

  The key is wiped on sign-out alongside the query cache, so the next account to
  sign in on this device gets its own run through setup.
*/
export const useSetupStore = create<SetupState>((set, get) => {
  const persist = async function (next: PersistedSetup) {
    set(next);
    try {
      await AsyncStorage.setItem(SETUP_STATE_KEY, JSON.stringify(next));
    } catch {
      // A failed write only means setup is offered again; not worth surfacing.
    }
  };

  return {
    hasCompletedSetup: false,
    isChecklistDismissed: false,
    isLoading: true,

    checkSetupStatus: async () => {
      try {
        const stored = await AsyncStorage.getItem(SETUP_STATE_KEY);
        const parsed: Partial<PersistedSetup> = stored ? JSON.parse(stored) : {};

        set({
          hasCompletedSetup: parsed.hasCompletedSetup === true,
          isChecklistDismissed: parsed.isChecklistDismissed === true,
          isLoading: false,
        });
      } catch {
        set({ hasCompletedSetup: false, isChecklistDismissed: false, isLoading: false });
      }
    },

    completeSetup: async () => {
      await persist({
        hasCompletedSetup: true,
        isChecklistDismissed: get().isChecklistDismissed,
      });
    },

    dismissChecklist: async () => {
      await persist({
        hasCompletedSetup: get().hasCompletedSetup,
        isChecklistDismissed: true,
      });
    },
  };
});
