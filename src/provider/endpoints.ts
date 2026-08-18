export const API_ENDPOINTS = {
  auth: {
    signin: "/auth/signin",
    register: "/auth/signup",
    verifyEmail: "/auth/verify-email",
    resendVerificationOtp: "/auth/resend-verification-otp",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
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

  notifications: {
    list: "/notifications",
    unreadCount: "/notifications/unread-count",
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: "/notifications/read-all",
    delete: (id: string) => `/notifications/${id}`,
    clearAll: "/notifications",
    registerDevice: "/notifications/device",
  },

  jobApplications: {
    list: "/job-applications",
    stats: "/job-applications/stats",
    detail: (id: string) => `/job-applications/${id}`,
    create: "/job-applications",
    update: (id: string) => `/job-applications/${id}`,
    delete: (id: string) => `/job-applications/${id}`,

    linkNote: (id: string) => `/job-applications/${id}/notes`,
    unlinkNote: (id: string, noteId: string) =>
      `/job-applications/${id}/notes/${noteId}`,

    linkRecording: (id: string) => `/job-applications/${id}/recordings`,
    unlinkRecording: (id: string, recordingId: string) =>
      `/job-applications/${id}/recordings/${recordingId}`,
  },

  careerProfile: {
    // One row per user, so there is no id in the path. The save URL matching
    // the fetch URL is deliberate: useSubmitData refetches the resolved URL
    // key, which is exactly the key useGetData reads from.
    detail: "/career-profile",
    save: "/career-profile",
    delete: "/career-profile",
  },

  resume: {
    // Templates
    templatesList: "/resume/templates",
    templateDetail: (id: string) => `/resume/templates/${id}`,
    uploadThumbnail: (id: string) => `/resume/templates/${id}/thumbnail`,

    // Resumes
    list: "/resume",
    detail: (id: string) => `/resume/${id}`,
    create: "/resume",
    update: (id: string) => `/resume/${id}`,
    delete: (id: string) => `/resume/${id}`,
    export: (id: string) => `/resume/${id}/export`,
  },
};
