import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Camera } from 'lucide-react'

export default function DiaryCard({ entry, searchQuery }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/entry/${entry.id}`)
  }

  const highlightText = (text, query) => {
    if (!query) return text
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) => (
      <span
        key={index}
        className={part.toLowerCase() === query.toLowerCase() ? 'bg-yellow-200' : ''}
      >
        {part}
      </span>
    ))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    })
  }

  return (
    <div 
      onClick={handleClick}
      className="card hover-lift cursor-pointer mx-4 mb-4 fade-in"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar size={16} className="mr-2" />
          {formatDate(entry.date)}
        </div>
        {entry.photos && entry.photos.length > 0 && (
          <div className="flex items-center text-gray-500 text-sm">
            <Camera size={16} className="mr-1" />
            {entry.photos.length}
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
        {highlightText(entry.title, searchQuery)}
      </h3>

      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
        {highlightText(entry.content, searchQuery)}
      </p>

      {entry.photos && entry.photos.length > 0 && (
        <div className="mt-4">
          {entry.photos.length === 1 ? (
            <img
              src={entry.photos[0]}
              alt="일기 사진"
              className="w-full h-32 object-cover rounded-lg"
            />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {entry.photos.slice(0, 3).map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`일기 사진 ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  {index === 2 && entry.photos.length > 3 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">
                        +{entry.photos.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}