import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Calendar, Search, Settings } from 'lucide-react'

export default function Navigation() {
  const navItems = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/calendar', icon: Calendar, label: '달력' },
    { path: '/search', icon: Search, label: '검색' },
    { path: '/settings', icon: Settings, label: '설정' },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary-500 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}