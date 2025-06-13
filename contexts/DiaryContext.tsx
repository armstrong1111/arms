import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DiaryEntry, AppSettings, ViewMode, SortMode } from '@/types/diary';
import { storageService } from '@/utils/storage';

interface DiaryContextType {
  entries: DiaryEntry[];
  settings: AppSettings;
  viewMode: ViewMode;
  sortMode: SortMode;
  searchQuery: string;
  filteredEntries: DiaryEntry[];
  isLoading: boolean;
  
  // Actions
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEntry: (entry: DiaryEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setViewMode: (mode: ViewMode) => void;
  setSortMode: (mode: SortMode) => void;
  setSearchQuery: (query: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  exportEntries: () => Promise<string>;
  refreshEntries: () => Promise<void>;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export function useDiary() {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
}

interface DiaryProviderProps {
  children: ReactNode;
}

export function DiaryProvider({ children }: DiaryProviderProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    isLocked: false,
    exportFormat: 'pdf',
    language: 'ko'
  });
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortMode, setSortMode] = useState<SortMode>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [entriesData, settingsData] = await Promise.all([
        storageService.getDiaryEntries(),
        storageService.getAppSettings()
      ]);
      
      setEntries(entriesData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort entries
  const filteredEntries = React.useMemo(() => {
    let filtered = searchQuery 
      ? storageService.searchEntries(entries, searchQuery)
      : entries;

    // Sort entries
    if (sortMode === 'date') {
      filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      // For relevance, we'll use a simple scoring system
      filtered = filtered.sort((a, b) => {
        if (!searchQuery) return new Date(b.date).getTime() - new Date(a.date).getTime();
        
        const aScore = (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                      (a.content.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0);
        const bScore = (b.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                      (b.content.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0);
        
        return bScore - aScore;
      });
    }

    return filtered;
  }, [entries, searchQuery, sortMode]);

  const addEntry = async (entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: DiaryEntry = {
      ...entryData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storageService.saveDiaryEntry(newEntry);
    setEntries(prev => [newEntry, ...prev]);
  };

  const updateEntry = async (entry: DiaryEntry) => {
    const updatedEntry = { ...entry, updatedAt: Date.now() };
    await storageService.saveDiaryEntry(updatedEntry);
    setEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
  };

  const deleteEntry = async (id: string) => {
    await storageService.deleteDiaryEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    await storageService.saveAppSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  const exportEntries = async () => {
    return await storageService.exportEntries(entries, settings.exportFormat);
  };

  const refreshEntries = async () => {
    const entriesData = await storageService.getDiaryEntries();
    setEntries(entriesData);
  };

  const value: DiaryContextType = {
    entries,
    settings,
    viewMode,
    sortMode,
    searchQuery,
    filteredEntries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    setViewMode,
    setSortMode,
    setSearchQuery,
    updateSettings,
    exportEntries,
    refreshEntries,
  };

  return (
    <DiaryContext.Provider value={value}>
      {children}
    </DiaryContext.Provider>
  );
}