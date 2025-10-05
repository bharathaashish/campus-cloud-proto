import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './theme-overrides.css'
import Home from './components/Home'
import Login from './components/Login'
import Profile from './components/Profile'
import Post from './components/Post'
import Featured from './components/Featured'
import Announcements from './components/Announcements'
import SearchResults from './components/SearchResults'
import Admin from './components/Admin'
import Reports from './components/Reports'
import Achievements from './components/Achievements'
import RequireAuth from './components/RequireAuth'
import Navbar from './components/Navbar'
import { useAppContext } from './context/AppContext'

export default function App() {
  const { user, theme } = useAppContext()
  const location = useLocation()
  const [showGuidelines, setShowGuidelines] = useState(false)
  const isLoginPage = location.pathname === '/login'

  useEffect(() => {
    if (user) {
      setShowGuidelines(true)
    }
  }, [user])

  // Theme is now handled by AppContext, no need for this useEffect
  // useEffect(() => {
  //   document.documentElement.setAttribute('data-theme', theme)
  // }, [theme])

  return (
    <div className="min-h-screen bg-theme-primary">
      {/* Always show navbar */}
      <Navbar />
      
      {/* Add padding-top to account for fixed navbar (h-16 = 64px) */}
      <main className="pt-16 min-h-screen">
        <div className={`${!isLoginPage ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
          <div className={`${!isLoginPage ? 'flex gap-8' : ''}`}>
            <div className={`${!isLoginPage ? 'flex-1' : 'w-full'}`}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                <Route path="/post" element={<RequireAuth><Post /></RequireAuth>} />
                <Route path="/featured" element={<RequireAuth><Featured /></RequireAuth>} />
                <Route path="/search" element={<RequireAuth><SearchResults /></RequireAuth>} />
                <Route path="/announcements" element={<RequireAuth><Announcements /></RequireAuth>} />
                <Route path="/reports" element={<RequireAuth adminOnly={true}><Reports /></RequireAuth>} />
                <Route path="/achievements" element={<RequireAuth><Achievements /></RequireAuth>} />
              </Routes>
            </div>
            {showGuidelines && !isLoginPage && (
              <aside className="hidden lg:block w-80">
                <div className="bg-theme-secondary rounded-lg shadow-sm p-6 sticky top-24 border border-theme">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-theme-primary">Community Guidelines</h3>
                    <button
                      onClick={() => setShowGuidelines(false)}
                      className="text-theme-secondary hover:text-theme-primary text-xl"
                      aria-label="Close community guidelines"
                    >
                      &times;
                    </button>
                  </div>
                  <ul className="space-y-2 text-sm text-theme-secondary">
                    <li>• Share educational resources</li>
                    <li>• Be respectful to others</li>
                    <li>• Report inappropriate content</li>
                    <li>• Only .edu.in emails allowed</li>
                  </ul>
                  <div className="mt-6 pt-6 border-t border-theme">
                    <h4 className="font-medium text-theme-primary mb-2">Quick Stats</h4>
                    <p className="text-sm text-theme-secondary">Join our growing community of learners!</p>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
