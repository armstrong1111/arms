import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DiaryProvider } from './contexts/DiaryContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Calendar from './pages/Calendar'
import Search from './pages/Search'
import Settings from './pages/Settings'
import EntryDetail from './pages/EntryDetail'
import './App.css'

function App() {
  return (
    <DiaryProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/entry/:id" element={<EntryDetail />} />
            <Route path="/entry/new" element={<EntryDetail />} />
          </Routes>
        </Layout>
      </Router>
    </DiaryProvider>
  )
}

export default App