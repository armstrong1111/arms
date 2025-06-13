import React, { useState } from 'react'
import { useDiary } from '../contexts/DiaryContext'
import DiaryCard from '../components/DiaryCard'
import FloatingActionButton from '../components/FloatingActionButton'
import { SortAsc, SortDesc, Calendar, List } from 'lucide-react'

export default function Home() {
  const { filteredEntries, sortMode, setSortMode } = useDiary()
  const [viewMode, setViewMode] = useState('list')

  const toggleSortMode = () => {
    setSortMode(sortMode === 'date' ? 'relevance' : 'date')
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'calendar' : 'list')
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">나의 일기</h1>
          <div className="flex gap-2">
            <button
              onClick={toggleSortMode}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {sortMode === 'date' ? (
                <SortDesc size={20} className="text-gray-600" />
              ) : (
                <SortAsc size={20} className="text-gray-600" />
              )}
            </button>
            <button
              onClick={toggleViewMode}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {viewMode === 'list' ? (
                <Calendar size={20} className="text-gray-600" />
              ) : (
                <List size={20} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-4">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8">
            <div className="text-center slide-up">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                첫 번째 일기를 작성해보세요
              </h2>
              <p className="text-gray-600 leading-relaxed">
                오늘 하루 있었던 일들을 기록하고<br />
                소중한 추억을 남겨보세요
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredEntries.map((entry, index) => (
              <div key={entry.id} style={{ animationDelay: `${index * 100}ms` }}>
                <DiaryCard entry={entry} />
              </div>
            ))}
          </div>
        )}
      </div>

      <FloatingActionButton />
    </div>
  )
}