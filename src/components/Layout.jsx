import React from 'react'
import { useLocation } from 'react-router-dom'
import { useDiary } from '../contexts/DiaryContext'
import Navigation from './Navigation'

export default function Layout({ children }) {
  const location = useLocation()
  const { settings } = useDiary()
  const isEntryPage = location.pathname.includes('/entry/')

  return (
    <div className={`app min-h-screen ${settings.theme === 'dark' ? 'dark' : ''}`}>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen shadow-xl relative">
        {children}
        {!isEntryPage && <Navigation />}
      </div>
    </div>
  )
}