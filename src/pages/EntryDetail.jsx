import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDiary } from '../contexts/DiaryContext'
import { ArrowLeft, Save, Trash2, Plus, X, Camera } from 'lucide-react'

export default function EntryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { entries, addEntry, updateEntry, deleteEntry } = useDiary()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [photos, setPhotos] = useState([])
  const [date, setDate] = useState(new Date().toISOString())
  const [isNew, setIsNew] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (id === 'new') {
      setIsNew(true)
      setDate(new Date().toISOString())
    } else {
      const entry = entries.find(e => e.id === id)
      if (entry) {
        setTitle(entry.title)
        setContent(entry.content)
        setPhotos(entry.photos || [])
        setDate(entry.date)
      }
    }
  }, [id, entries])

  const handleSave = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }

    setIsSaving(true)
    try {
      const entryData = {
        title: title.trim(),
        content: content.trim(),
        photos,
        date,
      }

      console.log('Saving entry data:', entryData)

      if (isNew) {
        const newEntry = addEntry(entryData)
        console.log('New entry created:', newEntry)
      } else {
        const existingEntry = entries.find(e => e.id === id)
        if (existingEntry) {
          const updatedEntry = updateEntry({
            ...existingEntry,
            ...entryData,
          })
          console.log('Entry updated:', updatedEntry)
        }
      }

      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate('/')
      }, 100)
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      if (!isNew && id) {
        deleteEntry(id)
        navigate('/')
      }
    }
  }

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotos(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
            {isNew ? '새 일기' : '일기 수정'}
          </h1>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 transition-colors"
            >
              <Trash2 size={20} className="text-red-600 dark:text-red-400" />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Date */}
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">{formatDate(date)}</p>
        </div>

        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-semibold text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-0 focus:ring-0 p-0 bg-transparent"
          />
        </div>

        {/* Content */}
        <div>
          <textarea
            placeholder="오늘 하루는 어땠나요?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 border-0 focus:ring-0 p-0 bg-transparent resize-none leading-relaxed"
          />
        </div>

        {/* Photos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              사진 ({photos.length})
            </h3>
            <label className="flex items-center gap-2 px-3 py-2 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-lg cursor-pointer transition-colors">
              <Plus size={16} />
              <span className="text-sm font-medium">사진 추가</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`사진 ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}