import { create } from "zustand";
import { ImportedProfile } from "../../types/career-profile";

interface ProfileImportState {
  draft: ImportedProfile | null;
  setDraft: (draft: ImportedProfile) => void;
  takeDraft: () => ImportedProfile | null;
}

/*
  Hands an imported profile from the screen that ran the import to the editor
  that reviews it. Too large for a route param, and it must not go near the
  query cache: until the user taps Save it is a proposal, not their profile.

  In memory only, and taken exactly once — read-and-clear — so backing out of
  the editor and opening it again shows the saved profile, not a stale import.
*/
export const useProfileImportStore = create<ProfileImportState>((set, get) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  takeDraft: () => {
    const { draft } = get();
    if (draft) set({ draft: null });
    return draft;
  },
}));
