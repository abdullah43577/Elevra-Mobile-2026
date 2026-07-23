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
    list: "/notes", // GET - all notes (with optional folderId & search query params)
    archived: "/notes/archived", // GET - archived notes
    detail: (id: string) => `/notes/${id}`, // GET - single note
    create: "/notes", // POST - create note
    update: (id: string) => `/notes/${id}`, // PUT - update note
    delete: (id: string) => `/notes/${id}`, // DELETE - delete note
    toggleArchive: (id: string) => `/notes/${id}/archive`, // POST - toggle archive
    togglePin: (id: string) => `/notes/${id}/pin`, // POST - toggle pin
    generateSummary: (id: string) => `/notes/${id}/summary`, // POST - generate AI summary

    // Folders
    foldersList: "/notes/folders", // GET - all folders
    folderDetail: (id: string) => `/notes/folders/${id}`, // GET - single folder
    folderNotesCount: (id: string) => `/notes/folders/${id}/notes-count`, // GET - notes count
    createFolder: "/notes/folders", // POST - create folder
    updateFolder: (id: string) => `/notes/folders/${id}`, // PUT - update folder
    deleteFolder: (id: string) => `/notes/folders/${id}`, // DELETE - delete folder

    // Tags
    tagsList: "/notes/tags", // GET - all tags
    tagDetail: (id: string) => `/notes/tags/${id}`, // GET - single tag
    createTag: "/notes/tags", // POST - create tag
    deleteTag: (id: string) => `/notes/tags/${id}`, // DELETE - delete tag
  },
};
