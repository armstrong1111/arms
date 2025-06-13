import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry, AppSettings } from '@/types/diary';

const DIARY_ENTRIES_KEY = 'diary_entries';
const APP_SETTINGS_KEY = 'app_settings';

export const storageService = {
  // Diary Entries
  async getDiaryEntries(): Promise<DiaryEntry[]> {
    try {
      const entries = await AsyncStorage.getItem(DIARY_ENTRIES_KEY);
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error getting diary entries:', error);
      return [];
    }
  },

  async saveDiaryEntry(entry: DiaryEntry): Promise<void> {
    try {
      const entries = await this.getDiaryEntries();
      const existingIndex = entries.findIndex(e => e.id === entry.id);
      
      if (existingIndex >= 0) {
        entries[existingIndex] = entry;
      } else {
        entries.push(entry);
      }
      
      await AsyncStorage.setItem(DIARY_ENTRIES_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving diary entry:', error);
    }
  },

  async deleteDiaryEntry(id: string): Promise<void> {
    try {
      const entries = await this.getDiaryEntries();
      const filteredEntries = entries.filter(e => e.id !== id);
      await AsyncStorage.setItem(DIARY_ENTRIES_KEY, JSON.stringify(filteredEntries));
    } catch (error) {
      console.error('Error deleting diary entry:', error);
    }
  },

  // App Settings
  async getAppSettings(): Promise<AppSettings> {
    try {
      const settings = await AsyncStorage.getItem(APP_SETTINGS_KEY);
      return settings ? JSON.parse(settings) : {
        theme: 'system',
        isLocked: false,
        exportFormat: 'pdf',
        language: 'ko'
      };
    } catch (error) {
      console.error('Error getting app settings:', error);
      return {
        theme: 'system',
        isLocked: false,
        exportFormat: 'pdf',
        language: 'ko'
      };
    }
  },

  async saveAppSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving app settings:', error);
    }
  },

  // Search
  searchEntries(entries: DiaryEntry[], query: string): DiaryEntry[] {
    if (!query.trim()) return entries;
    
    const searchTerm = query.toLowerCase();
    return entries.filter(entry => 
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.content.toLowerCase().includes(searchTerm)
    );
  },

  // Export
  async exportEntries(entries: DiaryEntry[], format: 'pdf' | 'text'): Promise<string> {
    const content = entries.map(entry => {
      const date = new Date(entry.date).toLocaleDateString('ko-KR');
      return `${date} - ${entry.title}\n\n${entry.content}\n\n---\n\n`;
    }).join('');

    return content;
  }
};