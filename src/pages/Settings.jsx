import React, { useState } from 'react'
import { useDiary } from '../contexts/DiaryContext'
import { 
  Moon, 
  Sun, 
  Monitor, 
  Lock, 
  Download, 
  Trash2,
  Info 
} from 'lucide-react'

export default function Settings() {
  const { settings, updateSettings, exportEntries, entries } = useDiary()
  const [isExporting, setIsExporting] = useState(false)

  const handleThemeChange = (theme) => {
    updateSettings({ theme })
  }

  const handlePasswordToggle = () => {
    if (settings.password) {
      // Remove password
      if (window.confirm('정말로 앱 잠금을 해제하시겠습니까?')) {
        updateSettings({ password: null, isLocked: false })
      }
    } else {
      // Set password (simplified - in real app, would show password input)
      if (window.confirm('간단한 비밀번호를 설정하시겠습니까?')) {
        updateSettings({ password: '1234', isLocked: true })
      }
    }
  }

  const handleExport = async () => {
    if (entries.length === 0) {
      alert('내보낼 일기가 없습니다.')
      return
    }

    setIsExporting(true)
    try {
      exportEntries()
      alert(`${entries.length}개의 일기가 내보내기 되었습니다.`)
    } catch (error) {
      alert('내보내기 중 오류가 발생했습니다.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAllData = () => {
    if (window.confirm('정말로 모든 일기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.removeItem('diary-entries')
      localStorage.removeItem('diary-settings')
      alert('모든 데이터가 삭제되었습니다.')
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">설정</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* 테마 설정 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">테마</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Monitor size={20} className="text-gray-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">화면 테마</p>
                  <p className="text-sm text-gray-500">앱의 밝기 설정을 변경합니다</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.theme === 'light'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Sun size={16} />
                라이트
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.theme === 'dark'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Moon size={16} />
                다크
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.theme === 'system'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Monitor size={16} />
                시스템
              </button>
            </div>
          </div>
        </div>

        {/* 보안 설정 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">보안</h2>
          <button
            onClick={handlePasswordToggle}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Lock size={20} className="text-gray-500 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-800">앱 잠금</p>
                <p className="text-sm text-gray-500">
                  {settings.password ? '앱 잠금이 활성화되어 있습니다' : '앱 잠금을 설정하세요'}
                </p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${
              settings.password ? 'bg-primary-500' : 'bg-gray-300'
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                settings.password ? 'translate-x-6 ml-1' : 'translate-x-1'
              }`} />
            </div>
          </button>
        </div>

        {/* 데이터 관리 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">데이터 관리</h2>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Download size={20} className="text-gray-500 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-800">
                  {isExporting ? '내보내는 중...' : '일기 내보내기'}
                </p>
                <p className="text-sm text-gray-500">
                  모든 일기를 텍스트 파일로 내보냅니다
                </p>
              </div>
            </button>
            
            <button
              onClick={handleDeleteAllData}
              className="w-full flex items-center p-3 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={20} className="text-red-500 mr-3" />
              <div className="text-left">
                <p className="font-medium text-red-600">모든 데이터 삭제</p>
                <p className="text-sm text-gray-500">
                  모든 일기와 설정을 삭제합니다
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 정보 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">정보</h2>
          <div className="flex items-center p-3">
            <Info size={20} className="text-gray-500 mr-3" />
            <div>
              <p className="font-medium text-gray-800">앱 버전</p>
              <p className="text-sm text-gray-500">1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-gray-500 text-sm">
          나의 일기장 📖<br />
          소중한 추억을 기록하고 보관하세요
        </p>
      </div>
    </div>
  )
}