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
  tags?: NoteTag[];
  aiSummary?: string | null;
  summaryGeneratedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

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
