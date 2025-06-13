import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

export default function FloatingActionButton() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/entry/new')
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-4 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-10"
    >
      <Plus size={24} strokeWidth={2.5} />
    </button>
  )
}