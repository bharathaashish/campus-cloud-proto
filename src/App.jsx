import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './theme-overrides.css'
import Home from './components/Home'
import Login from './components/Login'
import Post from './components/Post'
import Featured from './components/Featured'
import Announcements from './components/Announcements'
import SearchResults from './components/SearchResults'
import SearchBar from './components/SearchBar'
import Admin from './components/Admin'
import Reports from './components/Reports'
import RequireAuth from './components/RequireAuth'
import ThemeSelector from './components/ThemeSelector'
import CommunityGuidelines from './components/CommunityGuidelines'
import { useAppContext } from './context/AppContext'

export default function App() {
  const { user, theme, logout } = useAppContext()
  const isAdmin = user && user.role === 'admin'
  const [showGuidelines, setShowGuidelines] = useState(false)

  useEffect(() => {
    if (user) {
      setShowGuidelines(true)
    }
  }, [user])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  // If user is not logged in, show only the login/sign-up page
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Campus Cloud</h1>
            <p className="text-gray-600 mt-2">Sign in to access the community</p>
          </div>
          <Login />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Campus Cloud</h1>
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
              <Link to="/post" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Create Post</Link>
              <Link to="/featured" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Featured</Link>
              <Link to="/announcements" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Announcements</Link>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Account</Link>
              {isAdmin && <Link to="/reports" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Review</Link>}
            </div>
            <div className="flex items-center space-x-4">
              <SearchBar />
              <ThemeSelector />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/post" element={<RequireAuth><Post /></RequireAuth>} />
              <Route path="/featured" element={<RequireAuth><Featured /></RequireAuth>} />
              <Route path="/search" element={<RequireAuth><SearchResults /></RequireAuth>} />
              <Route path="/announcements" element={<RequireAuth><Announcements /></RequireAuth>} />
              <Route path="/reports" element={<RequireAuth adminOnly={true}><Reports /></RequireAuth>} />
            </Routes>
          </div>
          {showGuidelines && (
            <aside className="hidden lg:block w-80">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Community Guidelines</h3>
                  <button
                    onClick={() => setShowGuidelines(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                    aria-label="Close community guidelines"
                  >
                    &times;
                  </button>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Share educational resources</li>
                  <li>• Be respectful to others</li>
                  <li>• Report inappropriate content</li>
                  <li>• Only .edu.in emails allowed</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Quick Stats</h4>
                  <p className="text-sm text-gray-600">Join our growing community of learners!</p>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}
