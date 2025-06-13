import React, { createContext, useContext, useState, useEffect } from 'react'

const DiaryContext = createContext()

export function useDiary() {
  const context = useContext(DiaryContext)
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider')
  }
  return context
}

export function DiaryProvider({ children }) {
  const [entries, setEntries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortMode, setSortMode] = useState('date') // 'date' | 'relevance'
  const [settings, setSettings] = useState({
    theme: 'light',
    password: null,
    isLocked: false,
    exportFormat: 'text',
    language: 'ko'
  })

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem('diary-entries')
      const savedSettings = localStorage.getItem('diary-settings')
      
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries)
        console.log('Loaded entries:', parsedEntries)
        setEntries(parsedEntries)
      }
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        console.log('Loaded settings:', parsedSettings)
        setSettings(parsedSettings)
        // Apply theme immediately
        applyTheme(parsedSettings.theme)
      } else {
        // Apply default theme
        applyTheme('light')
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
    }
  }, [])

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    try {
      console.log('Saving entries:', entries)
      localStorage.setItem('diary-entries', JSON.stringify(entries))
    } catch (error) {
      console.error('Error saving entries to localStorage:', error)
    }
  }, [entries])

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    try {
      console.log('Saving settings:', settings)
      localStorage.setItem('diary-settings', JSON.stringify(settings))
      applyTheme(settings.theme)
    } catch (error) {
      console.error('Error saving settings to localStorage:', error)
    }
  }, [settings])

  const applyTheme = (theme) => {
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else if (theme === 'system') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  const addEntry = (entryData) => {
    try {
      const newEntry = {
        ...entryData,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      console.log('Adding new entry:', newEntry)
      setEntries(prev => {
        const updated = [newEntry, ...prev]
        console.log('Updated entries array:', updated)
        return updated
      })
      return newEntry
    } catch (error) {
      console.error('Error adding entry:', error)
      throw error
    }
  }

  const updateEntry = (updatedEntry) => {
    try {
      const entryWithTimestamp = { ...updatedEntry, updatedAt: Date.now() }
      console.log('Updating entry:', entryWithTimestamp)
      setEntries(prev => {
        const updated = prev.map(entry => 
          entry.id === updatedEntry.id ? entryWithTimestamp : entry
        )
        console.log('Updated entries array:', updated)
        return updated
      })
      return entryWithTimestamp
    } catch (error) {
      console.error('Error updating entry:', error)
      throw error
    }
  }

  const deleteEntry = (id) => {
    try {
      console.log('Deleting entry with id:', id)
      setEntries(prev => {
        const updated = prev.filter(entry => entry.id !== id)
        console.log('Updated entries array after deletion:', updated)
        return updated
      })
    } catch (error) {
      console.error('Error deleting entry:', error)
      throw error
    }
  }

  const filteredEntries = React.useMemo(() => {
    let filtered = searchQuery 
      ? entries.filter(entry => 
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : entries

    // Sort entries
    if (sortMode === 'date') {
      filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else {
      // For relevance, we'll use a simple scoring system
      filtered = filtered.sort((a, b) => {
        if (!searchQuery) return new Date(b.date).getTime() - new Date(a.date).getTime()
        
        const aScore = (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                      (a.content.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0)
        const bScore = (b.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                      (b.content.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0)
        
        return bScore - aScore
      })
    }

    return filtered
  }, [entries, searchQuery, sortMode])

  const updateSettings = (newSettings) => {
    try {
      console.log('Updating settings:', newSettings)
      setSettings(prev => {
        const updated = { ...prev, ...newSettings }
        console.log('Updated settings:', updated)
        return updated
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  }

  const exportEntries = () => {
    try {
      const content = entries.map(entry => {
        const date = new Date(entry.date).toLocaleDateString('ko-KR')
        return `${date} - ${entry.title}\n\n${entry.content}\n\n---\n\n`
      }).join('')

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `diary_export_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting entries:', error)
      throw error
    }
  }

  const value = {
    entries,
    filteredEntries,
    searchQuery,
    setSearchQuery,
    sortMode,
    setSortMode,
    settings,
    updateSettings,
    addEntry,
    updateEntry,
    deleteEntry,
    exportEntries,
  }

  return (
    <DiaryContext.Provider value={value}>
      {children}
    </DiaryContext.Provider>
  )
}