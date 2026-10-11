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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AnyTemplate = Template<LayoutKey>;

export interface TemplateFilters {
  category?: string;
  search?: string;
}
