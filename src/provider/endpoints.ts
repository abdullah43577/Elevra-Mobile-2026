export const API_ENDPOINTS = {
  auth: {
    signin: "/auth/signin",
    register: "/auth/signup",
    verifyEmail: "/auth/verify-email",
    resendVerificationOtp: "/auth/resend-verification-otp",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "",
    getProfile: "/auth/profile",
    refreshToken: "/auth/token",
    updateProfile: "/auth/profile",
    updateSettings: "/auth/profile/settings",
  },

  professions: {
    list: "/professions",
  },

  notes: {
    // Notes
    list: "/notes",
    archived: "/notes/archived",
    detail: (id: string) => `/notes/${id}`,
    create: "/notes",
    update: (id: string) => `/notes/${id}`,
    delete: (id: string) => `/notes/${id}`,
    toggleArchive: (id: string) => `/notes/${id}/archive`,
    togglePin: (id: string) => `/notes/${id}/pin`,
    // generateSummary: (id: string) => `/notes/${id}/summary`,
    generateSummaryStream: (id: string) => `notes/${id}/summary/stream`,

    // Folders
    foldersList: "/notes/folders",
    folderDetail: (id: string) => `/notes/folders/${id}`,
    folderNotesCount: (id: string) => `/notes/folders/${id}/notes-count`,
    createFolder: "/notes/folders",
    updateFolder: (id: string) => `/notes/folders/${id}`,
    deleteFolder: (id: string) => `/notes/folders/${id}`,

    // Tags
    tagsList: "/notes/tags",
    tagDetail: (id: string) => `/notes/tags/${id}`,
    createTag: "/notes/tags",
    deleteTag: (id: string) => `/notes/tags/${id}`,
  },

  voiceNotes: {
    list: "/voice-notes",
    detail: (id: string) => `/voice-notes/${id}`,
    create: "/voice-notes",
    update: (id: string) => `/voice-notes/${id}`,
    delete: (id: string) => `/voice-notes/${id}`,
    transcribe: (id: string) => `/voice-notes/${id}/transcribe`,
  },
};
