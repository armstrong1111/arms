export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  photos: string[];
  createdAt: number;
  updatedAt: number;
  mood?: 'happy' | 'sad' | 'neutral' | 'excited' | 'angry';
  weather?: string;
  location?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  password?: string;
  isLocked: boolean;
  exportFormat: 'pdf' | 'text';
  language: 'ko' | 'en';
}

export type ViewMode = 'calendar' | 'list';
export type SortMode = 'date' | 'relevance';