import React, { useState, useEffect } from 'react'
import { useDiary } from '../contexts/DiaryContext'
import DiaryCard from '../components/DiaryCard'
import { Search as SearchIcon, SortAsc, SortDesc, X } from 'lucide-react'

export default function Search() {
  const { filteredEntries, searchQuery, setSearchQuery, sortMode, setSortMode } = useDiary()
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setSearchQuery(localSearchQuery)
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [localSearchQuery, setSearchQuery])

  const clearSearch = () => {
    setLocalSearchQuery('')
    setSearchQuery('')
  }

  const toggleSortMode = () => {
    setSortMode(sortMode === 'date' ? 'relevance' : 'date')
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        {/* Search bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="일기 검색..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
          {localSearchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={20} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Filter row */}
        {searchQuery && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {filteredEntries.length}개의 결과
            </span>
            <button
              onClick={toggleSortMode}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {sortMode === 'date' ? (
                <SortDesc size={16} className="text-gray-600" />
              ) : (
                <SortAsc size={16} className="text-gray-600" />
              )}
              <span className="text-sm font-medium text-gray-600">
                {sortMode === 'date' ? '날짜순' : '관련도순'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-4">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8">
            <div className="text-center slide-up">
              {!searchQuery ? (
                <>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    일기 검색
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    제목이나 내용에서 찾고 싶은<br />
                    키워드를 입력해보세요
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    검색 결과가 없습니다
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    다른 키워드로 검색해보세요
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredEntries.map((entry, index) => (
              <div key={entry.id} style={{ animationDelay: `${index * 100}ms` }}>
                <DiaryCard entry={entry} searchQuery={searchQuery} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}