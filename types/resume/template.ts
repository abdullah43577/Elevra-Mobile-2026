import { ResumeData } from "./data";
import { LayoutKey, ThemeFor } from "./theme";

export interface Template<K extends LayoutKey = LayoutKey> {
  id: string;
  name: string;
  description?: string;
  category: string;
  layoutKey: K;
  themeId: string;
  theme: ThemeFor<K>;
  defaultData: ResumeData;
  thumbnail?: string;
  isPremium: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// The type your API actually returns: a template that could be any one of the 5,
// with layoutKey and theme correctly paired per-variant.
export type AnyTemplate = Template<LayoutKey>;

export interface TemplateFilters {
  category?: string;
  isPremium?: boolean;
  search?: string;
}
