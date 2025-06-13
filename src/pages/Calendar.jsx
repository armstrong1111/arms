import React, { useState } from 'react'
import { useDiary } from '../contexts/DiaryContext'
import DiaryCard from '../components/DiaryCard'
import FloatingActionButton from '../components/FloatingActionButton'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Calendar() {
  const { filteredEntries } = useDiary()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ]

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const hasEntryOnDate = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return filteredEntries.some(entry => 
      entry.date.split('T')[0] === dateString
    )
  }

  const getEntriesForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return filteredEntries.filter(entry => 
      entry.date.split('T')[0] === dateString
    )
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setSelectedDate(newDate)
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSameDate = (date1, date2) => {
    return date1.toDateString() === date2.toDateString()
  }

  const days = getDaysInMonth(selectedDate)
  const selectedDateEntries = getEntriesForDate(selectedDate)

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {selectedDate.getFullYear()}년 {monthNames[selectedDate.getMonth()]}
          </h1>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Calendar */}
        <div className="card mb-6">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={index} className="aspect-square flex items-center justify-center">
                {day && (
                  <button
                    onClick={() => setSelectedDate(day)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors relative ${
                      isToday(day)
                        ? 'bg-primary-100 text-primary-700'
                        : isSameDate(day, selectedDate)
                        ? 'bg-primary-500 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {day.getDate()}
                    {hasEntryOnDate(day) && (
                      <div className="absolute bottom-1 w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected date entries */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedDate.toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
              weekday: 'short'
            })}의 일기
          </h2>
          
          {selectedDateEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">이 날에 작성된 일기가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateEntries.map((entry, index) => (
                <div key={entry.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <DiaryCard entry={entry} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FloatingActionButton />
    </div>
  )
}