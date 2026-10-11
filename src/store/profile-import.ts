import { create } from "zustand";
import { ImportedProfile } from "../../types/career-profile";

interface ProfileImportState {
  draft: ImportedProfile | null;
  setDraft: (draft: ImportedProfile) => void;
  takeDraft: () => ImportedProfile | null;
}

// Kept out of the query cache: until Save it is a proposal, not the profile.
// Read-and-clear, so reopening the editor shows the saved profile.
export const useProfileImportStore = create<ProfileImportState>((set, get) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  takeDraft: () => {
    const { draft } = get();
    if (draft) set({ draft: null });
    return draft;
  },
}));
