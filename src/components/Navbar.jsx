import React from 'react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import ThemeSelector from './ThemeSelector'
import { useAppContext } from '../context/AppContext'

export default function Navbar() {
  const { user, logout } = useAppContext()
  const isAdmin = user && user.role === 'admin'
  const isLoggedIn = !!user

  return (
    <header className="bg-theme-secondary shadow-sm border-b border-theme fixed top-0 left-0 right-0 z-50">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-theme-primary hover:text-theme-secondary transition-colors">
            Campus Cloud
          </Link>
          
          {/* Only show navigation links if user is logged in */}
          {isLoggedIn && (
            <nav className="flex items-center space-x-8">
              <Link to="/" className="text-theme-primary hover:text-theme-secondary font-medium transition-colors">
                Home
              </Link>
              <Link to="/post" className="text-theme-primary hover:text-theme-secondary font-medium transition-colors">
                Create Post
              </Link>
              <Link to="/featured" className="text-theme-primary hover:text-theme-secondary font-medium transition-colors">
                Featured
              </Link>
              <Link to="/announcements" className="text-theme-primary hover:text-theme-secondary font-medium transition-colors">
                Announcements
              </Link>
              <Link to="/profile" className="text-theme-primary hover:text-theme-secondary font-medium transition-colors">
                Profile
              </Link>
              {isAdmin && (
                <Link to="/reports" className="text-theme-primary hover:text-theme-secondary font-medium transition-colors">
                  Review
                </Link>
              )}
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            {/* Only show SearchBar if logged in */}
            {isLoggedIn && <SearchBar />}
            
            <ThemeSelector />
            
            {/* Show Logout button if logged in, Get Started button if not */}
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="btn-theme-primary px-4 py-2 rounded-lg font-medium transition-all"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="btn-theme-primary px-4 py-2 rounded-lg font-medium transition-all inline-block"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
