// ============================================
// Base Types
// ============================================

export interface Folder {
  id: string;
  name: string;
  color?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    notes: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    notes: number;
  };
}

export interface NoteTag {
  id: string;
  noteId: string;
  tagId: string;
  tag: Tag;
}

export interface Note {
  id: string;
  title: string;
  content?: string | null;
  isArchived: boolean;
  isPinned: boolean;
  userId: string;
  folderId?: string | null;
  folder?: Folder | null;
  noteTags?: NoteTag[];
  tags?: Tag[];
  aiSummary?: string | null;
  summaryGeneratedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Request Types
// ============================================

export interface CreateNoteRequest {
  title: string;
  content?: string;
  folderId?: string;
  tagNames?: string[];
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  folderId?: string | null;
  isArchived?: boolean;
  isPinned?: boolean;
}

export interface GetNotesQueryParams {
  folderId?: string;
  search?: string;
}

export interface CreateFolderRequest {
  name: string;
  color?: string;
}

export interface UpdateFolderRequest {
  name?: string;
  color?: string;
}

export interface CreateTagRequest {
  name: string;
}

// ============================================
// Response Types (Wrapped in APIResponse)
// ============================================

// These will be used with the generic APIResponse<T> type
// Example: APIResponse<Note[]> for list of notes

// For the API response structure, we already have:
// export interface APIResponse<T> {
//   message: string;
//   data: T;
//   status?: number;
// }

// For endpoints that return just data without nested structure:
// - GET /notes -> APIResponse<Note[]>
// - GET /notes/archived -> APIResponse<Note[]>
// - GET /notes/:id -> APIResponse<Note>
// - POST /notes -> APIResponse<Note>
// - PUT /notes/:id -> APIResponse<Note>
// - DELETE /notes/:id -> APIResponse<null> (204 No Content)
// - POST /notes/:id/archive -> APIResponse<Note>
// - POST /notes/:id/pin -> APIResponse<Note>
// - POST /notes/:id/summary -> APIResponse<{ summary: string; noteId: string; generatedAt: string }>
// - GET /folders -> APIResponse<Folder[]>
// - GET /folders/:id -> APIResponse<Folder>
// - POST /folders -> APIResponse<Folder>
// - PUT /folders/:id -> APIResponse<Folder>
// - DELETE /folders/:id -> APIResponse<null>
// - GET /folders/:id/notes-count -> APIResponse<{ count: number }>
// - GET /tags -> APIResponse<Tag[]>
// - GET /tags/:id -> APIResponse<Tag>
// - POST /tags -> APIResponse<Tag>
// - DELETE /tags/:id -> APIResponse<null>

// ============================================
// Hook Return Types
// ============================================

export interface UseNotesReturn {
  notes: Note[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseFoldersReturn {
  folders: Folder[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseTagsReturn {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseCreateNoteReturn {
  createNote: (data: CreateNoteRequest) => void;
  isCreating: boolean;
}

export interface UseUpdateNoteReturn {
  updateNote: (id: string, data: UpdateNoteRequest) => void;
  isUpdating: boolean;
}

export interface UseDeleteNoteReturn {
  deleteNote: (id: string) => void;
  isDeleting: boolean;
}

export interface UseToggleArchiveReturn {
  toggleArchive: (id: string) => void;
  isToggling: boolean;
}

export interface UseTogglePinReturn {
  togglePin: (id: string) => void;
  isToggling: boolean;
}

export interface UseGenerateSummaryReturn {
  generateSummary: (id: string) => void;
  isGenerating: boolean;
}

// ============================================
// Component Props Types
// ============================================

export interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onPin: () => void;
}

export interface FilterChipsProps {
  folders: Folder[];
  selectedFolder: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onClearFilter: () => void;
}

export interface EmptyStateProps {
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export interface SkeletonCardProps {
  count?: number;
}
